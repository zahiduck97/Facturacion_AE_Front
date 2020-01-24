import { Component, Inject} from '@angular/core';
import { Empleado } from "../../../../models/empleado";
import { EmpleadosService } from "../../../../services/empleados.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from "sweetalert2";

@Component({
  selector: 'app-edit-empleado',
  templateUrl: './edit-empleado.component.html',
  styleUrls: ['./edit-empleado.component.css']
})
export class EditEmpleadoComponent {

  // Norma para enviar en post
  public empleado:Empleado = {
    Id_Empleado: 0,
    nombre_Empleado: '',
    iniciales: ''
  }

  public preloaderActivo = false;
  public desactivado = false;

  constructor(
    public dialogRef: MatDialogRef<EditEmpleadoComponent>,
    public empleadosService: EmpleadosService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {  }



  // Close the modal
  cerrarModal(){
    this.dialogRef.close();
  }

  // Put a Norm
  async putEmpleado(){
    this.preloaderActivo = false;
    this.desactivado = false;
    await this.empleadosService.putEmpleado(this.data.empleado).toPromise()
      .then( empleadodb => {
        Swal.fire({
          icon: 'success',
          title: 'Se edito el empleado'
        })
        this.dialogRef.close(empleadodb);
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
