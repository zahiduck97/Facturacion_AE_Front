import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empresa } from '../models/empresa';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {


  constructor(private http: HttpClient) { console.log('empresa service ejecutado'); }

  getEmpresas(){
    return this.http.get<Empresa[]>(environment.Url_Api+'Empresas');
  }

  getEmpresasOrder(){
    return this.http.get<Empresa[]>(environment.Url_Api+'EmpresasOrder');
  }

  postEmpresa(data){
    return this.http.post<Empresa>(environment.Url_Api+'addEmpresa',data);
  }

  putEmpresa(data){
    return this.http.put<Empresa>(environment.Url_Api+`Empresa/${data.Id_Empresa}`,data);
  }

  deleteEmpresa(data){
    return this.http.delete<Empresa>(environment.Url_Api+`Empresa/${data.Id_Empresa}`,data);
  }

}
