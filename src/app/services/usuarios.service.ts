import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})


export class UsuariosService {

  constructor(private http:HttpClient) {console.log('Usuarios Service esta ejecutandose'); }

  getUsuarios(){
    return this.http.get<any[]>(environment.Url_Api+'Users');
  }

  postUsuario(usuario){
    return this.http.post<any>(environment.Url_Api+'addUser',usuario);
  }

  putUser(usuario){
    return this.http.put<any>(environment.Url_Api+`User/${usuario.Id_Usuario}`,usuario);
  }


  putPassword(usuario){
    return this.http.put<any>(environment.Url_Api+`User-password/${usuario.Id_Usuario}`,usuario);
  }

  getUserTramitadores(){
    return this.http.get<any>(environment.Url_Api+'UsersTramitadores');
  }

  get1UserTramitador(Id){
    return this.http.get<any>(environment.Url_Api+'UsersTramitadores/'+Id);
  }

  getUserEmpleados(){
    return this.http.get<any>(environment.Url_Api+'UsersEmpleados');
  }

  getOneUser(id){
    return this.http.get<any>(environment.Url_Api+`User/${id}`);
  }

  deleteUsuario(usuario){
    return this.http.delete<any>(environment.Url_Api+`User/${usuario.Id_Usuario}`,usuario);
  }


}
