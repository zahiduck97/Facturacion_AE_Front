import { Component, OnInit, ViewChild } from '@angular/core';
import { Empresa } from "../../models/empresa";
import { EmpresasService } from "../../services/empresas.service";
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from "sweetalert2";
import { AddEmpresaComponent } from './modals/add-empresa/add-empresa.component';
import { MatDialog } from '@angular/material/dialog';
import { InformacionEmpresaComponent } from './modals/informacion-empresa/informacion-empresa.component';
import { EditEmpresaComponent } from './modals/edit-empresa/edit-empresa.component';



@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: [ './empresas.component.css' ]
})



export class EmpresasComponent implements OnInit {

  public empresas: Empresa[] = [];
  public preloaderActivo = false;
  public desactivado = false;

  // Table
  public displayedColumns: string[] = ['razonSocial', 'contrato', 'rfc', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public empresasService: EmpresasService,
    private router: Router,
    public dialog: MatDialog
    ) { }


  // Al iniciar
  ngOnInit() {
    this.conectarServidor();
    this.dataSource.paginator = this.paginator;
  }

  // get all norms
  conectarServidor(){
    this.preloaderActivo = true;
    this.desactivado = true;
    this.empresasService.getEmpresasOrder()
      .subscribe(
        empresas => {
          this.empresas = empresas;
          console.log(this.empresas);
          this.preloaderActivo = false;
          this.desactivado = false;
          this.dataSource.data = this.empresas
        },
        err => {
          console.log(err);
          if(err.status == 0){ 
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El servidor no esta conectado'
            });
          } else if(err.status == 401){
            Swal.fire({
              icon: 'success',
              title: 'Error',
              text: err.error
            });
            this.router.navigate(['/']);
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Error',
              text: err.error.mensaje
            });
          }
          this.preloaderActivo = false;
          this.desactivado = false;
        }
      )
  }

  // Abrir formulario en modal
  async formAddEmpresa(){
    const dialogRef = this.dialog.open(AddEmpresaComponent, {
      width: '700px'
    });

    await dialogRef.afterClosed().subscribe(result => {    
      this.conectarServidor();
    }); 
  }

  // Filtering
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Modal de informacion
  async informacionEmpresa(empresa){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(InformacionEmpresaComponent,{
      data: { empresa },
      width: '700px'

    });

    await dialogRef.afterClosed().subscribe(result => {
        this.conectarServidor();
    })
  }

   // Delete a empresa
  async deleteEmpresa(empresa:Empresa){
    if(this.desactivado)
      return false;

    Swal.fire({
      title: '¿Estas seguro que quieres borrarla?',
      text: 'No podras recuperar la informacion despues.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        this.preloaderActivo = true;
        this.desactivado = true;

        this.empresasService.deleteEmpresa(empresa).toPromise()
        .then(empresadb => {
          Swal.fire({
            icon: 'success',
            title: 'Se borro la norma'
          })
          this.conectarServidor();
        }).catch ( e => {
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
        })
      }
    })
  }

  
  // Put a Norm
  async editEmpresa(empresa:Empresa){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(EditEmpresaComponent, {
      data: {
        empresa
      },
      width: '600px'
     });

    await dialogRef.afterClosed().subscribe(result => {
      this.conectarServidor();
    })
  }
  
}
