import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { uploadBody } from '../Models/upload.model';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadfileService {

  fileUploaded = new Subject<string>()

  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }

  uploadedfile  : string[]= []

  uploadFile(body : uploadBody){
    let formdata = new FormData()
    formdata.append('video',body.file[0])
    formdata.append('title',body.title)
    formdata.append('description',body.description)
    
    return this.http.post<any>(this.baseUrl + '/video/upload', formdata, {reportProgress : true, observe : 'events'})
  }

  getFile(pagenumber : number){
    return this.http.get<any>(this.baseUrl + '/video/page/' + pagenumber)
  }

  //use it only when streaming video because the view counter is attached to this
  getVideoDetails(videoId : number){
    return this.http.get<any>(this.baseUrl + '/video/detail/' + videoId)
  }

  reportVideo(videoid : string | number){
    return this.http.post<any>(this.baseUrl + '/video/report' , {id: videoid})
  }

  searchVideo(title : string){
    return this.http.post<any>(this.baseUrl + '/video/search' , {title : title})
  }

  likedislikeVideo(action : string, videoid : number|string){
    return this.http.post<any>(this.baseUrl + '/video/action', {action : action, VideoId : videoid})
  }

  getTrendingVideo(){
    return this.http.get<any>(this.baseUrl + '/video/trending')
  }

  downloadVideo(id : string|number){
    return this.http.get(this.baseUrl + '/video/download/' + id, { responseType: 'blob' })
  }
}
