import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NormasService } from 'src/app/services/normas.service';
import { FormulariosService } from 'src/app/services/formularios.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from "firebase";
import * as JSZip from 'jszip';
import { MatDialogRef } from '@angular/material/dialog';
import { ServiciosService } from 'src/app/services/servicios.service';
import Swal from "sweetalert2";




@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css']
})
export class NuevoServicioComponent implements OnInit {

  // PAra enviar la info
  public arrayAnexos:string[]=[ 'Etiqueta', 'Empaque o Artes', 'Imágenes', 'Instructivo', 'Garantía' ];
  public arrayAnexosDictamen:string[]=[ 'Pedimento', 'Factura' ];
  public arrayCheckbox = [];
  public arrayCheckboxDictamen = [];
  public contadorArchivos = 0;
  public contadorArchivosDictamen = 0;
  

  public preloaderActivo = false;
  public desactivado = false;
  public usuarios:any[] = [];
  public normas:any[] = [];
  public dictamenTrue = false;
  public numeros: RegExp = /[0-9]+/;


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
    Norma: '',
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

 
  // Constructor
  constructor(private _formBuilder: FormBuilder, public usuariosService: UsuariosService, private normasServices: NormasService, private _formsService: FormulariosService, public storage: AngularFireStorage, private dialogRef: MatDialogRef<NuevoServicioComponent>, private _service:ServiciosService) {}

  // To start model
  ngOnInit() {
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
    if(data.active == true)
      this.contadorArchivos += 1;
    else if(data.active == false && data.file == ''){
      this.contadorArchivos -= 1;
    }
    else{
      this.arrayCheckbox[index].file = '';
    }
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
    else if(data.active == false && data.file == ''){
      this.contadorArchivosDictamen -= 1;
    }
    else{
      this.arrayCheckboxDictamen[index].file = '';
    }
  }

  borrarfileDictamen(value, file, e){
    if(file == '')
      this.contadorArchivosDictamen -= 1;
    console.log(this.arrayCheckboxDictamen);
    return e.target.files;
  }

  // Enviar el formulario
  enviarForm(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this.servicio.Norma = this.secondFormGroup.get('norma').value
    this.servicio.Servicio = this.secondFormGroup.get('servicio').value
    this.servicio.nombre_producto = this.secondFormGroup.get('producto').value
    this.servicio.marca_producto = this.secondFormGroup.get('marca').value
    this.servicio.pais_producto = this.secondFormGroup.get('pais').value
    this.servicio.modelo_producto = this.secondFormGroup.get('modelo').value
    this.servicio.presentacion_producto = this.secondFormGroup.get('presentacion').value
    this.servicio.contenido_producto = this.secondFormGroup.get('contenido').value
    this.servicio.Id_Usuario = this.firstFormGroup.get('empresa').value
    

    var formDataDictamen;

    // To get Anexos 
    for(let i = 0; i < this.arrayCheckbox.length; i ++){
      if(this.arrayCheckbox[i].file.length > 0){
        console.log('entre');
        this.servicio.anexos.push(i.toString());
      }
    }
    

    console.log(this.servicio);
  
    if(this.servicio.Servicio == 'C'){
      
      // Inserting  constancia
      this._formsService.postConstancia(this.servicio).subscribe(
        resu => {
          var res = resu;
          var service = {
            Id_Form : res,
            Id_Usuario: this.servicio.Id_Usuario
          }

          // Inserting service
          this._service.postService(service).subscribe(
            resul => {
                
            if(this.servicio.anexos.length > 0){
            
              for(let i = 0; i < this.arrayCheckbox.length; i ++){
                const jszip = new JSZip();
                
                if(this.arrayCheckbox[i].file.length > 0){
                  for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                    jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                  }
                  
                  const name = this.arrayCheckbox[i].name;
  
                  jszip.generateAsync({ type: 'blob' }).then(function(content) {
                    const storageRef = firebase.storage().ref();
                    var referencia = storageRef.child(`Pre_Servicio/${res}/${name}.rar`);
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
              title: 'Se inserto el registro'
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
      
    } else {

      // To get Anexos Dictamen
      for(let i = 0; i < this.arrayCheckboxDictamen.length; i ++){
        if(this.arrayCheckboxDictamen[i].file.length > 0){
          console.log('entre');
          this.servicio.anexos_dictamen.push(i.toString());
        }
      }

      this.servicio.pedimento = this.dictamenFormGroup.get('pedimento').value
      this.servicio.factura = this.dictamenFormGroup.get('factura').value
      this.servicio.lote = this.dictamenFormGroup.get('lote').value
      this.servicio.domicilio = this.dictamenFormGroup.get('domicilio').value
      this.servicio.calle = this.thirdFormGroup.get('calle').value
      this.servicio.colonia = this.thirdFormGroup.get('colonia').value
      this.servicio.municipio = this.thirdFormGroup.get('municipio').value
      this.servicio.estado = this.thirdFormGroup.get('estado').value
      this.servicio.cp = this.thirdFormGroup.get('cp').value
      this.servicio.nombre = this.thirdFormGroup.get('nombre').value
      this.servicio.telefono = this.thirdFormGroup.get('telefono').value
      this.servicio.fecha = this.thirdFormGroup.get('fecha').value

      // Inserting Dictamen
      this._formsService.postDictamen(this.servicio).subscribe( res => {
        this.servicio.Id_Dictamen = res;

        // inserting dictamen
        this._formsService.postConstancia(this.servicio).subscribe(resu => {
          var service = {
            Id_Form : resu,
            Id_Usuario: this.servicio.Id_Usuario,
            Id_Dictamen: res
          }

          // Inserting Service in dictamenes
          this._service.postService(service).subscribe( resul => {

            // Inserting files 
            if(this.servicio.anexos.length > 0){
            
              for(let i = 0; i < this.arrayCheckbox.length; i ++){
                const jszip = new JSZip();
                
                if(this.arrayCheckbox[i].file.length > 0){
                  for(let j = 0; j < this.arrayCheckbox[i].file.length; j++){
                    jszip.file(this.arrayCheckbox[i].file[j].name, this.arrayCheckbox[i].file[j], { base64: true } );
                  }
                  
                  const name = this.arrayCheckbox[i].name;
  
                  jszip.generateAsync({ type: 'blob' }).then(function(content) {
                    const storageRef = firebase.storage().ref();
                    var referencia = storageRef.child(`Pre_Servicio/${resu}/${name}.rar`);
                    referencia.put(content).then(() => {
                      console.log(`Se subio el ${name}`);
                    })
                  });
                }
              }

            }

            // inserting files in dictamenes
            if(this.servicio.anexos_dictamen.length > 0){
            
              for(let i = 0; i < this.arrayCheckboxDictamen.length; i ++){
                const jszip = new JSZip();
                
                if(this.arrayCheckboxDictamen[i].file.length > 0){
                  for(let j = 0; j < this.arrayCheckboxDictamen[i].file.length; j++){
                    jszip.file(this.arrayCheckboxDictamen[i].file[j].name, this.arrayCheckboxDictamen[i].file[j], { base64: true } );
                  }
                  
                  const name = this.arrayCheckboxDictamen[i].name;
  
                  jszip.generateAsync({ type: 'blob' }).then(function(content) {
                    const storageRef = firebase.storage().ref();
                    var referencia = storageRef.child(`Pre_Servicio/${resu}/${name}.rar`);
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
              title: 'Se inserto el registro'
            })
            this.dialogRef.close('ok');


          },
          e => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: e.error.mensaje
            })
          })

          
        },
        e => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.error.mensaje
          })
        })
      },
      e => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e.error.mensaje
        })
      })

    }
      
  }
  

  handleChange(evt) {
    var target = evt.target.attributes.value.nodeValue
    if(target == 'C'){
      this.dictamenTrue = false;
    } else {
      this.dictamenTrue = true;
    }
  }
    
}


