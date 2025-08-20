import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }

  deleteVideoById(id : number|string){
    return this.http.delete<any>(this.baseUrl + '/admin/video/' + id)
  }

  deleteUserById(id : number|string){
    return this.http.delete<any>(this.baseUrl + '/admin/user/' + id)
  }

  deleteCommentById(id : number|string){
    return this.http.delete<any>(this.baseUrl + '/admin/comment/' + id)
  }

  getAllReportedVideos(){
    return this.http.get<any>(this.baseUrl + '/admin/report')
  }
}
