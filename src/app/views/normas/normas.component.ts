import { Component, OnInit, ViewChild } from '@angular/core';
import { Norma } from "../../models/norma";
import { NormasService } from "../../services/normas.service";
import { Router } from '@angular/router';
import Swal from "sweetalert2";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { EditNormComponent } from './modals/edit-norm/edit-norm.component';
import { FormAddComponent } from './modals/form-add/form-add.component';

@Component({
  selector: 'app-normas',
  templateUrl: './normas.component.html',
  styleUrls: ['./normas.component.css']
})


export class NormasComponent implements OnInit {

  // Constantes
  public normas: Norma[] = [];
  public preloaderActivo = false;
  public desactivado = false;

  // Table
  public displayedColumns: string[] = ['codificacion', 'descripcion', 'acciones'];
  public dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    public normaService: NormasService,
    private router: Router,
    public dialog: MatDialog,
  ) { }


  // on init
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
    this.normaService.getNormasOrder()
      .subscribe(
        normas => {
          this.normas = normas;
          console.log(this.normas);
          this.preloaderActivo = false;
          this.desactivado = false;
          this.dataSource.data = this.normas
        },
        err => {
          console.log(err);
          if(err.status == 0){ 
            Swal.fire({
              icon: 'error',
              title:'Error',
              text: 'El servidor no esta conectado'
            })
          } else if(err.status == 401){
            Swal.fire({
              icon: 'error',
              title:'Error',
              text: err.error
            })
            this.router.navigate(['/']);
          } else {
            Swal.fire({
              icon: 'error',
              title:'Error',
              text: err.error.mensaje
            })
          }
          this.preloaderActivo = false;
          this.desactivado = false;
        }
      )
  }

  // Put a Norm
  async editNorm(norma:Norma){
    if(this.desactivado)
      return false

    const dialogRef = this.dialog.open(EditNormComponent, {
      data: {
        norma
      }
     });

     await dialogRef.afterClosed().subscribe(result => {  
      this.conectarServidor();
     })
  }

  // Delete a Norm
  async deleteNorm(norma:Norma){
    if(this.desactivado)
      return false
      
    Swal.fire({
      title: '¿Estas seguro de que quieres borrar esta norma?',
      text: 'No podras recuperar la informacion despues.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.desactivado = true;
        this.normaService.deleteNorm(norma).toPromise()
          .then(normadb => {
            Swal.fire({
              icon: 'success',
              title:'Se borro la norma'
            })
            this.conectarServidor()
          }).catch ( e => {
            if(!e.error.mensaje)
              Swal.fire({
                icon: 'error',
                title:'Error',
                text: 'El servidor no esta conectado'
              })
            else 
              Swal.fire({
                icon: 'error',
                title:'Error',
                text: e.error.mensaje
              })
          }).finally(() => {
            this.preloaderActivo = true;
            this.desactivado = true;
          })
      }
    })
  }

  // Abrir formulario en modal
  async formAddNorma(){
    const dialogRef = this.dialog.open(FormAddComponent);

    await dialogRef.afterClosed().subscribe(result => {
      this.conectarServidor()
    });
  }

}
