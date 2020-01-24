import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormulariosService } from 'src/app/services/formularios.service';
import { saveAs } from "file-saver";
import { AngularFireStorage } from 'angularfire2/storage';

import * as firebase from "firebase";
import * as JSZip from 'jszip';
import Swal from 'sweetalert2'
import { InformacionEmpresaComponent } from 'src/app/views/empresas/modals/informacion-empresa/informacion-empresa.component';
import { EditarFormComponent } from '../../modals/editar-form/editar-form.component';
import { FacturaComponent } from '../../modals/Factura/factura/factura.component';
import { EditServicioClienteComponent } from '../edit-servicio-cliente/edit-servicio-cliente.component';

@Component({
  selector: 'app-informacion-cliente',
  templateUrl: './informacion-cliente.component.html',
  styleUrls: ['./informacion-cliente.component.css']
})
export class InformacionClienteComponent implements OnInit {

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



  ngOnInit() {
    console.log(this.data);
    this.array_Anexos = this.data.info.anexos.split(',');
    console.log(this.array_Anexos);
    if(this.data.info.Servicio == 'D')
      this._formulario.getDictamen(this.data.info.Id_Dictamen).subscribe(res => {
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
            const respuesta = this.dialog.open(EditServicioClienteComponent, {
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
    
        const respuesta = this.dialog.open(EditServicioClienteComponent, {
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
  
}
