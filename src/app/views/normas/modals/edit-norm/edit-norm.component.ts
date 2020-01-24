import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Norma } from 'src/app/models/norma';
import { NormasService } from 'src/app/services/normas.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-edit-norm',
  templateUrl: './edit-norm.component.html',
  styleUrls: ['./edit-norm.component.css']
})
export class EditNormComponent implements OnInit {

  // Norma para enviar en post
  public norma:Norma = {
    Id_Norm: 0,
    nombre_Norma: '',
    descripcion_Norma: ''
  }

  public preloaderActivo = false;
  public desactivado = false;


  constructor(
    public dialogRef: MatDialogRef<EditNormComponent>,
    public normaService: NormasService,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {  }


  ngOnInit(){
  }

   // Close the modal
  cerrarModal(){
    this.dialogRef.close();
  }


  // Put a Norm
  async putNorma(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.normaService.putNorma(this.data.norma).toPromise()
      .then( normadb => {
        Swal.fire({
          icon: 'success',
          title: 'Se edito la norma'
        })
        this.dialogRef.close(normadb);
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
