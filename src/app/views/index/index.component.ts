import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { GlobalesService } from 'src/app/services/globales.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public response;

  constructor(private _login: LoginService) { 
    this._login.userInfo().subscribe(res => {
      this.response = res;
      console.log(this.response);
    }, e => {
      console.log(e);
    })
  }

  ngOnInit() {
  }

}
