import {  Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { videoModel } from '../../Models/video.model';
import { ProfileTableComponent } from '../profile-table/profile-table.component';
import { AuthenticateService } from '../../Services/authenticate.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ ProfileTableComponent ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
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
export class ProfileComponent implements OnInit {

  uploadedVideoList! : videoModel[]
  

  constructor(private _userService : UserService, private _authService : AuthenticateService){}

  ngOnInit(){
    this._userService.getUserVideos(this._authService.user_data().id).subscribe({
      next : (res : videoModel[]) => {
        this.uploadedVideoList = res.map(video => {
          return {
            ...video,
          }
        })
      }
    })
  }
}

