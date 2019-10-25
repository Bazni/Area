import { Component, OnInit, Inject } from '@angular/core';
import {AreaService} from "../../services/area.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AreaUpdateDialogComponent} from "../area-update-dialog/area-update-dialog.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  actions : any;
  services : any;
  reactions : any;
  areas : any;

  constructor( private areaService: AreaService,
               public dialog: MatDialog) {
  }

  ngOnInit() {
    this.areaService.getActions().then((data) => {console.log(data); this.actions = data;}).catch( (error) => {console.log(error)});
    this.areaService.getServices().then((data) => {
      this.services = data;
      for (let service of this.services) {
        console.log(service);
        this.areaService.getAreaByService(service.uuid).then( (data) => { for (let area of data) {
          if (area.actionConfig)
            area.configAction = Object.entries(area.actionConfig);
          area.configReaction = Object.entries(area.reactionConfig);
        }
        service.areas = data ;  })
      }
    }).catch( (error) => {console.log(error)});
    this.areaService.getAreas().then((data) => {
      this.areas = data;
      for (let area of this.areas) {
        if (area.actionConfig)
          area.configAction = Object.entries(area.actionConfig);
        area.configReaction = Object.entries(area.reactionConfig);
      }
    }).catch( (error) => {console.log(error)});

  }

  public openDialog = (uuid : string) : void => {
    const dialogRef = this.dialog.open(AreaDialog, {
      height: '400px',
      width: '600px',
      data: {uuidService : uuid}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        let nbr = this.services.findIndex((element) => {
          return element.uuid == result.service
        });
        this.services[nbr].areas.push(result.area);
      }
    });
  };

  public removeArea(uuid : string, serviceindex : any, areasindex :any) {

    this.areaService.deleteArea(uuid).then((data) => {
      this.services[serviceindex].areas.splice(areasindex, 1);
    }).catch((error) => console.log(error));
  }

  updateArea(area :any){
    const dialogRef = this.dialog.open(AreaUpdateDialogComponent, {
      height: '400px',
      width: '600px',
      data: {area : area}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.actionConfig = JSON.parse(result.actionConfig);
        result.reactionConfig = JSON.parse(result.reactionConfig);
        result.configAction = Object.entries(result.actionConfig);
        result.configReaction = Object.entries(result.reactionConfig);
        area = result;
      }
    });
  }

}

@Component({
  selector: 'Area-dialog',
  templateUrl: 'Area-dialog.html',
})

export class AreaDialog implements OnInit {

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  Actions : [];
  Reactions : [];
  myControl = new FormControl();
  actionSelect : any;
  reactionSelect : any;
  variables : any;
  reactionvariables : any;

  constructor(
    public dialogRef: MatDialogRef<AreaDialog>,
    private _formBuilder: FormBuilder,
    private  AreaService : AreaService, @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    console.log(this.data);
    this.AreaService.getActionbyservice(this.data.uuidService).then((data) => {this.Actions = data; console.log("Action", data);}).catch((error) => {console.log(error)});
    this.AreaService.getReactions().then((data) => {this.Reactions = data; console.log("Reaction", data);}).catch((error) => {console.log(error)});

    this.firstFormGroup = this._formBuilder.group({
      climat : ['', Validators.required],
      user : ['', Validators.required],
      repository : ['', Validators.required],
      minutes : ['', Validators.required],
      hours : ['', Validators.required],
      days : ['', Validators.required],
      months : ['', Validators.required],
      rssUrl : ['', Validators.required],
      years : ['', Validators.required],
      currency : ['',  Validators.pattern("^[0-9]*$")],
      limite : ['',  Validators.pattern("^[0-9]*$")],
      temperature: ['',  Validators.pattern("-?[0-9]*$")],
      city: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  setVariable(data : any) {
    this.actionSelect = this.Actions.find((element: any) => { return element.name == data});
    if (this.actionSelect.config)
      this.variables = Object.entries(this.actionSelect.config);
    console.log(this.variables);
  }

  setReactionVariable(data : any) {
    this.reactionSelect = this.Reactions.find((element: any) => { return element.name == data});
    this.reactionvariables = Object.entries(this.reactionSelect.config);
    console.log(this.reactionvariables);
  }

  createArea() {

    let area = {
      actionUUID : this.actionSelect ? this.actionSelect.uuid : this.reactionSelect.uuid ,
      reactionUUID : this.reactionSelect.uuid,
      actionConfig	: this.actionSelect ? JSON.stringify(this.actionSelect.config) : "{}",
      reactionConfig : JSON.stringify(this.reactionSelect.config)
    };

    if (this.actionSelect && !this.actionSelect.config) {
      area.actionConfig = "{}";
    }

    this.AreaService.createArea(area).then((data) => {
      data.configAction = Object.entries(data.actionConfig);
      data.configReaction = Object.entries(data.reactionConfig);
      this.dialogRef.close({area : data, service : this.data.uuidService});
    }).catch((error) => {console.log('area error', error);});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

