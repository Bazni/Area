import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  users = environment.apiUrl +  'users';
  userByID = environment.apiUrl +  'user/';

  constructor(private http : HttpClient) {
  }

  public getAllUser(): Observable<any> {
    return this.http.get(this.users);
  }

  public getUserByID(uuid: string): any {
    return this.http.get(this.userByID + uuid);
  }

  public setUserByID(uuid: string, user: any): any {
    return this.http.put(this.userByID + uuid, user);
  }
}
