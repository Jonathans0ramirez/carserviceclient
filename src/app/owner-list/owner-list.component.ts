import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  owner: any = {};

  constructor(private ownerService: OwnerService) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      this.owners = data['_embedded']['owners'];
    });
  }

  remove(href) {
   this.ownerService.remove(href).subscribe(result => {
      this.ngOnInit();
    }, error => console.error(error));
  }
}