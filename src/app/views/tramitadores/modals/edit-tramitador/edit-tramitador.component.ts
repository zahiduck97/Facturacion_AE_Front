import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TramitadoresService } from 'src/app/services/tramitadores.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-tramitador',
  templateUrl: './edit-tramitador.component.html',
  styleUrls: ['./edit-tramitador.component.css']
})
export class EditTramitadorComponent implements OnInit {

  // Norma para enviar en post
  public tramitador = {
    Id_Tramitador: 0,
    nombre_tramitador: '',
    email_tramitador: '',
    telefono_tramitador: '',
    facturar_a: '',
    Id_Empresa: ''
  }

  public preloaderActivo = false;
  public desactivado = false;
  public empresas:any[] = [];
  selected = '';

  constructor(
    public dialogRef: MatDialogRef<EditTramitadorComponent>,
    public tramitadorServices: TramitadoresService,
    public empresasService: EmpresasService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {  }


  mayus(value){
    value = value.toUpperCase();
    return value;
  }
  
  ngOnInit(){
    this.preloaderActivo = true;
    this.desactivado = true;
    console.log(this.data.tramitador);
    this.empresasService.getEmpresas()
      .subscribe(
        empresas => {
           empresas.forEach((item,index) => {
             this.empresas.push({ Id_Empresa: item.Id_Empresa, razonSocial: item.razonSocial })
           })
          console.log(this.empresas);
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


   // Close the modal
   cerrarModal(){
    this.dialogRef.close();
  }


  // Put a Norm
  async putTramitador(){
    this.preloaderActivo = true;
    this.desactivado = true;
    console.log(this.data.tramitador);
    await this.tramitadorServices.putTramitador(this.data.tramitador).toPromise()
      .then( normadb => {
        Swal.fire({
          icon: 'success',
          title: 'Se edito el tramitador'
        })
        this.dialogRef.close(true);
      })
      .catch(e => {
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
      }).finally(() => {
        this.preloaderActivo = false;
        this.desactivado = false;
      });
  }

}
