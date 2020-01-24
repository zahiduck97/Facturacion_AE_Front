import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NuevoServicioComponent } from '../.././modals/nuevo-servicio/nuevo-servicio.component'
import { FormulariosService } from 'src/app/services/formularios.service';
import { InformacionServicioComponent } from '../.././modals/informacion-servicio/informacion-servicio.component';
import Swal from "sweetalert2";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NuevoServicioCLienteComponent } from '../nuevo-servicio-cliente/nuevo-servicio-cliente.component';
import { InformacionClienteComponent } from '../informacion-cliente/informacion-cliente.component';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-formcliente',
  templateUrl: './formcliente.component.html',
  styleUrls: ['./formcliente.component.css']
})
export class FormclienteComponent implements OnInit {
  
  // Table
  public displayedColumns: string[] = ['servicio', 'tramitador', 'producto', 'norma', 'status', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private dialog: MatDialog, 
    private _formsService: FormulariosService,
    public _login: LoginService
  ) { }

  uploadedFiles: Array<File>;
  public formularios;
  public preloaderActivo = false;
  public desactivado = false;
  public UsuarioId: number = 0;

  async ngOnInit() {
    await this._login.userInfo().subscribe(res => {
      this.UsuarioId = res['Id_Usuario'];
    }, 
    e=> {},
    ()=>{
      this.conectarServidor();
    });
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

  // getting the forms
  conectarServidor(){
    this.preloaderActivo = true;
    this.desactivado = true;

    this._formsService.getClientForms(this.UsuarioId).subscribe(res => {
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
    const dialogRef = this.dialog.open(NuevoServicioCLienteComponent, {
      width: '700px',
    });

    await dialogRef.afterClosed().subscribe(res => {
      this.conectarServidor();
    })
  }

  // To show the info
  async informacionServicio(form){
    const dialogRef = this.dialog.open(InformacionClienteComponent, {
      data: { info: form },
      width: '700px'
    });

    await dialogRef.afterClosed().subscribe(res => {
      this.conectarServidor();
    })
  }
}
