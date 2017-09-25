import { Injectable } from '@angular/core';
//validation service
@Injectable()
export class ValidateService {

  constructor() { }
  //checking if all fields on the register form are filled in, this method is used in the register component
  validateRegister(user){
    if(user.name == undefined || user.email == undefined
    || user.username == undefined || user.password == undefined){
      return false;
    }else{
      return true;
    }
  }

  //checking that the email entered is of email type
  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
