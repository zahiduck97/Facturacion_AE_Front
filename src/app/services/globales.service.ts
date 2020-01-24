import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalesService {

  public navbarhide:boolean = true;
  public navtramitador: boolean = true;

  constructor() { console.log('Global Services se esta ejecutando'); }

  setNavbar(status:boolean){
    this.navbarhide = status;
  }

  getNavbar(){
    return this.navbarhide;
  }

  setNavbarTramitador(status:boolean){
    this.navtramitador = status;
  }

  getNavbarTramitador(){
    return this.navtramitador;
  }
}
