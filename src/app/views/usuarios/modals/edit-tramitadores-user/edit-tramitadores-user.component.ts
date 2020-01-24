import { Component, OnInit, Inject } from '@angular/core';
import { TramitadoresService } from 'src/app/services/tramitadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-tramitadores-user',
  templateUrl: './edit-tramitadores-user.component.html',
  styleUrls: ['./edit-tramitadores-user.component.css']
})
export class EditTramitadoresUserComponent implements OnInit {

  public tramitadores;
  public preloaderActivo = false;
  public desactivado = false;

  
  constructor(
    private tramitadorService:TramitadoresService, public _snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<EditTramitadoresUserComponent>, private usuariosService: UsuariosService, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    this.tramitadorService.getTramitador()
      .subscribe(
        tramitadores => {
          console.log(this.data)
          this.tramitadores = tramitadores;
          console.log(this.tramitadores);
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


  cerrarModal(){
    this.dialogRef.close();
  }
  
  // Te quedaste aqui, ibas a editar
  async editarTramitador(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.usuariosService.putUser(this.data.tramitador).toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Se edito el usuario',
          })
          this.dialogRef.close(true);
        }
      )
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
      }).finally( () => {
        this.preloaderActivo = false;
        this.desactivado = false;
      })
  }

}
