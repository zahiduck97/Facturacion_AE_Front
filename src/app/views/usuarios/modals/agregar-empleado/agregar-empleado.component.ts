import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.component.html',
  styleUrls: ['./agregar-empleado.component.css']
})
export class AgregarEmpleadoComponent implements OnInit {

  public empleados;
  public preloaderActivo = false;
  public desactivado = false;
  public confirm='';
  public isDifferent = false;

  public empleado = {
    Id_Empleado: '',
    userEmail: '',
    password: '',
    rol: 'E'
  }
  
  constructor(
    private empleadosService:EmpleadosService, public _snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<AgregarEmpleadoComponent>, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    this.empleadosService.getEmpleados()
      .subscribe(
        empleados => {
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
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error.mensaje
            });
          }
          this.preloaderActivo = false;
          this.desactivado = false;
        }
      )
  }

  cerrarModal(){
    this.dialogRef.close();
  }

  async agregarEmpleado(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.usuariosService.postUsuario(this.empleado).toPromise()
      .then(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Se inserto el usuario',
          });
          this.dialogRef.close(true);
        }
      )
      .catch(e => {
        if(!e.error.mensaje)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El servidor no esta conectado'
          });
        else 
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.error.mensaje
          });
      }).finally( () => {
        this.preloaderActivo = false;
        this.desactivado = false;
      })
  }

}
