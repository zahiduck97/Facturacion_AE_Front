import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient) { console.log('Service se esta ejecutando');}

  postService(data){
    return this.http.post(environment.Url_Api+'addService', data);
  }

  putService(data){
    return this.http.put(environment.Url_Api+'service/'+data.Id_Form,data);
  }

}
