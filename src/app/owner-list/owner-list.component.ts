import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: Array<any>;
  checkedBool: boolean=true;

  constructor(private ownerService: OwnerService) { }

  ngOnInit() {
    this.ownerService.getAll().subscribe(data => {
      this.owners = data['_embedded']['owners'];
      for (const owner of this.owners) {
        owner.check = false;
      }
    });
  }

  remove(href) {
   this.ownerService.remove(href).subscribe(result => {
      this.ngOnInit();
    }, error => console.error(error));
  }

  removeSelected() {
    this.owners.forEach(ownerAux => {
      if(ownerAux.check) {  
        ownerAux.check = false;
        // console.log("DODNI: "+ownerAux._links.self.href);
        this.remove(ownerAux._links.self.href);
      }
    });
  }  

  changeEvent() {
    (this.owners.some(owner => owner.check) ? this.checkedBool= false : this.checkedBool= true); 
  }
}