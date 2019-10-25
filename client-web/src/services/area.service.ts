import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  actionsUrl: string  = environment.apiUrl + "actions";
  servicesUrl: string = environment.apiUrl + "services";
  reactionsUrl: string = environment.apiUrl + "reactions";
  actionByServiceUrl: string = environment.apiUrl + "actions/";
  reactionByServiceUrl: string = environment.apiUrl + "reactions/";
  areaUrl: string = environment.apiUrl + "area";
  areasUrl: string = environment.apiUrl + "areas";
  areaServiceUrl : string = environment.apiUrl + "areas/service/";
  deleteareasUrl: string = environment.apiUrl + "area/";
  actions : any;
  services : any;
  reactions : any;
  constructor(private http : HttpClient) {

  }

  getActions () {
    return this.http.get(this.actionsUrl).toPromise().then((data) => {this.actions = data; return data;}, (error) => {console.log(error); return error});
  };

  getServices() {
    return this.http.get(this.servicesUrl).toPromise().then((data) => {this.services = data; return data;}, (error) => {console.log(error); return error;});
  }

  getReactions() {
     return this.http.get(this.reactionsUrl).toPromise().then((data) => {this.reactions = data; return data;}, (error) => {console.log(error); return error;});
  }
  getActionbyservice(uuid: string) {
    return this.http.get(this.actionByServiceUrl + uuid).toPromise().then((data) => {return data}, (error) => {console.log(error); return error;})
  }
  getReactionbyservice(uuid: string) {
    return this.http.get(this.reactionByServiceUrl + uuid).toPromise().then((data) => {return data}, (error) => {console.log(error); return error;})
  }

  createArea(area : any) {
    return this.http.post(this.areaUrl, area).toPromise().then((data) => {return data}, (error) => {console.log(error); return error;})
  }
  getAreas() {
    return this.http.get(this.areasUrl).toPromise().then((data) => {return data}, (error) => {console.log(error); return error;})
  }
  getAreaByService(uuid : string) {
    return this.http.get(this.areaServiceUrl + uuid).toPromise().then((data) => {return data}, (error) => {return error;})
  }
  deleteArea(uuid: string) {
    return this.http.delete(this.deleteareasUrl + uuid).toPromise().then( (data) => {return data;}, (error) => {return error;})
  }
  updateArea(area : any) {
    return this.http.put(this.deleteareasUrl + area.uuid, area).toPromise().then((data) => {return data;}, (error) => {return error})
  }
}
