import {Component, OnChanges, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})

export class NavComponent implements OnInit{
  public menu : any;

  constructor(private  user : UserService) {
    this.menu =  [
      {text: "About", ref:"/about"}]
  }

  ngOnInit() {
    this.user.requestMe().then((data) => {
      if (data.uuid) {
      this.menu.push({text: "Profile", ref:"/dashboard/user-profile"});
      this.menu.push({text: "Dashboard", ref:"/dashboard/dashboard"});
      }
      else {
        this.menu.push({text : "Login", ref: "/login"});
        this.menu.push({text : "Register", ref: "/register"});
      }
      }).catch( (error) => {
      this.menu.push({text : "Login", ref: "/login"});
      this.menu.push({text : "Register", ref: "/register"});
      console.log(error)}
      );
  }

  ngOnChanges(){
    console.log("ok");
  }

   public dropDownNav() : void {
    let x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
}
