import { Component, OnInit } from '@angular/core';
import { AdminService } from "../../services/admin.service";
import { UserUpdateDialogComponent, UserUpdateDialogData } from "../user-update-dialog/user-update-dialog.component";
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  users: [any];
  animal: string;
  name: string;

  constructor(public dialog: MatDialog, private admin: AdminService) { }

  getUsers()
  {
    this.admin.getAllUser().subscribe((users) => {
      this.users = users;
      console.log(this.users);
    }, (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  public modifyUser(userUUID: string): void
  {
    console.log("Modify User: ", userUUID);

    var dialogRef = this.dialog.open(UserUpdateDialogComponent, {
      width: '1000px',
      height: '450px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.componentInstance.userUUID = userUUID;

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  public deleteUser(userUUID: string): void
  {
    console.log("Delete User: ", userUUID);
  }
}
