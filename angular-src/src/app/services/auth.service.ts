import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  //authToken and user variables
  authToken: any;
  user: any;

  //constructor injects dependencies/imports we need for this class
  constructor(private http: Http) { }

  //register method for a new user
  registerUser(user){
    //add the headers of content type
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //return responce from sending a post to the API's register route and supply the user object and headers
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
    .map(res => res.json());
  }

  //authenticate takes in a user object
  authenticateUser(user){
    //add the headers of content type
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    //return responce from sending a post to the authenticate route and supply the user object and headers
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
    .map(res => res.json());
  }

  //get profile
  getProfile(){
    //add the headers, this time autherization header as well as content type
    //autherization header value is the jwt token
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    //return responce from the API's profile route and supply the headers
    return this.http.get('http://localhost:3000/users/profile', {headers: headers})
    .map(res => res.json());
  }

  //storeuserdata method which takes in a token and user object
  storeUserData(token, user){
    //store the token with name of 'id_token' and value of token
    //and string representation of the json user object to localstorage
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    //assign the details stored to the local variables of this class
    this.authToken = token;
    this.user = user;
  }

  //this method retrieves jwt token from localstorage and assigns it to authToken
  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  //this is a angular2-jwt method which just checks if the token of name 'id_token' has expired
  loggedIn(){
    return tokenNotExpired('id_token');
  }

  //logout method, which nukes the token and user data from this class and localstorage
  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
