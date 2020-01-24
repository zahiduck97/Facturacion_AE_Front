import { Component, OnInit, ViewChild } from '@angular/core';
import { TramitadoresService } from "../../services/tramitadores.service";
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from "sweetalert2";
import { AddTramitadorComponent } from './modals/add-tramitador/add-tramitador.component';
import { MatDialog } from '@angular/material/dialog';
import { EditTramitadorComponent } from './modals/edit-tramitador/edit-tramitador.component';

@Component({
  selector: 'app-tramitadores',
  templateUrl: './tramitadores.component.html',
  styleUrls: ['./tramitadores.component.css']
})


export class TramitadoresComponent implements OnInit {

  // Constantes
  public tramitadores;
  public preloaderActivo = false;
  public desactivado = false;

  // Table
  public displayedColumns: string[] = ['nombre', 'empresa', 'email', 'telefono', 'facturar', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public tramitadorService: TramitadoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }


  // on init
  ngOnInit() {
    this.conectarServidor();
    this.dataSource.paginator = this.paginator;
  }

  // Abrir formulario en modal
  async agregarTramitador(){
    if(this.desactivado)
      return false;
      
    const dialogRef = this.dialog.open(AddTramitadorComponent, {
      width: '600px',
    });

    await dialogRef.afterClosed().subscribe(result => {    
      if(result){
        this.conectarServidor();
      }
    });
    
    
  }

   // Filtering
   applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // get all norms
  conectarServidor(){
    this.desactivado = true;
    this. preloaderActivo= true;
    this.tramitadorService.getInnerTramitadoresOrder()
      .subscribe(
        tramitadores => {
          this.tramitadores = tramitadores;
          console.log(this.tramitadores);
          this.desactivado = false;
          this. preloaderActivo= false;
          this.dataSource.data = this.tramitadores
        },
        err => {
          console.log(err);
          if(err.status == 0){ 
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El servidor no esta conectado'
            })
          } else if(err.status == 401){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error            
            })
            this.router.navigate(['/']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err.error.mensaje            
            })
          }
          this.desactivado = false;
          this. preloaderActivo= false;
        }
      )
  }

  async abrirTramitador(tramitador){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(EditTramitadorComponent, {
      data: {tramitador}
    })

    await dialogRef.afterClosed().subscribe( result => {
      this.conectarServidor()
      
    })
  }

  borrarTramitador(tramitador){
    if(this.desactivado)
      return false;

    Swal.fire({
      title: '¿Estas seguro de que quieres borrar este usuario?',
      text: 'No podras recuperar la informacion despues.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.preloaderActivo = true;
        this.desactivado = true;
        this.tramitadorService.deleteTramitador(tramitador).toPromise()
          .then(tramitadordb => {
            Swal.fire({
              icon: 'success',
              title: 'Se borro el tramitador'
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

  }
