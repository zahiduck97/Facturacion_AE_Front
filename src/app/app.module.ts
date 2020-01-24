import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import 'materialize-css'


// Material
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatSnackBarModule, MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {MatPaginatorModule} from '@angular/material/paginator'; 


// Statics
import { NavbarComponent } from './components/static/navbar/navbar.component';


// View
import { NormasComponent } from './views/normas/normas.component';
import { EmpleadosComponent } from './views/empleados/empleados.component';
import { EmpresasComponent } from './views/empresas/empresas.component';
import { TramitadoresComponent } from './views/tramitadores/tramitadores.component';
import { UsuariosComponent } from './views/usuarios/usuarios.component';
import { IndexComponent } from './views/index/index.component'
import { FormulariosComponent } from './views/formularios/formularios.component';
import { InformacionServicioComponent } from './views/formularios/modals/informacion-servicio/informacion-servicio.component';


// Components
import { FormAddComponent } from './views/normas/modals/form-add/form-add.component';

import { EditNormComponent } from './views/normas/modals/edit-norm/edit-norm.component';
import { EditEmpleadoComponent } from './views/empleados/modals/edit-empleado/edit-empleado.component';
import { AddEmpleadoComponent } from './views/empleados/modals/add-empleado/add-empleado.component';
import { AddEmpresaComponent } from './views/empresas/modals/add-empresa/add-empresa.component';
import { EditEmpresaComponent } from './views/empresas/modals/edit-empresa/edit-empresa.component';
import { AddTramitadorComponent } from './views/tramitadores/modals/add-tramitador/add-tramitador.component';
import { EditTramitadorComponent } from './views/tramitadores/modals/edit-tramitador/edit-tramitador.component';
import { AgregarTramitadorComponent } from './views/usuarios/modals/agregar-tramitador/agregar-tramitador.component';
import { AgregarEmpleadoComponent } from './views/usuarios/modals/agregar-empleado/agregar-empleado.component';
import { EditEmpleadosUserComponent } from './views/usuarios/modals/edit-empleados-user/edit-empleados-user.component';
import { EditTramitadoresUserComponent } from './views/usuarios/modals/edit-tramitadores-user/edit-tramitadores-user.component';
import { EditPasswordComponent } from './views/usuarios/modals/edit-password/edit-password.component';
import { LoginComponent } from './views/login/login.component';
import { NuevoServicioComponent } from './views/formularios/modals/nuevo-servicio/nuevo-servicio.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {A11yModule} from '@angular/cdk/a11y';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree'


// Firebase
import { AngularFireModule } from "angularfire2";
import { AngularFireStorageModule } from "angularfire2/storage";
import { environment } from "../environments/environment";
import { EditarFormComponent } from './views/formularios/modals/editar-form/editar-form.component';
import { FacturaComponent } from './views/formularios/modals/Factura/factura/factura.component';
import { FacturasComponent } from './views/facturas/facturas.component';
import { FormclienteComponent } from './views/formularios/cliente/formcliente/formcliente.component';
import { InformacionClienteComponent } from './views/formularios/cliente/informacion-cliente/informacion-cliente.component';
import { NuevoServicioCLienteComponent } from './views/formularios/cliente/nuevo-servicio-cliente/nuevo-servicio-cliente.component';
import { InformacionEmpresaComponent } from './views/empresas/modals/informacion-empresa/informacion-empresa.component';
import { EditFacturaComponent } from './views/facturas/modals/edit-factura/edit-factura.component';
import { EditServicioClienteComponent } from './views/formularios/cliente/edit-servicio-cliente/edit-servicio-cliente.component';






@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FormAddComponent,
    NormasComponent,
    EditNormComponent,
    EmpleadosComponent,
    EditEmpleadoComponent,
    AddEmpleadoComponent,
    EmpresasComponent,
    InformacionEmpresaComponent,
    AddEmpresaComponent,
    EditEmpresaComponent,
    TramitadoresComponent,
    AddTramitadorComponent,
    EditTramitadorComponent,
    UsuariosComponent,
    AgregarTramitadorComponent,
    AgregarEmpleadoComponent,
    EditEmpleadosUserComponent,
    EditTramitadoresUserComponent,
    EditPasswordComponent,
    LoginComponent,
    IndexComponent,
    FormulariosComponent,
    NuevoServicioComponent,
   InformacionServicioComponent, EditarFormComponent, FacturaComponent, FacturasComponent, FormclienteComponent, InformacionClienteComponent, NuevoServicioCLienteComponent, EditFacturaComponent, EditServicioClienteComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule, MatButtonModule, MatSnackBarModule, MatInputModule,MatSelectModule, MatFormFieldModule, MatStepperModule, MatRadioModule,
    FormsModule, ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    MatPaginatorModule, MatSidenavModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
  ],
  providers: [{
    provide: MatSnackBarRef,
    useValue: {}
    }, {
    provide: MAT_SNACK_BAR_DATA,
    useValue: {} // Add any data you wish to test if it is passed/used correctly
    },
  ],
  bootstrap: [AppComponent],
  entryComponents:[ 
    FormAddComponent, EditNormComponent, AddEmpleadoComponent, EditEmpleadoComponent, InformacionEmpresaComponent, AddEmpresaComponent, EditEmpresaComponent, AddTramitadorComponent, EditTramitadorComponent, AgregarTramitadorComponent, AgregarEmpleadoComponent, EditEmpleadosUserComponent,EditTramitadoresUserComponent,EditPasswordComponent, NuevoServicioComponent, InformacionServicioComponent, EditarFormComponent, FacturaComponent, InformacionClienteComponent, NuevoServicioCLienteComponent, NavbarComponent, EditFacturaComponent, EditServicioClienteComponent
  ]
})
export class AppModule { }
