import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"


@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  constructor(private http: HttpClient) { console.log('Facturas Service esta funcionando'); }

  postFactura(data){
    return this.http.post(environment.Url_Api+'addFactura', data);
  }

  putFactura(data){
    return this.http.put(environment.Url_Api+'putFactura/'+data.Id_Form,data)
  }

  getFacturas(){
    return this.http.get(environment.Url_Api+'allFacturas');
  }

  getFacturasValidated(){
    return this.http.get(environment.Url_Api+'allFacturasValidated');
  }

  getFactura(Id){
    return this.http.get(environment.Url_Api+'Factura/'+Id);
  }

  archivoFactura(Id){
    return this.http.get(environment.Url_Api+'FacturaFile/'+Id, { responseType: 'blob' })
  }

  validarFactura(Id){
    let data: {Id}
    return this.http.put(environment.Url_Api+'ValidarFactura/'+Id,data);
  }
}
