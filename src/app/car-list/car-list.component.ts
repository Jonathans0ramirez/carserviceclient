import { Component, OnInit } from '@angular/core';
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

  constructor(private carService: CarService, private ownerService: OwnerService, private giphyService: GiphyService) { }

  ngOnInit() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        if(!car.ownerDni){
          car.ownerDniChar = "No Owner";
        } else{
          this.ownerService.hasOwner(car.ownerDni).subscribe(bin => {
            if(!bin){
              car.ownerDni = null;
              console.log("SII");
              car.ownerDniChar = "No Owner";
            } else {
              car.ownerDniChar = car.ownerDni;
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
      this.ngOnInit();
    }, error => console.error(error));
  }, error => console.error(error));
}
}
