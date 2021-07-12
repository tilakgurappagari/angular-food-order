import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import {  User } from '../../interfaces';
import {  AuthenticationService, UserService } from '../../services';


@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  public dishName: any;
  public description: any;
  public restaurant: any;
  public dishName2: any;
  public description2: any;
  public dishName3: any;
  public description3: any;
  public restaurant2: any;
  public restaurant3: any;

  public singleOrder: boolean = false;
  public secondOrder: boolean = false;
  public thirdOrder: boolean = false;


  constructor(private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService
    ) {

      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;

      
    });
  }

  ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe((params)=>{
          this.dishName = params.get('dishName');
          this.description = params.get('description');
          this.restaurant = params.get('restaurant');
          this.dishName2 = params.get('dishName2');
          this.description2 = params.get('description2');
          this.dishName3 = params.get('dishName3');
          this.description3 = params.get('description3');
          this.restaurant2 = params.get('restaurant2');
          this.restaurant3 = params.get('restaurant3');
        })
        if(this.dishName != null){
          this.singleOrder= true;
        }
        if(this.dishName2 != null){
          this.secondOrder= true;
        }
        if(this.dishName3 != null){
          this.thirdOrder= true;
        }
  }

}
