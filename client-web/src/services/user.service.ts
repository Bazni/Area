import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";

export interface User {
    uuid: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    photoUrl: string,
  token: string,
  role: number,
}

declare var FB: any;
@Injectable({
  providedIn: 'root'
})
export class UserService {
  loginUrl: string   =  environment.apiUrl + "auth/login";
  registerUrl: string  = environment.apiUrl + "auth/register";
  facebookUrl: string = environment.apiUrl + "auth/facebook";
  meUrl: string  = environment.apiUrl + "me";
  userUrl : string = environment.apiUrl + "user/";

  public userInfo : any;

  constructor(private http: HttpClient,
              private router : Router) {
    this.userInfo = {
      uuid: null,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      token: null,
      photoUrl: null,
      role: 0,
    };

    FB.init({
      appId      : '258808405018426',
      status     : false, // the SDK will attempt to get info about the current user immediately after init
      cookie     : false,  // enable cookies to allow the server to access
      // the session
      xfbml      : false,  // With xfbml set to true, the SDK will parse your page's DOM to find and initialize any social plugins that have been added using XFBML
      version    : 'v2.8' // use graph api version 2.5
    });
  }

  public requestMe() :  any {
    return this.http.get(this.meUrl).toPromise().then((data: any) => {
      this.userInfo.uuid = data.uuid;
      this.userInfo.email = data.email;
      this.userInfo.firstName = data.firstName;
      this.userInfo.lastName = data.lastName;
      this.userInfo.token = data.token;
      this.userInfo.photoUrl = data.photoUrl;
      this.userInfo.phone = data.phone;
      this.userInfo.role = data.role;
      return data
      }, (error) => {
      return error
    });
  }

  loginUser(myForm : FormGroup) {
    this.http.post<any>(this.loginUrl, myForm.value).subscribe((data) => {
      this.userInfo.uuid = data.uuid;
      this.userInfo.email = data.email;
      this.userInfo.firstName = data.firstName;
      this.userInfo.lastName = data.lastName;
      this.userInfo.token = data.token;
      this.userInfo.photoUrl = data.photoUrl;
      this.userInfo.phone = data.phone;
      if (data.role) {
        this.userInfo.role = data.role;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('uuid', data.uuid);
      this.router.navigate(['']);
    }, error1 => console.log(error1));
  }

  registerUser(myForm : FormGroup) : any {
    this.http.post(this.registerUrl, myForm.value).subscribe((data) => {
      this.router.navigate(['login']);
    }, error1 => console.log(error1));
  }
  updateUser(userinfo : object) : any
  {
    return this.http.put(this.userUrl + this.userInfo.uuid, userinfo).toPromise()
      .then((data) => {return data}, (error) => {return error});
  }

  fbLogin() {
    return new Promise((resolve, reject) => {
      FB.login(result => {
        if (result.authResponse) {
          console.log(result.authResponse)
          return this.http.post<any>(this.facebookUrl, {
            fbAccessToken: result.authResponse.accessToken,
            fbUserId: result.authResponse.userID,
          }).toPromise()
            .then(response => {
              var token = response.headers.get('x-auth-token');
              if (token) {
                localStorage.setItem('id_token', token);
              }
              resolve(response.json());
            })
            .catch(() => reject());
        } else {
          reject();
        }
      }, {scope: 'public_profile,email'})
    });
  }
}
