import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EmpresasService } from 'src/app/services/empresas.service';
import { Empresa } from 'src/app/models/empresa';



@Component({
  selector: 'app-informacion-empresa',
  templateUrl: './informacion-empresa.component.html',
  styleUrls: ['./informacion-empresa.component.css']
})


export class InformacionEmpresaComponent {

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<InformacionEmpresaComponent>,
    public empresasService: EmpresasService,
    public dialog: MatDialog,
    ) { }


  // Close the modal
  cerrarModal(){
    this.dialogRef.close();
  }

}
