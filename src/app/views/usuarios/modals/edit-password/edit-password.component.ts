import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements AfterViewChecked {

  public preloaderActivo = false;
  public desactivado = false;
  public isDifferent = false;
  public usuario = {
    Id_Usuario:0,
    password: '',
    confirm: ''
  }
  
  ngAfterViewChecked(){
    this.usuario.Id_Usuario = this.data.usuario.Id_Usuario;
  }
  
  constructor(
    public _snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<EditPasswordComponent>, private usuariosService: UsuariosService, @Inject(MAT_DIALOG_DATA) public data:any) { }


  cerrarModal(){
    this.dialogRef.close();
  }

  
  // Te quedaste aqui, ibas a editar
  async editarPassword(){
    console.log(this.usuario);
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.usuariosService.putPassword(this.usuario).toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Se cambio la contraseña'
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
