import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
//authGuard service
@Injectable()
export class AuthGuard implements CanActivate{
    //constructor injects dependencies/imports we need for this class 
    constructor(private authService: AuthService, private router: Router){

    }
    //method that uses the authservice loggedIn method, which checks if the token is expired or not
    //and returns true or false
    canActivate(){
        //if token is not expired return true, otherwise bring user to login page, this method protects our dashboard and profile routes
        if(this.authService.loggedIn()){
            return true;
        }else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}