import { Component, OnInit } from '@angular/core';
import { EmpresasService } from 'src/app/services/empresas.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TramitadoresService } from 'src/app/services/tramitadores.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-add-tramitador',
  templateUrl: './add-tramitador.component.html',
  styleUrls: ['./add-tramitador.component.css']
})
export class AddTramitadorComponent implements OnInit {

  public preloaderActivo = false;
  public desactivado = false;
  public empresas:any[] = [];
  selected = '';

  public tramitador = {
    Id_tramitador: 0,
    nombre_tramitador: '',
    email_tramitador: '',
    telefono_tramitador: '',
    facturar_a: '',
    Id_Empresa: 0
}
  

  constructor(public empresasService: EmpresasService,
    public tramitadorServices: TramitadoresService,
    public dialogRef: MatDialogRef<AddTramitadorComponent>,
    ) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    this.empresasService.getEmpresas()
      .subscribe(
        empresas => {
          console.log('prueba',empresas);
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

  cerrarModal(){
    this.dialogRef.close();
  }

  
  async postTramitador(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.tramitadorServices.postTramitador(this.tramitador).toPromise()
      .then(
        tramitador => {
          Swal.fire({
            icon: 'success',
            title: 'Se inserto el tramitador'
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
