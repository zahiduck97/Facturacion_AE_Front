import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { GlobalesService } from "../../services/globales.service";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  public usuario= {
    userEmail: '',
    password: ''
  }

  public preloaderActivo = false;

  constructor(private loginServices: LoginService, private router: Router, public _Globales: GlobalesService) { }

  async login(){
    this.preloaderActivo = true;
    await this.loginServices.login(this.usuario).toPromise()
      .then( res => {
          console.log(res);
          this._Globales.setNavbar(false)
          Swal.fire({
            title: 'Bienvenido de nuevo',
            confirmButtonText: 'Seguir'
          })
          this.preloaderActivo = false;
          this.router.navigate(['/index']);
        }
      )
      .catch(e => {
        this.preloaderActivo = false;
        console.log(e);
        Swal.fire({
          icon: 'error',
          title: 'Hubo un error',
          text: e.error
        })
      })
  }

}
