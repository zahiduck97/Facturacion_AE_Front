import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { NormasService } from 'src/app/services/normas.service';
import { FormulariosService } from 'src/app/services/formularios.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { ServiciosService } from 'src/app/services/servicios.service';
import { saveAs } from "file-saver"
import * as JSZip from 'jszip';
import * as firebase from "firebase"
import Swal from 'sweetalert2'

@Component({
  selector: 'app-editar-form',
  templateUrl: './editar-form.component.html',
  styleUrls: ['./editar-form.component.css']
})
export class EditarFormComponent implements OnInit{

  
  // PAra enviar la info
  public arrayAnexos:string[]=[ 'Etiqueta', 'Empaque o Artes', 'Imágenes', 'Instructivo', 'Garantía' ];
  public arrayAnexosDictamen:string[]=[ 'Pedimento', 'Factura' ];
  public arrayCheckbox = [];
  public arrayCheckboxDictamen = [];
  public contadorArchivos = 0;
  public contadorArchivosDictamen = 0;
  public formulario;
  public arrayTrues = [];
  public arrayTrues_d = [];
  public array_files_original;
  public array_files_d_original;
  

  public preloaderActivo = false;
  public desactivado = false;
  public usuarios:any[] = [];
  public normas:any[] = [];
  public dictamenTrue = false;
  public numeros: RegExp = /[0-9]+/;
  public Storage = firebase.storage();



  // For Stepper 
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dictamenFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isOptional = false;

  // To send
  public servicio = {
    Id_Form: '',
    Id_Usuario: '',
    Id_Dictamen: '',
    Norma: 0,
    Servicio: '',
    anexos:[],
    anexos_dictamen: [],
    nombre_producto: '',
    marca_producto: '',
    pais_producto: '',
    modelo_producto: '',
    presentacion_producto: '',
    contenido_producto: '',
    pedimento:  '',
    factura: '',
    lote: '',
    domicilio: '',
    calle: '',
    colonia: '',
    municipio: '',
    estado: '',
    cp:  '',
    nombre: '',
    telefono:  '',
    fecha: ''
  }
  public servicioOriginal ;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any, 
    private _formBuilder: FormBuilder, public usuariosService: UsuariosService, private normasServices: NormasService, private _formsService: FormulariosService, public storage: AngularFireStorage, private dialogRef: MatDialogRef<EditarFormComponent>, private _service:ServiciosService
  ) { }

  

  // To start model
  ngOnInit() {
    this.servicio.Id_Form = this.data.form.Id_Form;
    this.servicio.Id_Usuario = this.data.form.Id_Usuario;
    this.servicio.Id_Dictamen = this.data.form.Id_Dictamen || '';
    this.servicio.Norma = parseInt(this.data.form.Norma);
    this.servicio.Servicio = this.data.form.Servicio;
    this.servicioOriginal = this.data.form.Servicio;
    let temp = this.data.form.anexos.split(',');
    this.array_files_original = temp;
    let arra_temp = [];

    for(let i=0; i< this.arrayAnexos.length; i++){
      if(temp.includes(i.toString())){
        arra_temp.push(this.arrayAnexos[i]);
        this.arrayTrues.push(true)
      } else {
        this.arrayTrues.push(false)
      }
    }

    if(this.servicio.Servicio == 'D'){
      let temp2 = this.data.dict.anexos_dictamen.split(',');
      this.array_files_d_original = temp2;
      let arra_temp2 = [];

      for(let i=0; i< this.arrayAnexosDictamen.length; i++){
        if(temp2.includes(i.toString())){
          arra_temp2.push(this.arrayAnexosDictamen[i]);
          this.arrayTrues_d.push(true)
        } else {
          this.arrayTrues_d.push(false)
        }
      }

      this.dictamenTrue = true;

      this.servicio.anexos_dictamen = arra_temp2 || [];
      this.servicio.pedimento = this.data.dict.pedimento || '';
      this.servicio.factura = this.data.dict.factura || '';
      this.servicio.lote = this.data.dict.lote || '';
      this.servicio.domicilio = this.data.dict.domicilio || '';
      this.servicio.calle = this.data.dict.calle_verificacion || '';
      this.servicio.colonia = this.data.dict.colonia_verificacion || '';
      this.servicio.municipio = this.data.dict.municipio_verificacion || '';
      this.servicio.estado = this.data.dict.estado_verificacion || '';
      this.servicio.cp = this.data.dict.codigo_postal_verificacion || '';
      this.servicio.nombre = this.data.dict.nombre_verificacion || '';
      this.servicio.telefono = this.data.dict.telefono_verificacion || '';
      this.servicio.fecha = this.data.dict.fecha_verificacion || '';
    } else{
      this.dictamenTrue = false;
      this.servicio.anexos_dictamen = [];
      this.servicio.pedimento = '';
      this.servicio.factura = '';
      this.servicio.lote = '';
      this.servicio.domicilio =  '';
      this.servicio.calle =  '';
      this.servicio.colonia = '';
      this.servicio.municipio =  '';
      this.servicio.estado =  '';
      this.servicio.cp = '';
      this.servicio.nombre = '';
      this.servicio.telefono = '';
      this.servicio.fecha = '';
    }
      
    
    this.servicio.anexos = arra_temp || [];
    this.servicio.nombre_producto = this.data.form.nombre_producto;
    this.servicio.marca_producto = this.data.form.marca_producto;
    this.servicio.pais_producto = this.data.form.pais_producto;
    this.servicio.modelo_producto = this.data.form.modelo_producto;
    this.servicio.presentacion_producto = this.data.form.presentacion_producto;
    this.servicio.contenido_producto = this.data.form.contenido_producto;
    

    console.log('el: ',this.servicio);

    this.firstFormGroup = this._formBuilder.group({
      empresa: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      servicio: ['', Validators.required],
      norma: ['', Validators.required],
      producto: ['', Validators.required],
      marca: ['', Validators.required],
      pais: ['', Validators.required],
      modelo: ['', Validators.required],
      presentacion: ['', Validators.required],
      contenido: ['', Validators.required]
      
    });

    this.thirdFormGroup = this._formBuilder.group({
      calle: ['', Validators.required],
      colonia: ['', Validators.required],
      municipio: ['', Validators.required],
      estado: ['', Validators.required],
      cp: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]+')])],
      nombre: ['', Validators.required],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern('^[0-9]+')])],
      fecha: ['', Validators.required]
    })

    this.dictamenFormGroup = this._formBuilder.group({
      pedimento: ['', Validators.required],
      factura: ['', Validators.required],
      lote: ['', Validators.compose([Validators.required, Validators.maxLength(5), Validators.minLength(5), Validators.pattern('^[0-9]{5}')])],
      domicilio: ['', Validators.required]
    })


    this.arrayAnexos.forEach((item, index) => {
      this.arrayCheckbox.push({
        name: item,
        active: false,
        file: []
      })
    })

    this.arrayAnexosDictamen.forEach((item, index) => {
      this.arrayCheckboxDictamen.push({
        name: item,
        active: false,
        file: []
      })
    })

    console.log(this.arrayCheckbox);
    this.getUsers();
    this.getNormas();
    
  }

  // Confirm Delete
  DeleteFiles(index, service, name){
    Swal.fire('Para poder subir nuevos archivos, primero descarga los existentes y vuelvelos a subir todos juntos').then(() => {
      Swal.fire({
        title: '¿Estas seguro que quieres borrar los archivos?',
        text: 'no habra manera de recuperarlos despues',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Borrar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          if(service == 'constancia'){
            this.arrayTrues[index] = false;
            const i = this.servicio.anexos.indexOf(name);
            this.servicio.anexos.splice(i,1);
            this.array_files_original.splice(i,1);
          }
          else {
            this.arrayTrues_d[index] = false;
            const i = this.servicio.anexos_dictamen.indexOf(name);
            this.servicio.anexos_dictamen.splice(i,1);
            this.array_files_d_original.splice(i,1);
          }
          
          console.log(this.array_files_original);
        }
      });
    })
  }

  // Download the files
  descargarArchivo(name){
    var file = this.Storage.ref(`Pre_Servicio/${this.servicio.Id_Form}/${name}.rar`);
    file.getDownloadURL().then(url => {
      saveAs(url, `${name}-${this.servicio.Id_Form}.rar`);
    })
    .catch(e => {
      console.log('hubo un error, sorry');
      console.log(e);
    })
  }

  // Get All Empresas
  getUsers(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this.usuariosService.getUserTramitadores()
      .subscribe(
        usuarios => {
          this.usuarios = usuarios;
          this.preloaderActivo = false;
          this.desactivado = false;
          console.log(this.usuarios);
        },
        err => {
          if(!err.error.mensaje){ 
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El servidor no esta conectado'
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error.mensaje
            })
          }
          this.preloaderActivo = false;
          this.desactivado = false;
        }
      )
  }

  // Get all norms
  getNormas(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this.normasServices.getNormas()
      .subscribe(
        normas => {
          this.normas = normas;
          this.preloaderActivo = false;
          this.desactivado = false;
        },
        err => {
          if(!err.error.mensaje){ 
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El servidor no esta conectado'
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error.mensaje
            })
          }
          this.preloaderActivo = false;
          this.desactivado = false;
        }
      )
  }

  

  // Para archivos
  cambiarContador(data, index){
    console.log(data)
    if(data.active == true){
      console.log('1')
      this.contadorArchivos += 1;
    }
    else if(data.active == false && data.file == ''){
      //this.arrayCheckbox[index].file = '';
      this.contadorArchivos -= 1;
      console.log('2')
    }
    else{
      this.arrayCheckbox[index].file = '';
      console.log('3')
    }
    console.log(this.contadorArchivos)
  }

  borrarfile(value, file, e){
    if(file == '')
      this.contadorArchivos -= 1;
    console.log(this.arrayCheckbox);
    return e.target.files;
  }

  cambiarContadorDictamen(data, index){
    console.log(data)
    if(data.active == true)
      this.contadorArchivosDictamen += 1;
    else if(data.active == false && data.file !== ''){
      this.arrayCheckboxDictamen[index].file = '';
    }
    else{
      this.contadorArchivosDictamen -= 1;
    }
  }

  borrarfileDictamen(value, file, e){
    if(file == '')
      this.contadorArchivosDictamen -= 1;
    console.log(this.arrayCheckboxDictamen);
    return e.target.files;
  }

  // // Enviar el formulario
  enviarForm(){
    console.log(this.servicio);
    this.preloaderActivo = true;
    this.desactivado = true;
    const storageRef = firebase.storage().ref();
    

    // Convert string into number in anxos
    this.arrayAnexos.forEach((e, i) => {
      if(this.servicio.anexos.includes(e)){
        var posicion = this.servicio.anexos.indexOf(e)
        this.servicio.anexos[posicion] = i.toString();
      } else {
        if(this.arrayCheckbox[i].active){
          this.servicio.anexos.splice(i,0,i.toString());
        }
      }
    });

    if(this.servicioOriginal == this.servicio.Servicio){
      if(this.servicio.Servicio == 'C'){
        
        console.log('files', this.array_files_original);
        console.log('ane: ', this.servicio.anexos);

        // Inserting  constancia
        this._formsService.updateForm(this.servicio).subscribe(
          resu => {

            // // to check what file is new and what have to be deleted
            for(let i=0; i<5; i++){
              if(this.servicio.anexos.includes(i.toString()) == false && this.array_files_original.includes(i.toString()) == true){
                var ref = storageRef.child(`Pre_Servicio/${this.servicio.Id_Form}/${this.arrayAnexos[i]}.rar`);
                ref.delete().then(res => {
                  console.log(`Se borro ${this.arrayAnexos[i]}`);
                })
                .catch(e => {
                  console.log(`No se pudo borrar ${this.arrayAnexos[i]}`);
                })
              } else if(this.servicio.anexos.includes(i.toString()) == true && this.array_files_original.includes(i.toString()) == false) {
                
                const jszip = new JSZip();
                
                // Zipig the files
                if(this.arrayCheckbox[i].file.length > 0){
                  for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                    jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                  }

                  // inside cannot put this
                  const name = this.arrayCheckbox[i].name;
                  const id = this.servicio.Id_Form;

                  jszip.generateAsync({ type: 'blob' }).then(function(content) {
                    var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                    referencia.put(content).then(() => {
                      console.log(`Se subio el ${name}`);
                    })
                  });
                }
              }
            }


            this.preloaderActivo = false;
            this.desactivado = false;
            this.dialogRef.close('ok');
            Swal.fire({
              icon: 'success',
              title: 'Se actualizo el registro'
            })
            
          }, 
          e => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: e.error.mensaje
            })
          }
        )
        
      } else {

        // Convert string into number in anexos dictamen
        this.arrayAnexosDictamen.forEach((e, i) => {
          if(this.servicio.anexos_dictamen.includes(e)){
            var posicion = this.servicio.anexos_dictamen.indexOf(e)
            this.servicio.anexos_dictamen[posicion] = i.toString();
          } else {
            if(this.arrayCheckboxDictamen[i].active){
              this.servicio.anexos_dictamen.splice(i,0,i.toString());
            }
          }
        });

        // Inserting Dictamen
        this._formsService.updateDictamen(this.servicio).subscribe(
          res => {
            this._formsService.updateForm(this.servicio).subscribe(
              resu => {

                // // to check what file is new and what have to be deleted in anexos
                for(let i=0; i<5; i++){
                  if(this.servicio.anexos.includes(i.toString()) == false && this.array_files_original.includes(i.toString()) == true){
                    var ref = storageRef.child(`Pre_Servicio/${this.servicio.Id_Form}/${this.arrayAnexos[i]}.rar`);
                    ref.delete().then(res => {
                      console.log(`Se borro ${this.arrayAnexos[i]}`);
                    })
                    .catch(e => {
                      console.log(`No se pudo borrar ${this.arrayAnexos[i]}`);
                    })
                  } else if(this.servicio.anexos.includes(i.toString()) == true && this.array_files_original.includes(i.toString()) == false) {
                    
                    const jszip = new JSZip();
                    
                    // Zipig the files
                    if(this.arrayCheckbox[i].file.length > 0){
                      for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                        jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                      }

                      // inside cannot put this
                      const name = this.arrayCheckbox[i].name;
                      const id = this.servicio.Id_Form;

                      jszip.generateAsync({ type: 'blob' }).then(function(content) {
                        var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                        referencia.put(content).then(() => {
                          console.log(`Se subio el ${name}`);
                        })
                      });
                    }
                  }
                }

                // // to check what file is new and what have to be deleted in anexos dictamen
                for(let i=0; i<2; i++){
                  if(this.servicio.anexos_dictamen.includes(i.toString()) == false && this.array_files_d_original.includes(i.toString()) == true){
                    var ref = storageRef.child(`Pre_Servicio/${this.servicio.Id_Form}/${this.arrayAnexosDictamen[i]}.rar`);
                    ref.delete().then(res => {
                      console.log(`Se borro ${this.arrayAnexosDictamen[i]}`);
                    })
                    .catch(e => {
                      console.log(`No se pudo borrar ${this.arrayAnexosDictamen[i]}`);
                    })
                  } else if(this.servicio.anexos_dictamen.includes(i.toString()) == true && this.array_files_d_original.includes(i.toString()) == false) {
                    
                    const jszip = new JSZip();
                    
                    // Zipig the files
                    if(this.arrayCheckboxDictamen[i].file.length > 0){
                      for(let j = 0; j < this.arrayCheckboxDictamen[i].file.length; j++){
                        jszip.file(this.arrayCheckboxDictamen[i].file[j].name, this.arrayCheckboxDictamen[i].file[j], { base64: true } );
                      }

                      // inside cannot put this
                      const name = this.arrayCheckboxDictamen[i].name;
                      const id = this.servicio.Id_Form;

                      jszip.generateAsync({ type: 'blob' }).then(function(content) {
                        var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                        referencia.put(content).then(() => {
                          console.log(`Se subio el ${name}`);
                        })
                      });
                    }
                  }
                }
                
                this.preloaderActivo = false;
                this.desactivado = false;
                Swal.fire({
                  icon: 'success',
                  title: 'Se actualizo el registro'
                })
                this.dialogRef.close('ok');
              },
              e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: e.error.mensaje
                })
              }
            )
          },
          e => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: e.error.mensaje
            })
          }
        )
      }
    } else {
      if(this.servicio.Servicio == 'C'){
        
        console.log('files', this.array_files_original);
        console.log('ane: ', this.servicio.anexos);
        
        this._formsService.updateForm(this.servicio).subscribe(resu => {
          // Inserting  constancia
            var service = {
              Id_Form : this.servicio.Id_Form,
              Id_Usuario: this.servicio.Id_Usuario,
              Id_Dictamen: ''
            }

            this._service.putService(service).subscribe(res => { }, e => {}, () => {
              // // to check what file is new and what have to be deleted
              for(let i=0; i<5; i++){
                if(this.servicio.anexos.includes(i.toString()) == false && this.array_files_original.includes(i.toString()) == true){
                  var ref = storageRef.child(`Pre_Servicio/${this.servicio.Id_Form}/${this.arrayAnexos[i]}.rar`);
                  ref.delete().then(res => {
                    console.log(`Se borro ${this.arrayAnexos[i]}`);
                  })
                  .catch(e => {
                    console.log(`No se pudo borrar ${this.arrayAnexos[i]}`);
                  })
                } else if(this.servicio.anexos.includes(i.toString()) == true && this.array_files_original.includes(i.toString()) == false) {
                  
                  const jszip = new JSZip();
                  
                  // Zipig the files
                  if(this.arrayCheckbox[i].file.length > 0){
                    for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                      jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                    }

                    // inside cannot put this
                    const name = this.arrayCheckbox[i].name;
                    const id = this.servicio.Id_Form;

                    jszip.generateAsync({ type: 'blob' }).then(function(content) {
                      var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                      referencia.put(content).then(() => {
                        console.log(`Se subio el ${name}`);
                      })
                    });
                  }
                }
              }

              this._formsService.deleteDictamen(this.servicio.Id_Dictamen).subscribe(res => {
              
    
    
                  this.preloaderActivo = false;
                  this.desactivado = false;
                  this.dialogRef.close('ok');
                  Swal.fire({
                    icon: 'success',
                    title: 'Se actualizo el registro'
                  })
                  
                }, 
                e => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: e.error.mensaje
                  })
                }
              )
            })
        })
      } else {
        console.log('soy diferente y ahora soy un dictamen');

        // Convert string into number in anexos dictamen
        this.arrayAnexosDictamen.forEach((e, i) => {
          if(this.servicio.anexos_dictamen.includes(e)){
            var posicion = this.servicio.anexos_dictamen.indexOf(e)
            this.servicio.anexos_dictamen[posicion] = i.toString();
          } else {
            if(this.arrayCheckboxDictamen[i].active){
              this.servicio.anexos_dictamen.splice(i,0,i.toString());
            }
          }
        });

        // Inserting Dictamen
        this._formsService.postDictamen(this.servicio).subscribe(
          res => {
            this.servicio.Id_Dictamen = res;
            this._formsService.updateForm(this.servicio).subscribe(
              resu => {
                var temporal = {
                  Id_Form : this.servicio.Id_Form,
                  Id_Usuario: this.servicio.Id_Usuario,
                  Id_Dictamen: res
                }

                this._service.putService(temporal).subscribe(ress => {

                  // // to check what file is new and what have to be deleted in anexos
                  for(let i=0; i<5; i++){
                    if(this.servicio.anexos.includes(i.toString()) == false && this.array_files_original.includes(i.toString()) == true){
                      var ref = storageRef.child(`Pre_Servicio/${this.servicio.Id_Form}/${this.arrayAnexos[i]}.rar`);
                      ref.delete().then(res => {
                        console.log(`Se borro ${this.arrayAnexos[i]}`);
                      })
                      .catch(e => {
                        console.log(`No se pudo borrar ${this.arrayAnexos[i]}`);
                      })
                    } else if(this.servicio.anexos.includes(i.toString()) == true && this.array_files_original.includes(i.toString()) == false) {
                      
                      const jszip = new JSZip();
                      
                      // Zipig the files
                      if(this.arrayCheckbox[i].file.length > 0){
                        for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                          jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                        }

                        // inside cannot put this
                        const name = this.arrayCheckbox[i].name;
                        const id = this.servicio.Id_Form;

                        jszip.generateAsync({ type: 'blob' }).then(function(content) {
                          var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                          referencia.put(content).then(() => {
                            console.log(`Se subio el ${name}`);
                          })
                        });
                      }
                    }
                  }

                  // // to check what file is new and what have to be deleted in anexos dictamen
                  for(let i=0; i<2; i++){
                    if(this.servicio.anexos_dictamen.includes(i.toString()) == true) {
                      
                      const jszip = new JSZip();
                      
                      // Zipig the files
                      if(this.arrayCheckboxDictamen[i].file.length > 0){
                        for(let j = 0; j < this.arrayCheckboxDictamen[i].file.length; j++){
                          jszip.file(this.arrayCheckboxDictamen[i].file[j].name, this.arrayCheckboxDictamen[i].file[j], { base64: true } );
                        }

                        // inside cannot put this
                        const name = this.arrayCheckboxDictamen[i].name;
                        const id = this.servicio.Id_Form;

                        jszip.generateAsync({ type: 'blob' }).then(function(content) {
                          var referencia = storageRef.child(`Pre_Servicio/${id}/${name}.rar`);
                          referencia.put(content).then(() => {
                            console.log(`Se subio el ${name}`);
                          })
                        });
                      }
                    }
                  }

                }, e => {}, () => {
                  this.preloaderActivo = false;
                  this.desactivado = false;
                  Swal.fire({
                    icon: 'success',
                    title: 'Se actualizo el registro'
                  })
                  this.dialogRef.close('ok');
                });

                
              },
              e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: e.error.mensaje
                })
              }
            )
          },
          e => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: e.error.mensaje
            })
          }
        )
      }
    }
    
  }
  /// te quedaste en ver lo de que no se cierra y recarga completamente y por ultimo lo de dictamenees

  handleChange(evt) {
    var target = evt.target.attributes.value.nodeValue
    if(target == 'C'){
      this.dictamenTrue = false;
    } else {
      this.dictamenTrue = true;
    }
  }

}
