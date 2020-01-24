import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlobalesService } from "../../../services/globales.service";
import { MediaMatcher } from '@angular/cdk/layout';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public conexion;
  public response;
  public mostrarTramitador;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  // Constructor
  constructor(public loginService: LoginService, private _snackBar: MatSnackBar, public router:Router, public _Globales:GlobalesService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  // To initialize
  ngOnInit() {
    this.loginService.userInfo().subscribe(res => {
      this.response = res;
      console.log('El usuario es:', this.response)
      if(this.response.rol == 'T'){
        this.mostrarTramitador = true
      } else {
        this.mostrarTramitador = false
      }
      console.log(this.mostrarTramitador);
    })
    console.log('vale: ',this.response);
  }

 // Logout
  async logout(){
    await this.loginService.logout()
      .subscribe( (res) => {
        this._Globales.setNavbar(true);
        Swal.fire({
          title: 'Has cerrado sesion',
          text: 'Vuelve Pronto'
        })
        this.router.navigate(['/']);
      },
      err => {
        console.log(err);
      })   
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
