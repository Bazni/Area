import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  myForm: FormGroup;

  matcher = new MyErrorStateMatcher();
  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router : Router,
              private  user : UserService) {
  }
  ngOnInit() {
    this.myForm = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      email : ['', [Validators.required ,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['']
    }, {validator: this.checkPasswords});
  }
  onSubmit() {
    this.user.registerUser(this.myForm);
  }
  get f() { return this.myForm.controls; }


    checkPasswords(group: FormGroup) {
      let pass = group.controls.password.value;
      let confirmPass = group.controls.passwordConfirm.value;

      return pass === confirmPass ? null : { notSame: true }
    }
}
