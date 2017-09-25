import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //variables for user object
  name:String;
  username:String;
  email:String;
  password:String;

  //constructor injects dependencies/imports we need for this class
  constructor(private validateService: ValidateService, private flashMessage: FlashMessagesService,
  private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  //when register form is submitted
  onRegisterSubmit(){
    //create a user object from the variables
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    //validation
    if(!this.validateService.validateRegister(user)){
      this.flashMessage.show('Enter all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if(!this.validateService.validateEmail(user.email)){
      this.flashMessage.show('Enter valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    //register user by calling the authservice and subscribe to the responce
    this.authService.registerUser(user).subscribe(data => {
      //if data.success if true
      if(data.success){
        //flash a message and navigate ot login page
        this.flashMessage.show('Registration Successful', {cssClass: 'alert-success', timeout: 3000});  
        this.router.navigate(['/login']);
      }else{
        //else something went wrong and stay on register page
        this.flashMessage.show('Registration not successful', {cssClass: 'alert-danger', timeout: 3000});  
        this.router.navigate(['/register']);
      }
    });
  }

}
