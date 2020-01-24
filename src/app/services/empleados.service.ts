import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {


  constructor(private http: HttpClient) { console.log('empleados service ejecutado'); }

  // All empleados
  getEmpleados(){
    return this.http.get<Empleado[]>(environment.Url_Api+'Empleados');
  }

  // All empleados order
  getEmpleadosOrder(){
    return this.http.get<Empleado[]>(environment.Url_Api+'EmpleadosOrder');
  }

  getEmpleado(id){
    return this.http.get<Empleado>(environment.Url_Api+`Empleado/${id}`);
  }

  postEmpleado(data){
    return this.http.post<Empleado>(environment.Url_Api+'addEmpleado',data);
  }

  putEmpleado(data){
    return this.http.put<Empleado>(environment.Url_Api+`Empleado/${data.Id_Empleado}`,data);
  }

  deleteEmpleado(data){
    return this.http.delete<Empleado>(environment.Url_Api+`Empleado/${data.Id_Empleado}`,data);
  }

}
