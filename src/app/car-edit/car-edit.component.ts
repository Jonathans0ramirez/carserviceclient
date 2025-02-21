import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';
import { OwnerService } from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit, OnDestroy {
  car: any = {};
  owners: any = [];

  sub: Subscription;

  constructor(private route: ActivatedRoute,
              private _snackBar: MatSnackBar,
              private router: Router,
              private carService: CarService,
              private ownerService: OwnerService,
              private giphyService: GiphyService) {
  }

  ngOnInit() {
    this.getOwners();
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.carService.get(id).subscribe((car: any) => {
          if (car) {
            this.car = car;            
            this.car.href = car._links.self.href;
            this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
          } else {
            this._snackBar.open(`Car with id '${id}' not found, returning to list`, 'OK', {
              duration: 5000,
            });
            this.gotoCarList();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoCarList() {
    this.router.navigate(['/car-list']);
  }

  getOwners(){
    this.ownerService.getAll().subscribe(owners => {
      this.owners = owners['_embedded']['owners'];      
    });
  }

  save(form: NgForm) {
    this.carService.save(form).subscribe(result => {
      this._snackBar.open('Success: Car Saved', 'OK', {
        duration: 5000,
      });
      this.gotoCarList();
    }, error => console.error(error)
    );
  }

  remove(href) {
    this.carService.remove(href).subscribe(result => {
      this._snackBar.open('Success: Car Deleted', 'OK', {
        duration: 5000,
      });
      this.gotoCarList();
    }, error => console.error(error)
    );
  }
}

