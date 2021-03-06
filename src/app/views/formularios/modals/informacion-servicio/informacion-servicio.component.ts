import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormulariosService } from 'src/app/services/formularios.service';
import { saveAs } from "file-saver";
import { AngularFireStorage } from 'angularfire2/storage';
import { EditarFormComponent } from '../editar-form/editar-form.component';
import { FacturaComponent } from '../Factura/factura/factura.component';
import * as firebase from "firebase";
import * as JSZip from 'jszip';
import Swal from 'sweetalert2'
import { InformacionEmpresaComponent } from 'src/app/views/empresas/modals/informacion-empresa/informacion-empresa.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-informacion-servicio',
  templateUrl: './informacion-servicio.component.html',
  styleUrls: ['./informacion-servicio.component.css']
})
export class InformacionServicioComponent implements OnInit {

  public dictamenInfo;
  public preloaderActivo = false;
  public desactivado = false;
  public array_Anexos = [];
  public array_Anexos_dictamen = [];
  public arrayAnexos:string[]=[ 'Etiqueta', 'Empaque o Artes', 'Imágenes', 'Instructivo', 'Garantía' ];
  public arrayAnexosDictamen:string[]=[ 'Pedimento', 'Factura' ];


  // Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<InformacionEmpresaComponent>,
    public dialog: MatDialog,
    private _formulario: FormulariosService,
    private AngularFire: AngularFireStorage,
    ) { }



  async ngOnInit() {
    console.log(this.data);
    this.array_Anexos = this.data.info.anexos.split(',');
    console.log(this.array_Anexos);
    if(this.data.info.Servicio == 'D')
      await this._formulario.getDictamen(this.data.info.Id_Dictamen).subscribe(res => {
        this.dictamenInfo = res;
        this.array_Anexos_dictamen = this.dictamenInfo.anexos_dictamen.split(',');
        console.log(this.dictamenInfo);
        console.log(this.array_Anexos_dictamen);
        // Te quedaste en que ibas a empezar a llenar la info de la constancia o el dictamen
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
  }

  // close modal
  cerralModal(){
    this.dialogRef.close();
  }

  // Editar Form
  editarForm(){
    var formulario_temp;
    this._formulario.get1Form(this.data.info.Id_Form).subscribe(async res => {
      formulario_temp = res;
      var dictamen_temp = {};

      if(formulario_temp.Id_Dictamen){
        this._formulario.getDictamen(formulario_temp.Id_Dictamen)
          .subscribe( async resul => {
            const respuesta = this.dialog.open(EditarFormComponent, {
              data: { form: formulario_temp, dict: resul },
              width: '700px'
            })

            await respuesta.afterClosed().subscribe(res => {
              if(res){
                this.dialogRef.close('ok');
              }
            })
          },
          e => {
            console.log('hubo pedos');
          })
      } else {

        const respuesta = this.dialog.open(EditarFormComponent, {
          data: { form: formulario_temp, dict: dictamen_temp },
          width: '700px'
        })

        await respuesta.afterClosed().subscribe(res => {
          if(res){
            this.dialogRef.close('ok');
          }
        })
      }
    })
  }

  // Delete
  borrarFile(Id){
    Swal.fire({
      title: '¿Estas seguro que quieres borrar este Servicio',
      text: 'no habra manera de recuperar los datos despues',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        if(this.data.info.Servicio == 'D'){
          this._formulario.deleteDictamen(this.dictamenInfo.Id_Dictamen).subscribe(res => {
            Swal.fire(
              'Se borro el servicio satisfactoriamente',
              '',
              'success'
            )
            this.dialogRef.close('ok');
          },
          e => {
            Swal.fire(
              e.error.mensaje,
              'error'
            )
            console.log(e);
          })
        } else {
          this._formulario.deleteConstancia(this.data.info.Id_Form).subscribe(res => {
            Swal.fire(
              'Se borro el servicio satisfactoriamente',
              '',
              'success'
            )
            this.dialogRef.close('ok');
          },
          e => {
            Swal.fire(
              e.error.mensaje,
              'error'
            )
            console.log(e);
          })
        }
      }
    });
  }

  // open the factura
  abrirFactura(){
    var formulario_temp;
    this._formulario.get1FormEmpresa(this.data.info.Id_Form).subscribe(async res => {
      formulario_temp = res;
      var dictamen_temp = {};

      if(formulario_temp.Id_Dictamen){
        this._formulario.getDictamen(formulario_temp.Id_Dictamen)
          .subscribe( async resul => {
            const respuesta = this.dialog.open(FacturaComponent, {
              data: { form: formulario_temp, dict: resul },
              width: '700px'
            })

            await respuesta.afterClosed().subscribe(res => {
              if(res){
                this.dialogRef.close('ok');
              }
            })
          },
          e => {
            console.log('hubo pedos');
          })
      } else {

        const respuesta = this.dialog.open(FacturaComponent, {
          data: { form: formulario_temp, dict: dictamen_temp },
          width: '700px'
        })

        await respuesta.afterClosed().subscribe(res => {
          if(res){
            this.dialogRef.close('ok');
          }
        })
      }
    })
  }

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  // Final Service
  async generarService(){
    const data = {
      watermark: {
        qr: 'UVNOM091' +
        'A&E INTERTRADE SA DE CV' +
        'ELABORA: RICARDO LUNA MARTINEZ' +
        '2019885265412564',
          absolutePosition: {x: 100, y: 500},
      },
      content: [
        {
          margin: [15, 115, 0, 0],
          style: 'font',
          table: {
            widths: [93, 93, 93, 93, 93],
            body: [
              [{text: 'Tipo de Servicio:            Dictamen ( )            Constancia ( )              Modificacion ( )', colSpan: 5, style: 'title'},
                {}, {}, {}, {}],
              [{text: 'No. de Solicitud: 20091USDNOM-004-SCFI-2006000001', colSpan: 3}, {}, {},
                {text: 'Fecha: 02/01/2020'},
                {text: 'Elabora: AVC'}],
              [{text: 'DATOS DEL CLIENTE ', alignment: 'center', colSpan: 5, style: 'title'}, {}, {}, {}, {}],
              [{text: 'Denominación o Razón Social:   LINEA MAGNA S.A. DE C.V', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'RFC: LMA870811URA', colSpan: 3}, {}, {}, {text: 'No. de Contrato: 18091UCS000169', colSpan: 2}, {}],
              [{text: 'Domicilio Fiscal'}, {text: 'Calle o Vialidad: JUAN SALVADOR AGRAZ', colSpan: 2}, {},
                {text: 'No. Ext. 40'}, {text: 'No. Int. PISO 8'}],
              [{text: 'Colonia: SANTA FE CUAJIMALPA', colSpan: 4}, {}, {}, {}, {text: 'C.P.: 04568'}],
              [{text: 'Alcaldia o Municipio: CUAJIMALPA DE MORELOS', colSpan: 3}, {}, {}, {text: 'Entidad Federativa: CIUDAD DE MEXICO', colSpan: 2}, {}],
              [{text: 'Representante Legal: MUSSALI SHAAB SALOMON', colSpan: 3}, {}, {}, {text: 'Tramitador: LAURA JUAREZ CABRERA', colSpan: 2}, {}],
              [{text: 'Telefono: 55 52924050', colSpan: 3}, {}, {}, {text: 'e-mail: salomon@lineamagna.com', colSpan: 2}, {}],
              [{text: 'INFORMACION DEL PRODUCTO PARA DICTAMEN / CONSTANCIA', style: 'title', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Norma en la que se solicita el servicio: NOM-004-SCFI-2006', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Denominación del Producto: CHAMARRAS, PANTALON, CAMISAS POLO, T-SHIRT, SUDADERA, PULLOVER PANTALON CORTO, BAÑADORES;', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Marca: SEGUN PEDIMENTO', colSpan: 2}, {}, {text: 'Pais de Origen: CHINA, FILIPINAS, INDONESIA, BANGLADESH', colSpan: 3}, {}, {}],
              [{text: 'Modelo (s): SEGUN PEDIMENTO', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Presentación: SEGUN PEDIMENTO', colSpan: 2}, {}, {text: 'Contenido: SEGUN PEDIMENTO', colSpan: 3}, {}, {}],
              [{text: 'Informacion anexa para Constancia: Etiqueta ( ) Arte ( ) Imagenes ( ) Instructivo ( ) Garantia ( )', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'INFORMACION ADICIONAL SOLO PARA DICTAMEN', style: 'title', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'No. de Pedimento: 20 51 9332 0000306', colSpan: 2}, {},
                {text: 'No. de Factura Comercial: PPH19-112, PPH19-100, 5898/UG/I/2019, 1901191110SUPRY, HE00991-19, HE00992-19, MKTL-673-2019, MKTL-720-2019, GJ19A127, SGL/S/PE/19/009', colSpan: 3}, {}, {}],
              [{text: 'Tamaño del Lote: 22,678', colSpan: 2}, {}, {text: 'Fraccion Arancelaria: SEGUN PEDIMENTO', colSpan: 3}, {}, {}],
              [{text: 'Regimen Aduanal:                                Almacen Particular ( X ) Déposito Fiscal ( ) ', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Documentos Anexos:                               Pedimento Aduanal ( X ) Factura Comercial ( X ) ', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'DATOS PARA VISITA DE VERIFICACION EN SITIO', style: 'title', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Nombre, denominación o razón social del establecimiento: LINEA MAGNA S.A DE C.V.', colSpan: 5}, {}, {}, {}, {}],
              [{text: 'Domicilio'}, {text: 'Calle o Vialidad: AV. BENITO JUAREZ', colSpan: 2}, {}, {text: 'No. Ext. 20'}, {text: 'No. Int. NAVE 2'}],
              [{text: 'Colonia: SAN MATEO CUATEPEC ', colSpan: 4}, {}, {}, {}, {text: 'No. Int. NAVE 2'}],
              [{text: 'Alcaldía o Municipio: TULTITLAN', colSpan: 3}, {}, {}, {text: 'Entidad Federativa: ESTADO DE MEXICO', colSpan: 2}, {}],
              [{text: 'Nombre del contacto para atender la visita de verificación: JULIO OLMOS', colSpan: 3}, {}, {}, {text: 'Telefono: 55 23698741', colSpan: 2}, {}],
              [{text: 'Fecha programada para la visita de verificación en sitio: 11/02/2020', colSpan: 5}, {}, {}, {}, {}],
            ]
          }
        },
        {
          text: 'CLAUSULAS', bold: true, alignment: 'center'
        },
        {
          style: 'justify',
          ol:[
            'La presente solicitud tiene una vigencia de 30 (treinta) días naturales para ser utilizada a partir de su expedición, terminando este plazo se debe tramitar una nueva con la tarifa correspondiente',
            'El uso indebido de esta solicitud es causa de rescisión del contrato de prestación de servicios de verificación, así como de las sanciones legales que correspondan',
            'Esta solicitud no tiene validez para los fines de importación si no tiene sello y el código QR con datos electrónicos de la UVA.',
            'En caso de que no se solicite la verificación de los productos amparados en esta solicitud, se emitirá la Negación del documento y se notificará a la DGN de la Secretaria de Economía y SAT.',
            'Esta solicitud solo podrá ser cancelada por escrito a solicitud del Representante Legal, bajo protesta de decir verdad que no fue utilizada para el proceso de importación.',
            'Para el servicio de Dictamen:',
            {
              ul: [
                'La liberación de su producto ante aduana debe hacerse presentando esta solicitud en original o copia digital, junto con una copia del contrato de prestación de servicios de verificación.',
                'El titular deberá solicitar la Visita de Verificación en Sitio dentro del plazo de 15 días naturales siguientes a la fecha en que se concluya el despacho aduanero, conforme a la legislación aduanera. Dicho plazo será de 40 días naturales si la mercancía a etiquetar requiere más de 10,000 etiquetas.'
              ]
            },
          ],
        },
        {
          style: 'justify',
          text: 'Aviso de privacidad: A&E Intertrade S.A de C.V., con domicilio fiscal en Calle Monterrey 387, Ciudad de México, le informa que los datos personales que\n' +
            'usted nos proporcione se utilizarán con la finalidad de conocer sus necesidades, comunicarle y proponerle algún servicio que ofrece A&amp;E Intertrade S.A de C.V. y/o en su caso, para los fines\n' +
            'descritos en el Aviso de Privacidad, mismo que Usted podrá consultar en la página www.aeintertrade.com.mx'
        },
        // {
        //   table: {
        //     body: [
        //       [{
        //         margin: [60, 40, 0, 0],
        //         color: '#2a62ca',
        //         bold: true,
        //         text: '02/01/2020'
        //       },
        //         { margin: [80, 0, 0, 0],
        //           qr: 'UVNOM091' +
        //             'A&E INTERTRADE SA DE CV' +
        //             'ELABORA: RICARDO LUNA MARTINEZ' +
        //             '2019885265412564', fit: '66'
        //         },
        //       ]
        //     ]
        //   },
        //    layout: 'noBorders'
        // },
        {
          margin: [60, 40, 0, 0],
          color: '#2a62ca',
          bold: true,
          text: '02/01/2020'
        },
      ],
      styles: {
        bold: {
          bold: true
        },
        title: {
          bold: true,
          alignment: 'center',
          fillColor: '#dddddd',
        },
        justify: {
          alignment: 'justify',
          fontSize: 6
        },
        font: {
          fontSize: 8
        }
      }
      ,
      pageSize: 'LETTER',
      background: [
        {
          image: await this.getBase64ImageFromURL(
            'https://scontent-dfw5-1.xx.fbcdn.net/v/t1.15752-9/p1080x2048/81947463_445969826309234_7412464939819859968_n.jpg?_nc_cat=101&_nc_ohc=1K2HcCX2QXIAX_7PxBw&_nc_ht=scontent-dfw5-1.xx&_nc_tp=1&oh=53b9460fe42f33fab4270cf979bd1290&oe=5E97C8C3'
          ),
          width: 620
        }
      ],
    };
  pdfMake.createPdf(data).open();
 }
  //   this.preloaderActivo = true;
  //   this.desactivado = true;
  //   this._formulario.getFinalService(this.data.info.Id_Form).subscribe(res => {
  //     saveAs(res, 'solicitud.pdf');
  //     this.preloaderActivo = false;
  //     this.desactivado = false;
  //   },
  //   e => {
  //     console.log(e);
  //     if(!e.error.mensaje)
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'El servidor no esta conectado'
  //       })
  //     else
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: e.error.mensaje
  //       })

  //     this.preloaderActivo = false;
  //     this.desactivado = false;
  //   });
  // }
}
