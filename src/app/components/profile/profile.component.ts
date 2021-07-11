import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces';
import { AuthenticationService } from 'src/app/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
        this.currentUser = user;
      
      
    });
}
  ngOnInit(): void {
  }

}
