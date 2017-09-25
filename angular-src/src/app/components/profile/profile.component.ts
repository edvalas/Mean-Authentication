import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  //user object
  user: Object;

  //constructor injects dependencies/imports we need for this class
  constructor(private authService: AuthService, private router: Router) { }

  //on init of this class
  ngOnInit() {
    //subscribe to the data returned from getProfile
    this.authService.getProfile().subscribe(profile => {
      //assign the object to user object which displays on the profile html page
      this.user = profile.user;
    },
    err => {
      return false;
    });
  }

}
