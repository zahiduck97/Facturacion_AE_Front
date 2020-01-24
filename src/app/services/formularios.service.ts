import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {


  constructor(private http: HttpClient) { console.log('formulario service ejecutado'); }

  // POSTS
  postConstancia(data){
    return this.http.post(environment.Url_Api+'addConstancia',data);
  }

  postDictamen(data){
    return this.http.post<string>(environment.Url_Api+'addDictamen',data);
  }


  // GETS
  getForms(){
    return this.http.get(environment.Url_Api+'forms');
  }

  getClientForms(Id){
    return this.http.get(environment.Url_Api+'FormsClient/'+Id);
  }

  get1Form(id){
    return this.http.get(environment.Url_Api+`Forms/${id}`);
  }

  getDictamenes(){
    return this.http.get(environment.Url_Api+'dictamenes');
  }

  getDictamen(id){
    return this.http.get(environment.Url_Api+`dictamen/${id}`);
  }

  getPreservice(data){
    return this.http.post(environment.Url_Api+`preService/${data.Id_Form}`, data, {responseType: 'blob'});
  }

  getFinalService(Id){
    return this.http.get(environment.Url_Api+'FinalService/'+Id, { responseType: 'blob' });
  }

  getFormEmpresas(){
    return this.http.get(environment.Url_Api+'formEmpresas');
  }

  get1FormEmpresa(id){
    return this.http.get(environment.Url_Api+`formEmpresa/${id}`);
  }


  // Update
  updateForm(data){
    return this.http.put(environment.Url_Api+`Form/${data.Id_Form}`, data);
  }

  updateDictamen(data){
    return this.http.put(environment.Url_Api+`dictamen/${data.Id_Dictamen}`, data);
  }

  deleteDictamen(id){
    return this.http.delete(environment.Url_Api+`dictamen/${id}`,id);
  }

  updateService(data){
    return this.http.put(environment.Url_Api+'serviceVerified/'+data.Id_Form, data);
  }

  deleteConstancia(id){
    return this.http.delete(environment.Url_Api+'Form/'+id);
  }


}
