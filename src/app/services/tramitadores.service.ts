import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramitador } from '../models/tramitador';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})


export class TramitadoresService {


  constructor(private http: HttpClient) { console.log('tramitador service ejecutado'); }

  getTramitador(){
    return this.http.get<Tramitador[]>(environment.Url_Api+'Tramitadores');
  }

  get1Tramitador(Id){
    return this.http.get<Tramitador>(environment.Url_Api+`Tramitador/${Id}`);
  }

  postTramitador(data){
    return this.http.post<Tramitador>(environment.Url_Api+'addTramitador',data);
  }

  putTramitador(data){
    return this.http.put<Tramitador>(environment.Url_Api+`Tramitador/${data.Id_Tramitador}`,data);
  }

  deleteTramitador(data){
    return this.http.delete<Tramitador>(environment.Url_Api+`Tramitador/${data.Id_Tramitador}`,data);
  }

  getEmpresa(data){
    return this.http.get<Tramitador>(environment.Url_Api+`Tramitador-empresa/${data}`);
  }

  getInnerTramitadores(){
    return this.http.get<Tramitador[]>(environment.Url_Api+'TramitadoresInner');
  }

  getInnerTramitadoresOrder(){
    return this.http.get<Tramitador[]>(environment.Url_Api+'TramitadoresInnerOrder');
  }
}
