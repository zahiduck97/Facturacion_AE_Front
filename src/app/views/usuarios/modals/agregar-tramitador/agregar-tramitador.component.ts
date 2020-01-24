import { Component, OnInit } from '@angular/core';
import { TramitadoresService } from 'src/app/services/tramitadores.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from "sweetalert2";


@Component({
  selector: 'app-agregar-tramitador',
  templateUrl: './agregar-tramitador.component.html',
  styleUrls: ['./agregar-tramitador.component.css']
})
export class AgregarTramitadorComponent implements OnInit {

  public tramitadores;
  public preloaderActivo = false;
  public desactivado = false;
  public confirm='';
  public isDifferent = false;

  public tramitador = {
    Id_Tramitador: '',
    userEmail: '',
    password: '',
    rol: 'T'
  }
  
  constructor(
    private tramitadorService:TramitadoresService, public _snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<AgregarTramitadorComponent>, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    this.tramitadorService.getTramitador()
      .subscribe(
        tramitadores => {
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

  async agregarTramitador(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.usuariosService.postUsuario(this.tramitador).toPromise()
      .then(
        () => {
          Swal.fire({ 
            icon: 'success',
            title: 'Se inserto el usuario'
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
