import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { commentModel } from '../Models/comment.model';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }

  getCommentOnVideo(videoId : number){
    return this.http.get<any>(this.baseUrl + '/comment/video/' + videoId)
  }

  postCommentOnVideo(body : commentModel){
    return this.http.post<any>(this.baseUrl + '/comment/video/' + body.VideoId, body)
  }

  getSubcommentOnComment(commentId : number){
    return this.http.get<any>(this.baseUrl + '/comment/' + commentId)
  }

  postSubcommentOnComment(body : commentModel){
    return this.http.post<any>(this.baseUrl + '/comment/' + body.id, body)
  }
}
