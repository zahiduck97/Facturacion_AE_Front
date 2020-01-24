import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormulariosService } from 'src/app/services/formularios.service';
import { NormasService } from 'src/app/services/normas.service';
import { FacturasService } from 'src/app/services/facturas.service';
import Swal from "sweetalert2";
import { TramitadoresService } from 'src/app/services/tramitadores.service';

@Component({
  selector: 'app-edit-factura',
  templateUrl: './edit-factura.component.html',
  styleUrls: ['./edit-factura.component.css']
})
export class EditFacturaComponent implements OnInit {

  public fecha;
  public tramitador;
  public tramitadorJ = { telefono: '', correo: '' };
  public preloaderActivo = false;
  public desactivado = false;
  public formulario;
  public Norma;
  public precioInicial: number = 520;
  public cuenta= {
    concepto1: [] = [],
    concepto2: [] = [],
    precio:[]= []
  }
  public contador = [];
  public total: number = this.precioInicial;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any, 
    public dialogRef: MatDialogRef<EditFacturaComponent>,
    private _formulario: FormulariosService, 
    private _norma: NormasService,
    private _factura: FacturasService,
  ) { }

  ngOnInit() {
    this.data.fecha = this.data.fecha.substring(0,10);
    if(this.data.concepto1.length){
      var con1 = this.data.concepto1.split(',');
      var con2 = this.data.concepto2.split(',');
      var pre = this.data.precios.split(',');
      for(let i =0; i<con1.length; i++){
        this.contador.push(1);
        this.cuenta.concepto1[i] = con1[i];
        this.cuenta.concepto2[i] = con2[i];
        this.cuenta.precio[i] = pre[i];
      }
    }
    console.log(this.data, this.contador, this.cuenta)
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
      telefono: this.data.telefono,
      correo: this.data.correo,
      final: this.data.final,
      Id_Form: this.data.Id_Form,
      status: this.data.statusFactura,
      precioInicial: this.data.inicial
    }

    console.log(factura)
    
    this._factura.putFactura(factura).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Se guardo la factura'
      })
      this.dialogRef.close('ok');
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
