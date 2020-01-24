import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Norma } from 'src/app/models/norma';
import { NormasService } from 'src/app/services/normas.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.css']
})
export class FormAddComponent  {

  // Norma para enviar en post
  public norma:Norma = {
    Id_Norm: 0,
    nombre_Norma: '',
    descripcion_Norma: ''
  }
  
  public preloaderActivo = false;
  public desactivado = false;
  
  constructor(
    public normaService: NormasService,
    public dialogRef: MatDialogRef<FormAddComponent>,
    ) { }


  // Post a Norm
  async postNorma(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.normaService.postNorma(this.norma).toPromise()
      .then(
        normadb => {
          Swal.fire({
            icon: 'success',
            title: 'Se inserto la norma'
          })
          this.dialogRef.close(normadb);
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
