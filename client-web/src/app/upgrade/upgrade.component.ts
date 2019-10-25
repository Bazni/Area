import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  styleUrls: ['./upgrade.component.css']
})
export class UpgradeComponent implements OnInit {

  constructor(){
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = '../../assets/client.apk';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  ngOnInit() {
  }

}
