import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturasService } from 'src/app/services/facturas.service';
import { saveAs } from "file-saver";
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditFacturaComponent } from './modals/edit-factura/edit-factura.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  public facturas ;
  public preloaderActivo = false;
  public desactivado = false;

   // Table
   public displayedColumns: string[] = ['solicitud', 'facturar', 'tramitador', 'final', 'status', 'acciones'];
   public dataSource = new MatTableDataSource();
 
   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
   @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private _facturas: FacturasService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
    this.conectarServidor();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filtering
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  conectarServidor(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this._facturas.getFacturas().subscribe(res => {
      this.facturas = res;
      if(this.facturas.length == 0){
        Swal.fire({
          icon: 'success',
          title: 'No hay Facturas Disponibles'
        })
      }
      this.dataSource.data = this.facturas;
      console.log(res);
    },
    e => {
      console.log(e);
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
      
      this.preloaderActivo = false;  
      this.desactivado = false;
    })
    this.preloaderActivo = false;  
    this.desactivado = false;
  }

  verFactura(Id){
    
    if(this.desactivado == true)
      return false;
      
    this.preloaderActivo = true;  
    this.desactivado = true;

    this._facturas.archivoFactura(Id).subscribe(res => {
      saveAs(res, 'factura.pdf');
      this.preloaderActivo = false; 
      this.desactivado = false;
    },
    e => {
      console.log(e);
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
        this.preloaderActivo = false; 
      this.desactivado = false;
    }); 
  }

  validarFactura(Id){
    if(this.desactivado == true)
      return false;
    this._facturas.validarFactura(Id).subscribe(res => {
      Swal.fire({
        icon: 'success',
        title: 'Se valido la factura'
      })
      this.conectarServidor();
    },
    e => {
      console.log(e);
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

    })
  }

  async editFactura(data){
    if(this.desactivado == true)
      return false;
      
    const dialogRef = this.dialog.open(EditFacturaComponent,{
      width: '700px',
      data:  data 
    })

    await dialogRef.afterClosed().subscribe(e => {
      this.conectarServidor()
    })
  }

}
