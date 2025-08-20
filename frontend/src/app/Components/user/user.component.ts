import { Component, OnInit, Signal } from '@angular/core';
import { VideolistComponent } from "../videolist/videolist.component";
import { UserService } from '../../Services/user.service';
import { videoModel } from '../../Models/video.model';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticateService } from '../../Services/authenticate.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { debounceTime, forkJoin } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [VideolistComponent,MatButton ,MatIcon, MatProgressSpinnerModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  animations: [
        trigger('slideFromTop', [
          // On element enter, start from above and slide to its position, with opacity fade-in
          transition(':enter', [
            style({ opacity: 0 }), // Start off-screen and fully transparent
            animate('500ms ease-out', style({  opacity: 1 })) // Slide to normal position and fade in
          ]),
          // On element leave, slide it back to the top and fade-out
          transition(':leave', [
            animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })) // Slide off-screen and fade out
          ])
        ])
      ]
})
export class UserComponent implements OnInit {
  uploadedVideoList!: videoModel[]
  userId! : number
  user!: any
  loggedIn! : Signal<Boolean>
  loading = true

  constructor(private _userService: UserService, private router : ActivatedRoute, private _matSnackBar : MatSnackBar, private _authService : AuthenticateService) { }

  ngOnInit(): void {
    this.loggedIn = this._authService.loggedIn
    
    this.router.paramMap.subscribe(
      (response) => {
        this.userId = Number(response.get('UserId'))
        // this.getVideos()
        // this.getUser()

        forkJoin([this._userService.getUserVideos(this.userId), this._userService.getUser(this.userId)]).subscribe({
          next : (res) => {

            this.uploadedVideoList = res[0].map((video: videoModel[]) => {
              return {
                ...video,
              }
            })

            this.user = res[1]
            if(this.loggedIn()){
              this.amISubscribed()
            }

            this.loading = false

          }
        })
      }
    )
  }

  getVideos(){
    this._userService.getUserVideos(this.userId).subscribe({
      next: (res: videoModel[]) => {
        this.uploadedVideoList = res.map(video => {
          return {
            ...video,
          }
        })
      }
    })
  }

  subscribe(){
    this._userService.subscribeToUser({UserId : this.userId}).pipe(debounceTime(1000)).subscribe({
      next : (response) => {
        this._matSnackBar.open(response.message, 'OK', {duration:2000})
        this.amISub = response.message == "Subscribed" ? true : false
      },
      error : (error) => {
        this._matSnackBar.open(error.error.message, 'OK', {duration : 2000})
      }
    })
  }

  getUser(){
    this._userService.getUser(this.userId).subscribe(
      (response)=>{
        this.user = response
        if(this.loggedIn()){
          this.amISubscribed()
        }
      },
      (error) => {
        this._matSnackBar.open(error.error.message, 'OK', {duration : 2000})
      }
    )
  }

  amISub!: boolean
  amISubscribed(){
    this._userService.amISubscribed(this.user.id).subscribe({
      next : (res) => {
        this.amISub = res.message == "yes" ? true : false
      }
    })
  }
}
