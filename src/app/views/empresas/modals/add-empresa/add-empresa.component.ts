import { Component} from '@angular/core';
import { Empresa } from "../../../../models/empresa";
import { EmpresasService } from "../../../../services/empresas.service";
import { MatDialogRef } from '@angular/material/dialog';
import Swal from "sweetalert2";

@Component({
  selector: 'app-add-empresa',
  templateUrl: './add-empresa.component.html',
  styleUrls: ['./add-empresa.component.css']
})


export class AddEmpresaComponent  {

  
  // Norma para enviar en post
  public empresa:Empresa = {
    Id_Empresa : 0,
    razonSocial: '',
    numeroContrato: '',
    rfc: '',
    email: '',
    telefono: '',
    calle: '',
    colonia: '',
    municipio: '',
    estado: '',
    codigo_postal: '',
    representante: '',
  }
  
  public preloaderActivo = false;
  public desactivado = false;
  
  constructor(
    public empresasService: EmpresasService,
    public dialogRef: MatDialogRef<AddEmpresaComponent>
    ) { }


  // Post a Norm
  async postEmpresa(){
    this.preloaderActivo = true;
    this.desactivado = true;
    await this.empresasService.postEmpresa(this.empresa).toPromise()
      .then(
        empresaDb => {
          Swal.fire({ 
            icon: 'success',
            title: 'Se inserto la empresa'
          })
          this.dialogRef.close(empresaDb);
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
