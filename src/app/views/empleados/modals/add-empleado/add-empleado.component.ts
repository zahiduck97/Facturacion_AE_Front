import { Component} from '@angular/core';
import { Empleado } from "../../../../models/empleado";
import { EmpleadosService } from "../../../../services/empleados.service";
import { MatDialogRef } from '@angular/material/dialog';
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-empleado',
  templateUrl: './add-empleado.component.html',
  styleUrls: ['./add-empleado.component.css']
})

export class AddEmpleadoComponent  {
  
  // Norma para enviar en post
  public empleado:Empleado = {
    Id_Empleado: 0,
    nombre_Empleado: '',
    iniciales: ''
  }
  
  public preloaderActivo = false;
  public desactivado = false;
  
  constructor(
    public empleadosService: EmpleadosService,
    public dialogRef: MatDialogRef<AddEmpleadoComponent>,
    ) { }


  // Post a Norm
  async postEmpleado(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.empleadosService.postEmpleado(this.empleado).toPromise()
      .then(
        empleadodb => {
          Swal.fire({
            icon: 'success',
            title: 'Se inserto el empleado'
          })
          this.dialogRef.close(empleadodb);
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

  // Close the modal
  cerrarModal(){
    this.dialogRef.close();
  }

}
