import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Norma } from '../models/norma';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class NormasService {


  constructor(private http: HttpClient) { console.log('normas service ejecutado'); }

  getNormas(){
    return this.http.get<Norma[]>(environment.Url_Api+'Norms');
  }

  getNormasOrder(){
    return this.http.get<Norma[]>(environment.Url_Api+'NormsOrder');
  }

  postNorma(data){
    return this.http.post<Norma>(environment.Url_Api+'addNorm',data);
  }

  putNorma(data){
    return this.http.put<Norma>(environment.Url_Api+`Norm/${data.Id_Norma}`,data);
  }

  deleteNorm(data){
    return this.http.delete<Norma>(environment.Url_Api+`Norm/${data.Id_Norma}`,data);
  }

  getNorma(Id){
    return this.http.get<Norma>(environment.Url_Api+'Norm/'+Id);
  }

  getNombreNorma(Id){
    return this.http.get(environment.Url_Api+'NormView/'+Id);
  }

}
