import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms"

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userInfo: any;
  userUpdate: any;
  isAdmin = true;
  myForm: FormGroup;

  constructor(private user : UserService,
              private router : Router) {
  }

  ngOnInit() {
    console.log('user-profile', this.user.userInfo);
    if (!this.user.userInfo.firstName) {
      this.user.requestMe().then((data) => {
        this.userInfo = data;
        this.userUpdate = Object.assign({}, data);
        if (data.role)
          this.isAdmin = true;
      })
        .catch( (error) =>  {
        console.log(error);
        this.router.navigate(['login']);
      });
    }
    else{
      this.userInfo = this.user.userInfo;
      this.userUpdate = Object.assign({}, this.user.userInfo);
    }
  }

  public logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  onSubmit() {
    this.userUpdate.role = 0;
    if (this.isAdmin)
      this.userUpdate.role = 42;
    console.log(this.userUpdate);
    this.user.updateUser(this.userUpdate).then((data) => {this.userInfo = data}).catch((error) => {console.log(error)});
  }
}
