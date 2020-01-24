import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { console.log('Login Service is working'); }

  getConexion(){
    return this.http.get(environment.Url_Api+'pruebaConexion');
  }

  login(data){
    console.log(data);
    return this.http.post(environment.Url_Api,data);
  }

  logout(){
    return this.http.get(environment.Url_Api+'logout');
  }

  userInfo(){
    return this.http.get(environment.Url_Api+'usuarioInfo');
  }
}
