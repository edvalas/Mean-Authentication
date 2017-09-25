import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //variables for username and password
  username:String;
  password:String;

  //constructor injects dependencies/imports we need for this class
  constructor(private authService: AuthService, private router: Router,
  private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }

  //when we click the login button
  onLoginSubmit(){
    //create a user object with username and password
    const user = {
      username: this.username,
      password: this.password
    }

    //pass the object to the authservice and subscribe to the responce
    this.authService.authenticateUser(user).subscribe(data => {
      //if data.success which is a boolean is true
      if(data.success){
        //then store user data and token in localstorage
        this.authService.storeUserData(data.token, data.user);
        //flash a message
        this.flashMessage.show('You are now logged in', {cssClass: 'alert-success', timeout: 3000});  
        //navigate to dashboard
        this.router.navigate(['dashboard']);
      }else{
        //otherwise display error and stay on login page
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});  
        this.router.navigate(['/login']);
      }
    });
  }

}
