import {Component, OnInit, OnChanges, DoCheck} from '@angular/core'; 
declare var M: any;
import * as $ from 'jquery';
import { GlobalesService } from './services/globales.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, DoCheck {

  public conexion;
  public navbarHide;

  constructor(private _Global: GlobalesService) {
  }

  ngOnInit(): void {
    this.navbarHide = this._Global.getNavbar();
  }

  ngDoCheck()  {
    this.navbarHide = this._Global.getNavbar();
  }
}
