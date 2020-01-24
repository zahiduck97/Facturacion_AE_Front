import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormulariosService } from 'src/app/services/formularios.service';
import { saveAs } from "file-saver";
import { AngularFireStorage } from 'angularfire2/storage';
import { EditarFormComponent } from '../editar-form/editar-form.component';
import { FacturaComponent } from '../Factura/factura/factura.component';
import * as firebase from "firebase";
import * as JSZip from 'jszip';
import Swal from 'sweetalert2'
import { InformacionEmpresaComponent } from 'src/app/views/empresas/modals/informacion-empresa/informacion-empresa.component';


@Component({
  selector: 'app-informacion-servicio',
  templateUrl: './informacion-servicio.component.html',
  styleUrls: ['./informacion-servicio.component.css']
})
export class InformacionServicioComponent implements OnInit {

  public dictamenInfo;
  public preloaderActivo = false;
  public desactivado = false;
  public array_Anexos = [];
  public array_Anexos_dictamen = [];
  public arrayAnexos:string[]=[ 'Etiqueta', 'Empaque o Artes', 'Imágenes', 'Instructivo', 'Garantía' ];
  public arrayAnexosDictamen:string[]=[ 'Pedimento', 'Factura' ];

  // Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any, 
    public dialogRef: MatDialogRef<InformacionEmpresaComponent>,
    public dialog: MatDialog, 
    private _formulario: FormulariosService, 
    private AngularFire: AngularFireStorage,
    ) { }



  async ngOnInit() {
    console.log(this.data);
    this.array_Anexos = this.data.info.anexos.split(',');
    console.log(this.array_Anexos);
    if(this.data.info.Servicio == 'D')
      await this._formulario.getDictamen(this.data.info.Id_Dictamen).subscribe(res => {
        this.dictamenInfo = res;
        this.array_Anexos_dictamen = this.dictamenInfo.anexos_dictamen.split(',');
        console.log(this.dictamenInfo);
        console.log(this.array_Anexos_dictamen);
        // Te quedaste en que ibas a empezar a llenar la info de la constancia o el dictamen
      },
      e => {
        if(!e.error.mensaje)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El servidor no esta conectado'
          })
        else 
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.error.mensaje
          })
      }
      )
  }

  // close modal
  cerralModal(){
    this.dialogRef.close();
  }

  // Editar Form
  editarForm(){
    var formulario_temp;
    this._formulario.get1Form(this.data.info.Id_Form).subscribe(async res => {
      formulario_temp = res;
      var dictamen_temp = {};

      if(formulario_temp.Id_Dictamen){
        this._formulario.getDictamen(formulario_temp.Id_Dictamen) 
          .subscribe( async resul => {
            const respuesta = this.dialog.open(EditarFormComponent, {
              data: { form: formulario_temp, dict: resul },
              width: '700px'
            })

            await respuesta.afterClosed().subscribe(res => {
              if(res){
                this.dialogRef.close('ok');
              }
            })
          },
          e => {
            console.log('hubo pedos');
          })
      } else {
    
        const respuesta = this.dialog.open(EditarFormComponent, {
          data: { form: formulario_temp, dict: dictamen_temp },
          width: '700px'
        })

        await respuesta.afterClosed().subscribe(res => {
          if(res){
            this.dialogRef.close('ok');
          }
        })
      }
    })
  }

  // Delete
  borrarFile(Id){
    Swal.fire({
      title: '¿Estas seguro que quieres borrar este Servicio',
      text: 'no habra manera de recuperar los datos despues',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        if(this.data.info.Servicio == 'D'){
          this._formulario.deleteDictamen(this.dictamenInfo.Id_Dictamen).subscribe(res => {
            Swal.fire(
              'Se borro el servicio satisfactoriamente',
              '',
              'success'
            )
            this.dialogRef.close('ok');
          },
          e => {
            Swal.fire(
              e.error.mensaje,
              'error'
            )
            console.log(e);
          }) 
        } else {
          this._formulario.deleteConstancia(this.data.info.Id_Form).subscribe(res => {
            Swal.fire(
              'Se borro el servicio satisfactoriamente',
              '',
              'success'
            )
            this.dialogRef.close('ok');
          },
          e => {
            Swal.fire(
              e.error.mensaje,
              'error'
            )
            console.log(e);
          }) 
        }
      }
    });
  }

  // open the factura
  abrirFactura(){
    var formulario_temp;
    this._formulario.get1FormEmpresa(this.data.info.Id_Form).subscribe(async res => {
      formulario_temp = res;
      var dictamen_temp = {};

      if(formulario_temp.Id_Dictamen){
        this._formulario.getDictamen(formulario_temp.Id_Dictamen) 
          .subscribe( async resul => {
            const respuesta = this.dialog.open(FacturaComponent, {
              data: { form: formulario_temp, dict: resul },
              width: '700px'
            })

            await respuesta.afterClosed().subscribe(res => {
              if(res){
                this.dialogRef.close('ok');
              }
            })
          },
          e => {
            console.log('hubo pedos');
          })
      } else {
    
        const respuesta = this.dialog.open(FacturaComponent, {
          data: { form: formulario_temp, dict: dictamen_temp },
          width: '700px'
        })

        await respuesta.afterClosed().subscribe(res => {
          if(res){
            this.dialogRef.close('ok');
          }
        })
      }
    })
  }

  // Pre Service
  generarPreservice(){
    var temporal = this.data.info;
    this.preloaderActivo = true;
    this.desactivado = true;

    // Get info of empresa
    this._formulario.get1FormEmpresa(this.data.info.Id_Form)
      .subscribe(res => {
        const aux = res;
        temporal['razonSocial'] = res['razonSocial'];
        temporal['numeroContrato'] = res['numeroContrato'];
        temporal['rfc'] = aux['rfc'];
        temporal['calle'] = aux['calle'];
        temporal['interior'] = aux['numeroInterior'];
        temporal['exterior'] = aux['numeroExterior'];
        temporal['colonia'] = aux['colonia'];
        temporal['municipio'] = aux['municipio'];
        temporal['estado'] = aux['estado'];
        temporal['codigo_postal'] = aux['codigo_postal'];
        temporal['representante'] = aux['representante'];
        temporal['tramitador'] = aux['nombre_tramitador']
        temporal['telefono'] = aux['telefono_tramitador'];
        temporal['email'] = aux['email_tramitador'];

        console.log(temporal);
        // Sending constabce
        if(this.data.info.Servicio == 'C'){
          this._formulario.getPreservice(temporal)
          .subscribe(res => {
            saveAs(res, 'presolicitud.pdf');
            this.preloaderActivo = false;
            this.desactivado = false;
          },
          e => {
            console.log(e);
            if(!e.error.mensaje)
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El servidor no esta conectado'
              })
            else 
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e.error.mensaje
              })
            this.preloaderActivo = false;
            this.desactivado = false;
          })
        } else {
          temporal['anexos_dictamen'] = this.dictamenInfo.anexos_dictamen;
          temporal['calle_verificacion'] = this.dictamenInfo.calle_verificacion;
          temporal['codigo_postal_verificacion'] = this.dictamenInfo.codigo_postal_verificacion;
          temporal['colonia_verificacion'] = this.dictamenInfo.colonia_verificacion;
          temporal['domicilio'] = this.dictamenInfo.domicilio;
          temporal['estado_verificacion'] = this.dictamenInfo.estado_verificacion;
          temporal['factura'] = this.dictamenInfo.factura;
          temporal['fecha_verificacion'] = this.dictamenInfo.fecha_verificacion;
          temporal['lote'] = this.dictamenInfo.lote;
          temporal['municipio_verificacion'] = this.dictamenInfo.municipio_verificacion;
          temporal['nombre_verificacion'] = this.dictamenInfo.nombre_verificacion;
          temporal['pedimento'] = this.dictamenInfo.pedimento;
          temporal['telefono_verificacion'] = this.dictamenInfo.telefono_verificacion;
          temporal['fraccion'] = this.dictamenInfo.fraccion;
          temporal['exterior_v'] = this.dictamenInfo.numeroExterior;
          temporal['interior_v']  = this.dictamenInfo.numeroInterior;
          this._formulario.getPreservice(temporal)
          .subscribe(res => {
            saveAs(res, 'presolicitud.pdf');
            this.preloaderActivo = false;
            this.desactivado = false;
          },
          e => {
            console.log(e);
            if(!e.error.mensaje)
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El servidor no esta conectado'
              })
            else 
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: e.error.mensaje
              })

            this.preloaderActivo = false;
            this.desactivado = false;
          })
          
        }
      },
      e => {
        if(!e.error.mensaje)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El servidor no esta conectado'
          })
        else 
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.error.mensaje
          })

        this.preloaderActivo = false;
        this.desactivado = false;
      })

  }

  // Final Service
  generarService(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this._formulario.getFinalService(this.data.info.Id_Form).subscribe(res => {
      saveAs(res, 'solicitud.pdf');
      this.preloaderActivo = false;
      this.desactivado = false;
    },
    e => {
      console.log(e);
      if(!e.error.mensaje)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El servidor no esta conectado'
        })
      else 
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e.error.mensaje
        })
      
      this.preloaderActivo = false;
      this.desactivado = false;
    }); 
  }
}
