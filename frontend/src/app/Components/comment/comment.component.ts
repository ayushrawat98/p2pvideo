import { Component, effect, input, OnInit, Signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {MatIcon, MatIconModule} from '@angular/material/icon'
import { CommentService } from '../../Services/comment.service';
import { AuthenticateService } from '../../Services/authenticate.service';
import { commentModel } from '../../Models/comment.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentSubcommentComponent } from '../comment-subcomment/comment-subcomment.component';
import { debounceTime, delay } from 'rxjs';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatFormField,MatLabel, MatInput, MatIconButton, MatIconModule,MatSuffix, ReactiveFormsModule, CommentSubcommentComponent],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent implements OnInit {

  videoId = input.required<number>()
  userId = input.required<number>()
  comments : commentModel[] = []
  loggedIn! : Signal<boolean>
  commentFormControl = new FormControl('', { nonNullable : true} )

  constructor(private _commentService : CommentService,private _authService : AuthenticateService){
    effect(() => {
      this.getComments()
    })
  }

  ngOnInit(): void {
    this.loggedIn =  this._authService.loggedIn
  }

  getComments(){
    this._commentService.getCommentOnVideo(this.videoId()).pipe(delay(500)).subscribe({
      next : (response) => {
        this.comments = response
      },
      error : (error) => {
        console.error(error)
      }
    })
  }

  postComment(){
    let commentBody : commentModel = {
      comment : this.commentFormControl.value.trim(),
      VideoId : this.videoId()
    }
    this._commentService.postCommentOnVideo(commentBody).pipe(debounceTime(1500)).subscribe({
      next : (response) => {
        this.getComments()
        this.commentFormControl.reset()
      }
    })
  }

  getSubcomment(){

  }

  postSubcomment(){

  }

}
