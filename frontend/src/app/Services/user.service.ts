import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }

  getUserVideos(UserId : number){
    return this.http.get<any>(this.baseUrl + '/user/' +  UserId + '/videos')
  }

  getUserSubscriptionList(){
    return this.http.get<any>(this.baseUrl + '/user/subscription')
  }

  subscribeToUser(body : any){
    return this.http.post<any>(this.baseUrl + '/user/subscribe', body)
  }

  getNotifications(pageNumber : number){
      return this.http.post<any>(this.baseUrl + '/user/notifications', {page : pageNumber})
  }

  markAsReadNotification(){
    return this.http.post<any>(this.baseUrl + '/user/notifications/read', {})
  }

  getUser(id : number | string){
    return this.http.get<any>(this.baseUrl + '/user/details/' + id)
  }

  amISubscribed(id : number|string){
    return this.http.get<any>(this.baseUrl + '/user/amisubscribed/' + id)
  }

  searchUser(name : string){
    return this.http.post<any>(this.baseUrl + '/user/search', {name : name})
  }

  deleteVideoById(id : string|number){
    return this.http.delete<any>(this.baseUrl + '/user/video/' + id)
  }
}
