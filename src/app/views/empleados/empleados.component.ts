import { Component, OnInit, ViewChild } from '@angular/core'; 
import { Empleado } from "../../models/empleado";
import { EmpleadosService } from "../../services/empleados.service";;
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { MatDialog } from '@angular/material/dialog';
import { EditEmpleadoComponent } from './modals/edit-empleado/edit-empleado.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AddEmpleadoComponent } from './modals/add-empleado/add-empleado.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})


export class EmpleadosComponent implements OnInit {

  public empleados: Empleado[] = [];
  public preloaderActivo = false;
  public desactivado = false;
  public empleado: Empleado;

  // Table  
  public displayedColumns: string[] = ['nombre', 'iniciales', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public empleadosService: EmpleadosService,
    public dialog: MatDialog,
    private router: Router
    ) { }


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
    this.empleadosService.getEmpleadosOrder()
      .subscribe(
        empleados => {
          this.empleados = empleados;
          console.log(this.empleados);
          this.preloaderActivo = false;
          this.desactivado = false;
          this.dataSource.data = this.empleados
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

  // Delete a Norm
  async deleteEmpleado(empleado:Empleado){
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
        this.empleadosService.deleteEmpleado(empleado).toPromise()
          .then(empleadodb => {
            Swal.fire({
              icon: 'success',
              title: 'Se borro el empleado',
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
    });

  }

   // Put a Norm
   async editEmpleado(empleado:Empleado){
    if(this.desactivado)
    return false;
    
    const dialogRef = this.dialog.open(EditEmpleadoComponent, {
      data: {
        empleado
      }
     });

     await dialogRef.afterClosed().subscribe(result => {
      this.conectarServidor();
     })
  }

  // Abrir formulario en modal
  async formAddEmpleado(){
    const dialogRef = this.dialog.open(AddEmpleadoComponent);

    await dialogRef.afterClosed().subscribe(result => {
      this.conectarServidor();
    });
    
    
  }
}
