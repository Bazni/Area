import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AreaService} from "../../services/area.service";

@Component({
  selector: 'app-area-update-dialog',
  templateUrl: './area-update-dialog.component.html',
  styleUrls: ['./area-update-dialog.component.scss']
})
export class AreaUpdateDialogComponent implements OnInit {

  area : any;
  constructor(private areaService : AreaService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AreaUpdateDialogComponent>) {

  }

  ngOnInit() {
    this.area = this.data.area;
    console.log(this.area);
  }

  update() {
    let areacp = this.area;

    areacp.actionConfig = JSON.stringify(areacp.actionConfig);
    areacp.reactionConfig = JSON.stringify(areacp.reactionConfig);

    this.areaService.updateArea(areacp).then((data) => {console.log('data update',data);     this.dialogRef.close(this.area);}).catch((error) => console.log(error))
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
