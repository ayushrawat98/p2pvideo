import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { MatChipListbox, MatChipOption } from '@angular/material/chips'
import { VideolistComponent } from "../videolist/videolist.component";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [MatChipListbox, MatChipOption, VideolistComponent, VideolistComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss',
  animations: [
      trigger('slideFromTop', [
        // On element enter, start from above and slide to its position, with opacity fade-in
        transition(':enter', [
          style({  opacity: 0 }), // Start off-screen and fully transparent
          animate('500ms ease-out', style({ opacity: 1 })) // Slide to normal position and fade in
        ]),
        // On element leave, slide it back to the top and fade-out
        transition(':leave', [
          animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })) // Slide off-screen and fade out
        ])
      ])
    ]
})
export class SubscriptionComponent implements OnInit {

  subList!: any
  allVideoList!: any[]
  constructor(private _userService: UserService) { }

  ngOnInit(): void {
    this._userService.getUserSubscriptionList().subscribe(
      (response) => {
        this.subList = response
        this.getVideoList(response)
      }
    )
  }

  getVideoList(response : any){
    // this.allVideoList = response.map((x: any) => { return x.subscribedto.Videos.map((y: any) => ({ ...y, User: { username: x.subscribedto.username } })) }).flat().sort((a: any, b: any) => { if (new Date(a.createdAt) < new Date(b.createdAt)) { return 1 } else { return -1 } })
    // this.allVideoList = response.map((x: any) => { return x.subscribedto.Videos.map((y: any) => ({ ...y, User: { username: x.subscribedto.username } })) }).flat()
    this.allVideoList = response.SubscribedTo.map((x:any) => {return x.UserVideos.map((y:any) => ({...y, Uploader : {username : x.username, id : x.id}}))}).flat()
    console.log(this.allVideoList)
  }

}
