import { Component, computed, effect, input, OnDestroy, OnInit, Renderer2, Signal } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { UploadfileService } from '../../Services/uploadfile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../Services/user.service';
import { AuthenticateService } from '../../Services/authenticate.service';
import { videoModel } from '../../Models/video.model';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { jwtData } from '../../Models/jwt.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-videodetail',
  standalone: true,
  imports: [MatIcon, RouterLink, MatButtonModule, DatePipe],
  templateUrl: './videodetail.component.html',
  styleUrl: './videodetail.component.scss'
})
export class VideodetailComponent implements OnInit, OnDestroy {
  videoId = input.required<number>()
  subCount = input.required<number>()
  action = input.required<any>()
  likes = 0
  dislikes = 0
  userChoice! : 'like'|'dislike'|undefined
  videoDetail = input.required<videoModel>()
  isAdmin!: Signal<Boolean>
  isLoggedIn!: Signal<Boolean>
  userData: Signal<jwtData>;
  baseUrl : string = `${environment.baseUrl}/video/` 

  //all subscription to destroy
  subscribe$! : Subscription
  report$! : Subscription
  amISubscribed$! : Subscription
  

  constructor(
    private _adminService: AdminService,
    private _videoService: UploadfileService,
    private _userService: UserService,
    private _matSnackBar: MatSnackBar,
    private _authService: AuthenticateService,
    private _render : Renderer2
  ) {
    this.isAdmin = this._authService.isAdmin
    this.isLoggedIn = this._authService.loggedIn
    this.userData = this._authService.user_data

    //if user logs in , check if he is subscribed
    effect(() => {
      //runs when logged in change or when input signal change
      if(this.isLoggedIn() && this.videoDetail()){
        this.amISubscribed()
      }

      if(this.action()){
        let filteredaction = this.action().filter((x:any) => x.UserId == this.userData().id)
        if(filteredaction.length > 0){
          this.userChoice = filteredaction[0].action
        }

        this.likes = this.action().filter((x:any)=>x.action == 'like').length
        this.dislikes = this.action().filter((x:any)=>x.action == 'dislike').length
      }
    })

  }

  ngOnInit(): void {
    
  }

  subscribe() {
    this.subscribe$ = this._userService.subscribeToUser({ UserId: this.videoDetail().UploaderUserId }).subscribe({
      next: (response) => {
        this._matSnackBar.open(response.message, 'OK', { duration: 2000 })
        this.amISub = response.message == "Subscribed" ? true : false
      },
      error: (error) => {
        this._matSnackBar.open(error.error.message, 'OK', { duration: 2000 })
      }
    })
  }


  deleteVideo() {
    this._adminService.deleteVideoById(this.videoId()).subscribe(
      (response) => {
        this._matSnackBar.open('Deleted', 'OK', { duration: 2000 })
      }
    )
  }

  report() {
    this.report$ = this._videoService.reportVideo(this.videoId()).subscribe(
      (response) => {
        this._matSnackBar.open('Reported', 'OK', { duration: 2000 })
      }
    )
  }

  share() {
    // Check if the Web Share API is supported by the browser
    if (navigator.share) {
      navigator.share({
        title: this.videoDetail().title,
        text: this.videoDetail().description,
        url: window.location.href
      }).then(() => {

      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    }
  }

  amISub!:boolean
  amISubscribed(){
    this.amISubscribed$ =  this._userService.amISubscribed(this.videoDetail().UploaderUserId).subscribe({
      next : (res) => {
        this.amISub = res.message == "yes" ? true : false
      }
    })
  }

  actionClick(action : string){
    this._videoService.likedislikeVideo(action, this.videoId()).subscribe({
      next : (res) => {
        let temp = action as "like"|"dislike"

        if(this.userChoice == undefined){
          action == 'like' ? ++this.likes : ++this.dislikes
        }else if(this.userChoice != temp){
          if(temp == 'like'){
            ++this.likes
            --this.dislikes
          }else{
            ++this.dislikes
            --this.likes
          }
        }else{
          this.userChoice == 'like' ? --this.likes : --this.dislikes
        }

        if(this.userChoice == temp){
          this.userChoice = undefined
        }else{
          this.userChoice = temp
        }
      }
    })
  }

  downloadFile(): void {
    this._videoService.downloadVideo(this.videoId()).subscribe((res : Blob) => {
      const link = document.createElement('a');
      link.download = this.videoDetail().videoname
      link.href = window.URL.createObjectURL(res);
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
  }

  ngOnDestroy(): void {
    this.subscribe$ ? this.subscribe$.unsubscribe() : undefined
    this.report$ ? this.report$.unsubscribe() : undefined
    this.amISubscribed$ ? this.amISubscribed$.unsubscribe() : undefined
  }

}
