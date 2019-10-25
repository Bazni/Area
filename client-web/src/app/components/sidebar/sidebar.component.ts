import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/dashboard/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/dashboard/table-list', title: 'Admin',  icon:'face', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  public role : number;
  constructor(private user : UserService) {

  }

  ngOnInit() {
    //this.user.requestMe().then((data) => {console.log('logzzz', data)}, (error) => {console.log(error)});
    if (!this.user.userInfo.uuid){
      this.user.requestMe().then((data) => {
        this.role = data.role;
      }, (error) => {console.log(error)});
    }
    else {
      this.role = this.user.userInfo.role;
    }
    console.log('sidenav', this.user.userInfo);
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      //if ($(window).width() > 991) {
          return false;
      //}
      //return true;
  };
}
