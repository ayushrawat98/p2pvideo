import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { jwtData } from '../Models/jwt.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  user_key = signal<string>('')

  user_data = computed<jwtData>(() => {
    let key = this.user_key()
    if(key.length == 0){
      return {id:0, username : '', isAdmin : false}
    }else{
      return jwtDecode(key)
    }
  })

  loggedIn = computed( () => {
    return this.user_key().length > 0
  })

  isAdmin = computed(() => {
    return this.user_data().isAdmin
  })

  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  setUserKey(key : string){
    this.user_key.set(key)
    //set the key for later use
    localStorage.setItem('key', key)
  }

  resetUserKey(){
    this.user_key.set('')
    localStorage.clear()
  }

  login(body : any) {
    return this.http.post<any>(this.baseUrl + '/authenticate/login', body)
  }

  register(body : any) {
	return this.http.post<any>(this.baseUrl + '/authenticate/register', body)
  }
}
