import { Component, OnInit, Inject } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-empleados-user',
  templateUrl: './edit-empleados-user.component.html',
  styleUrls: ['./edit-empleados-user.component.css']
})
export class EditEmpleadosUserComponent implements OnInit {
  
  public empleados;
  public preloaderActivo = false;
  public desactivado = false;

  
  constructor(
    private empleadosService: EmpleadosService, public _snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<EditEmpleadosUserComponent>, private usuariosService: UsuariosService, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    this.empleadosService.getEmpleados()
      .subscribe(
        empleados => {
          console.log(this.data)
          this.empleados = empleados;
          console.log(this.empleados);
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
  async editarEmpleado(){
    this.preloaderActivo = true;
    this.desactivado = true;
    console.log(this.data.empleado)
    await this.usuariosService.putUser(this.data.empleado).toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Se edito el usuario'
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
