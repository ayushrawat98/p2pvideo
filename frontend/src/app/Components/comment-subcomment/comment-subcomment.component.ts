import { Component, input, output, Signal, signal} from '@angular/core';
import { commentModel } from '../../Models/comment.model';
import { AuthenticateService } from '../../Services/authenticate.service';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { CommentService } from '../../Services/comment.service';
import { SortPipe } from '../../Pipes/sort.pipe';
import { MatIcon } from '@angular/material/icon';
import { jwtData } from '../../Models/jwt.model';
import { NgClass } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-comment-subcomment',
  standalone: true,
  imports: [MatFormField, MatInput,MatLabel , MatIcon,MatButtonModule,MatSuffix, ReactiveFormsModule, SortPipe,NgClass],
  templateUrl: './comment-subcomment.component.html',
  styleUrl: './comment-subcomment.component.scss'
})
export class CommentSubcommentComponent {
  comment = input.required<commentModel>()
  videoId = input.required<number>()
  userId = input.required<number>()
  updateComments = output<boolean>()
  loggedIn! : Signal<boolean>
  userData! : Signal<jwtData>
  showReply = false
  showSubcomment = false
  commentFormControl = new FormControl('', {nonNullable : true})

  constructor(private _authService : AuthenticateService, private _commentService : CommentService){
    this.loggedIn = this._authService.loggedIn
    this.userData = this._authService.user_data
  }

  postComment(){
    //sub comments can only be inserted for a parentcomment
    //if parentcommentid is null , then means we are replying to a parent comment , so we are sending its id
    //if parentcommentid is present , that means we are replying to a child comment , so we are sending child comment's parentid
    let body : commentModel = {
      id : this.comment().id,
      VideoId : this.videoId(),
      comment : this.commentFormControl.value,
      parentcommentid : this.comment().parentcommentid || this.comment().id,
    }
    this._commentService.postSubcommentOnComment(body).pipe(debounceTime(1500)).subscribe({
      next : (response) => {
        this.updateComments.emit(true)
        this.commentFormControl.reset()
        this.showReply = false
      }
    })
  }

  addUserName(){
    this.commentFormControl.setValue(`@${this.comment().Commentor?.username} `)
  }

  updateTopComments(){
    this.updateComments.emit(true)
  }
}
