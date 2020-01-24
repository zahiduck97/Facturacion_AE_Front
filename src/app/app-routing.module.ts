import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


// Views
import { NormasComponent } from './views/normas/normas.component';
import { EmpleadosComponent } from './views/empleados/empleados.component';
import { EmpresasComponent } from './views/empresas/empresas.component';
import { TramitadoresComponent } from "./views/tramitadores/tramitadores.component";
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { LoginComponent } from './views/login/login.component';
import { IndexComponent } from './views/index/index.component';
import { FormulariosComponent } from './views/formularios/formularios.component';
import { FacturasComponent } from './views/facturas/facturas.component';
import { FormclienteComponent } from './views/formularios/cliente/formcliente/formcliente.component';


const routes: Routes = [
  { path: 'normas', component: NormasComponent },
  { path: 'empleados', component: EmpleadosComponent },
  { path: 'empresas', component: EmpresasComponent },
  { path: 'tramitadores', component: TramitadoresComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: '', component: LoginComponent },
  { path:'index', component:IndexComponent },
  { path:'formularios', component: FormulariosComponent },
  { path:'facturas', component: FacturasComponent },
  { path:'formulariosCliente', component: FormclienteComponent }   
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
