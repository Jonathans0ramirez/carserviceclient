import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '../shared/owner/owner.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit, OnDestroy {
  owner: any = {};

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private router: Router,
              private ownerService: OwnerService) {
  }

  
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const href = params['href'];
      if (href) {
        this.ownerService.get(href).subscribe((owner: any) => {
          if (owner) {
            this.owner = owner;            
            this.owner.href = owner._links.self.href;
          } else {
            this._snackBar.open(`Owner with href '${href}' not found, returning to owner list`, 'OK', {
              duration: 5000,
            });
            this.gotoOwnerList();
          }
        });
      }
    });
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoOwnerList() {
    this.router.navigate(['/owner-list']);
  }


  save(form: NgForm) {
    this.ownerService.save(form).subscribe(result => {
      this._snackBar.open('Success: Owner Saved', 'OK', {
        duration: 5000,
      });
      this.gotoOwnerList();
    }, error => console.error(error));
  }
}
