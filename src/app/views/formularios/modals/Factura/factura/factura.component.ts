import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormulariosService } from 'src/app/services/formularios.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from "firebase";
import * as JSZip from 'jszip';
import Swal from 'sweetalert2'
import { TramitadoresService } from 'src/app/services/tramitadores.service';
import { NormasService } from 'src/app/services/normas.service';
import { FacturasService } from 'src/app/services/facturas.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  public fecha;
  public tramitador;
  public tramitadorJ = { telefono: '', correo: '' };
  public preloaderActivo = false;
  public desactivado = false;
  public formulario;
  public Norma;
  public precioInicial: number = 520;
  public cuenta= {
    concepto1: [],
    concepto2: [],
    precio:[]
  }
  public contador = [];
  public total: number = this.precioInicial;

  // Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any, 
    public dialogRef: MatDialogRef<FacturaComponent>,
    public dialog: MatDialog, 
    private _formulario: FormulariosService, 
    private AngularFire: AngularFireStorage,
    private _tramitador: TramitadoresService,
    private _norma: NormasService,
    private _factura: FacturasService
    ) { }

  ngOnInit() {
    this.preloaderActivo = true;
    this.desactivado = true;
    console.log(this.data);
    let d = new Date();
    this.fecha = d.toLocaleDateString();
    this._tramitador.get1Tramitador(this.data.form.Id_Tramitador).subscribe(res => {
      this.tramitador = res;
      this.tramitadorJ.telefono = this.tramitador.telefono_tramitador 
      this.tramitadorJ.correo = this.tramitador.email_tramitador 
      console.log(res);
    },
    e => {
      console.log(e);
    })
    this._formulario.get1Form(this.data.form.Id_Form).subscribe(res => {
      this.formulario = res
      this._norma.getNorma(this.formulario.Norma).subscribe(resu => {
        this.Norma = resu;
        console.log(this.Norma);
      },
      e => {
        console.log(e);
      })
    },
    e => {
      console.log(e);
    })

    this.preloaderActivo = false;
    this.desactivado = false;
  }

  // To Sum all Prices
  sumaTotal(){
    this.total = 0;
    console.log(this.contador);
    console.log(this.contador.length);
    console.log(this.cuenta);
    for(let i= 0; i < this.contador.length; i++){
      if(this.cuenta.precio[i] == "")
        this.total += 0
      else
        this.total += this.cuenta.precio[i]
    }
    this.total +=  this.precioInicial;
    console.log(this.total)
  }

  // Close Modal
  cerralModal(){
    this.dialogRef.close('ok');
  }




  // Add Row
  agregarContador(){
    if(this.contador.length == 14){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya no se pueden agregar mas filas'
      })
    } else 
      this.contador.push(1)
  }

  // Delete Row
  quitarContador(){
    if(this.contador.length == 0){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ya no se pueden quitar mas filas'
      })
    } else {
      this.cuenta.concepto1.pop();
      this.cuenta.concepto2.pop();
      this.cuenta.precio.pop();
      this.contador.pop();
      this.sumaTotal ();
    }
  }

  // send 
  enviarFactura(){
    const factura = {
      concepto1: this.cuenta.concepto1.join(),
      concepto2: this.cuenta.concepto2.join(),
      precios: this.cuenta.precio.join().toString(),
      telefono: this.tramitadorJ.telefono,
      correo: this.tramitadorJ.correo,
      final: this.total,
      Id_Form: this.data.form.Id_Form,
      status: 'E',
      precioInicial: this.precioInicial
    }
    
    this._factura.postFactura(factura).subscribe(res => {
      this._norma.getNombreNorma(this.data.form.Id_Form).subscribe(resu => {
        const servicio = {
          Id_Form : this.data.form.Id_Form,
          Id_Dictamen : this.data.form.Id_Dictamen || '',
          status: 'V',
          solicitud: '',
          //norma: resu.nombre_Norma,
          norma: resu['nombre_Norma'],
          factura: res
        }

        this._formulario.updateService(servicio).subscribe(res => {
          Swal.fire({
            icon: 'success',
            title: 'Se guardo la factura'
          })
          this.dialogRef.close('ok');
          // Te quedaste en hacer el preloader, descativar los botones y ya
        },
        e => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e.error.mensaje
          })
          console.log(e);   
        })
      },
      e => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e.error.mensaje
        })
        console.log(e);   
      })
    },
    e => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: e.error.mensaje
      })
      console.log(e);
    })
  }

}
