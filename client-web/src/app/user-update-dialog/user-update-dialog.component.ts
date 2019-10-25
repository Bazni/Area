import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from "../../services/admin.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface UserUpdateDialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-user-update-dialog',
  templateUrl: './user-update-dialog.component.html',
  styleUrls: ['./user-update-dialog.component.scss']
})
export class UserUpdateDialogComponent implements OnInit {

  userUUID: string;
  userInfo: any;
  userUpdate: any;

  constructor(
    private admin: AdminService,
    public dialogRef: MatDialogRef<UserUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserUpdateDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.admin.getUserByID(this.userUUID).subscribe((user) => {
      this.userInfo = user;
      console.log(this.userInfo);
      this.userUpdate = Object.assign({}, this.userInfo);
    }, (error) => {
      console.log(error);
    });
  }

  updateUser(): void {
    this.admin.setUserByID(this.userUUID, this.userUpdate).subscribe((data) => { console.log(data); this.dialogRef.close(); });
  }
}
