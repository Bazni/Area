import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from '../../services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;

  myForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router : Router,
              private user : UserService) {
  }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email : ['', [Validators.required ,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get f() { return this.myForm.controls; }
  onSubmit() {
    this.user.loginUser(this.myForm);
  }

  fbLogin() {
    this.user.fbLogin().then(() => {
      console.log('User has been logged in');
      this.router.navigate(['']);
    });
  }
}
