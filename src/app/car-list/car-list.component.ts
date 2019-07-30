import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarService } from '../shared/car/car.service';
import {OwnerService} from '../shared/owner/owner.service';
import { GiphyService } from '../shared/giphy/giphy.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Array<any>;
  car: any = {};
  owner: Array<any>;

  constructor(private _snackBar: MatSnackBar, private carService: CarService, private ownerService: OwnerService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        if(!car.ownerDni){
          car.ownerDniChar = "No Owner";
        } else{
          this.ownerService.getOwner(car.ownerDni).subscribe(data => {
            this.owner = data['_embedded']['owners']
            if (this.owner && this.owner.length > 0) {              
              car.ownerDniChar = car.ownerDni;              
              console.log(`Owner with DNI '${car.ownerDni}' found`);
            } else {
              console.log(`Owner with DNI '${car.ownerDni}' not found.`);             
              car.ownerDni = null;
              car.ownerDniChar = "No Owner";
              this.carService.save(car).subscribe(result => {this._snackBar.open(`Link with owner removed`, 'OK', {
                duration: 5000,
              }); }, error => console.error(error));
            }
          });
        }
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
      }
    });
  }

  remove(id) {
    this.carService.get(id).subscribe((car: any) => {
      if (car) {
        this.car = car;            
        var href = car._links.self.href;          
      }
    
    this.carService.remove(href).subscribe(result => {
      this._snackBar.open('Success: Car Deleted', 'OK', {
        duration: 5000,
      });
      this.ngOnInit();
    }, error => console.error(error));
  }, error => console.error(error));
}
}
