# CarServiceClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## :open_file_folder: Documentation

Components and services added or changed after fork.

## app-module

Modules of Angular Material. 

* MatCheckBoxModule
* MatIconModule
* MatMenuModule
* MatSelectModule
* MatSlideToogleModule
* MatGridListModule

 ```import { MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatToolbarModule, MatSelectModule, MatSlideToggleModule, MatSnackBarModule, MatGridListModule } from '@angular/material';```

## main.ts

Import `HammerJs` for the correct operation of some menus.

## app-component

The toolbar has been modified to be more friendly with user. Changing the primary color and adding two menus for owner and car. In each one there are two options, list and add. To switch between those components was necessary to import the library package `Router` from `@angular/router`

  ```import { Router } from 'node_modules/@angular/router';```
  
>**Toolbar**

        <mat-toolbar color="primary">  
          <span>Welcome to {{title}}!</span>
          <mat-toolbar-row>
        </mat-toolbar>
            <span>Welcome to {{title}}!</span>
            <span class="example-spacer"></span>
        <router-outlet></router-outlet>
            <button mat-button [matMenuTriggerFor]="carMenu"><mat-icon class="example-icon" aria-hidden="false" aria-label="Example heart icon">drive_eta</mat-icon>Car</button>
            <button mat-button [matMenuTriggerFor]="ownerMenu"><mat-icon class="example-icon" aria-hidden="false" aria-label="Example heart icon">person</mat-icon>Owner</button>
          </mat-toolbar-row>
          </mat-toolbar>
          <mat-menu #carMenu="matMenu">
            <button mat-menu-item [routerLink]="['/car-list']" *ngIf="router.url != '/car-list'"><mat-icon>list</mat-icon>Car List</button>
            <button mat-menu-item [routerLink]="['/car-add']" *ngIf="router.url != '/car-add'"><mat-icon>add</mat-icon>Add Car</button>
          </mat-menu>
          <mat-menu #ownerMenu="matMenu">
            <button mat-menu-item [routerLink]="['/owner-list']" *ngIf="router.url != '/owner-list'"><mat-icon>list</mat-icon>Owner List</button>
            <button mat-menu-item [routerLink]="['/owner-add']" *ngIf="router.url != '/owner-add'"><mat-icon>add</mat-icon>Add Owner</button>
          </mat-menu>

## ownerService

A function was created to get the owner with a DNI parameter.

     getOwner(dni:string) {
      const apiLink = this.FINDOWNERDNI_API + dni;
      return this.http.get(apiLink);
    }

## car-list

The way to list was changed from list to card. The edit and delete buttons were also changed. When this component init, a query is made with each car to verify if there is an car-owner association.

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

## car-edit

A Select Option was added to allow linking a car with an owner easily, implementing `getOwners()`. The style of the buttons was also changed from raised to flat. 

      <mat-form-field>
        <mat-select placeholder="Select" [(ngModel)]="car.ownerDni" name="ownerDni" #ownerDni>
            <mat-option>--</mat-option>
          <mat-option *ngFor="let owner of owners" [value]="owner.dni">{{owner.name}}</mat-option>
        </mat-select>
      </mat-form-field>
      
>**.ts**

    getOwners(){
      this.ownerService.getAll().subscribe(owners => {
        this.owners = owners['_embedded']['owners'];      
      });
    }

## owner-list

Here are a few changes compared to Car-List component. A `SlideToogle` was added to bring the possibility to remove one or more owners at once. In addition, the delete selection button will only be available if at least one `CheckBox` is selected.

>*SlideToogle*

    <mat-slide-toggle class="margin" [color]="warn" [(ngModel)]="checked" (change)="changeSlideEvent($event)">
        Slide to {{checked ? 'cancel selection' : 'select which ones to delete'}}
    </mat-slide-toggle>
    
>*CheckBox*

    <div><mat-checkbox [(ngModel)]="owner.check" *ngIf="checked" (change)="changeCheckBoxEvent($event)"></mat-checkbox></div>
    
>**.ts** 

    removeSelected() {
      this.owners.forEach(ownerAux => {
        if(ownerAux.check) {  
          ownerAux.check = false;
          console.log("DODNI: "+ownerAux._links.self.href);
          this.remove(ownerAux._links.self.href);
        }
      });
      this._snackBar.open('Success: Owner(s) Deleted', 'OK', {
        duration: 5000,
      });
    } 
    
    
    changeSlideEvent() {
      this.owners.forEach(owner => owner.check = false);
      this.checkedBool= true;
    } 

    changeCheckBoxEvent() {
      (this.owners.some(owner => owner.check) ? this.checkedBool= false : this.checkedBool= true); 
    }

## owner-edit

Very similar to Car-Edit Component.



## :camera_flash: Screenshots

Documentation on how to navigate the project.

### :bookmark_tabs: Menu Section

:oncoming_automobile: Car tab | :person_with_blond_hair: Owner tab
------------ | -------------
![toCarList](https://user-images.githubusercontent.com/42523266/62013258-8b5d6100-b155-11e9-9e07-618121479e2f.png) | ![toOwnerList](https://user-images.githubusercontent.com/42523266/62013260-8b5d6100-b155-11e9-9c67-1dcb437f3354.png)
**To view the car list, click on the car list button as shown above.** | **To view the owner list, click on the owner list button as shown above.**
![toAddCar](https://user-images.githubusercontent.com/42523266/62013203-efcbf080-b154-11e9-84c2-92ff2115425b.png) | ![toAddOwner](https://user-images.githubusercontent.com/42523266/62013204-f0648700-b154-11e9-99de-3e9df789e90d.png)
**To add a car, click on the add car button as shown above.** | **To add an owner, click on the add car button as shown above.**

### :page_with_curl: List Section

List of cars | List of owners
------------ | -------------
![CarList](https://user-images.githubusercontent.com/42523266/62012760-f1df8080-b14f-11e9-83b3-f595cfcbf529.PNG) | ![OwnerList](https://user-images.githubusercontent.com/42523266/62013186-cd39d780-b154-11e9-93a0-5c7abe185b01.png)

### :heavy_plus_sign: Add Section

Add cars | Add owners
------------ | -------------
![AddCar](https://user-images.githubusercontent.com/42523266/62013201-efcbf080-b154-11e9-9e45-f9a5fc27bd3e.png) | ![AddOwner](https://user-images.githubusercontent.com/42523266/62013875-db8cf100-b15e-11e9-81b2-f23827b972c8.png)

### :pencil: Edit Section

Edit Car | Edit Owner
------------ | -------------
![toEditOwner](https://user-images.githubusercontent.com/42523266/62013259-8b5d6100-b155-11e9-9f83-cc20f0e1fa7e.png) | ![EditOwner](https://user-images.githubusercontent.com/42523266/62013267-8d272480-b155-11e9-86d4-0e425626659b.png)
![EditCar](https://user-images.githubusercontent.com/42523266/62013266-8d272480-b155-11e9-97de-326efab8bc9f.png)
***Here we can also attach an owner to a car***

>**See how owner is attached to Mustang GT**

![CarListWithOwner](https://user-images.githubusercontent.com/42523266/62013263-8bf5f780-b155-11e9-8338-add9a38caef6.png)

### :x: Delete Section
#### • Delete an owner
![DeleteOwner](https://user-images.githubusercontent.com/42523266/62013265-8c8e8e00-b155-11e9-828f-7a399861242d.PNG)

>**NOTE:** *If an owner is deleted from owners list. Each link with his cars is removed.*

![CarListWithoutOwner](https://user-images.githubusercontent.com/42523266/62013262-8bf5f780-b155-11e9-88e2-6c93a79ce464.png)

#### • Delete a car
![DeleteCar](https://user-images.githubusercontent.com/42523266/62013264-8c8e8e00-b155-11e9-9aaf-fe33ea7818f3.PNG)
>*After delete the car*

![CarListAfter](https://user-images.githubusercontent.com/42523266/62013261-8b5d6100-b155-11e9-8e32-289d61f2925a.PNG)
