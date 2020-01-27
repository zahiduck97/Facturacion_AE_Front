import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from "../../models/usuario";
import { UsuariosService } from "../../services/usuarios.service";
import { MatDialog } from '@angular/material/dialog';
import { AgregarTramitadorComponent } from './modals/agregar-tramitador/agregar-tramitador.component';
import { AgregarEmpleadoComponent } from './modals/agregar-empleado/agregar-empleado.component';
import { EditTramitadoresUserComponent } from './modals/edit-tramitadores-user/edit-tramitadores-user.component';
import { EditEmpleadosUserComponent } from './modals/edit-empleados-user/edit-empleados-user.component';
import { EditPasswordComponent } from './modals/edit-password/edit-password.component';
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator'

// Interface for table
export interface UsuariosData {
  usuario: string;
  username: string;
  rol: string;
  acciones: any;
}


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})


export class UsuariosComponent implements OnInit {

  // Constantes
  public tramitadores: Usuario[] = [];
  public empleados: Usuario[] = [];
  public union: Usuario[] = [];
  public preloaderActivo = false;
  public desactivado = false;
  
  public displayedColumns: string[] = ['usuario', 'username', 'rol', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  // Constructor
  constructor(private usuariosService: UsuariosService, public dialog: MatDialog, private router: Router) { }

  // To Init
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


  // get all norms
  conectarServidor(){
    this.preloaderActivo = true;
    this.desactivado = true;

    this.usuariosService.getUserEmpleados()
      .subscribe(
        empleados => {
          this.empleados = empleados;
          console.log(this.empleados);
          this.preloaderActivo = false;
          this.desactivado = false;
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
          this.preloaderActivo = false;
          this.desactivado = false;
        },
        () => {
          this.preloaderActivo = true;
          this.desactivado = true;
        
          this.usuariosService.getUserTramitadores()
          .subscribe(
            tramitadores => {
              this.tramitadores = tramitadores;
              console.log(this.tramitadores);
              this.preloaderActivo = false;
              this.desactivado = false;
              this.union = this.tramitadores.concat(this.empleados);
              this.dataSource.data = this.union
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
              this.preloaderActivo = false;
              this.desactivado = false;
            }
          )
        }
      );
  }   
  
  // Agregar Un Usuario Tramitdor
  async addTramitador(){
    const dialogRef = this.dialog.open(AgregarTramitadorComponent, {
      width: '700px'
    });

    await dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.conectarServidor();
      }
    })
  }
  
  // Agregar un Usuario Empleado
  async addEmpleado(){
    const dialogRef = this.dialog.open(AgregarEmpleadoComponent, {
      width: '700px'
    });

    await dialogRef.afterClosed().subscribe(res => {
      if(res)
        this.conectarServidor();
    })
  }

  // Delete the user
  deleteUsuario(data){
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
        
        
        this.preloaderActivo = true
        this.usuariosService.deleteUsuario(data).toPromise()
          .then(res => {
            this.preloaderActivo = false;
            Swal.fire({
              icon: 'success',
              title: 'Se borro el usuario',
            })
            
            this.conectarServidor()
          })
          .catch(
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
            })
      }
    })

  }

  // Edit the tramitador
  async editarTramitador(tramitador){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(EditTramitadoresUserComponent, {
      data: { tramitador },
      width: '500px'
    })

    await dialogRef.afterClosed().subscribe(
      res => {
        this.conectarServidor();
      }
    )
  }

  // Edit the Empleado
  async editarEmpleado(empleado){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(EditEmpleadosUserComponent, {
      data: { empleado },
      width: '500px'
    })

    await dialogRef.afterClosed().subscribe(
      res => {
        this.conectarServidor();
      })
  }

  // edit password
  async editarPassword(usuario){
    if(this.desactivado)
      return false;

    const dialogRef = this.dialog.open(EditPasswordComponent, {
      data: { usuario },
      width: '500px'
    })

    await dialogRef.afterClosed().subscribe(
      res => {
        this.conectarServidor();
      })
  }

}
