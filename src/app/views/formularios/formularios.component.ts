import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NuevoServicioComponent } from './modals/nuevo-servicio/nuevo-servicio.component'
import { FormulariosService } from 'src/app/services/formularios.service';
import { InformacionServicioComponent } from './modals/informacion-servicio/informacion-servicio.component';
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {

  
  // Table
  public displayedColumns: string[] = ['id', 'empresa', 'servicio', 'producto', 'status', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog, 
    private _formsService: FormulariosService
  ) { }

  uploadedFiles: Array<File>;
  public formularios;
  public preloaderActivo = false;
  public desactivado = false;

  ngOnInit() {
    this.conectarServidor();
    this.dataSource.paginator = this.paginator;

  }

   // Filtering
   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // getting the forms
  conectarServidor(){
    this.preloaderActivo = true;
    this.desactivado = true;

    this._formsService.getForms().subscribe(res => {
      this.formularios = res;
      console.log(res);
      this.dataSource.data = this.formularios
    },
    e => {
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
    }
    )

    this.preloaderActivo = false;
    this.desactivado = false;
  }



  async openService(){
    const dialogRef = this.dialog.open(NuevoServicioComponent);

    await dialogRef.afterClosed().subscribe(res => {
      this.conectarServidor();
    })
  }

  // To show the info
  async informacionServicio(form){
    const dialogRef = this.dialog.open(InformacionServicioComponent, {
      data: { info: form },
      width: '700px'
    });

    await dialogRef.afterClosed().subscribe(res => {
      this.conectarServidor();
    })
  }

}
