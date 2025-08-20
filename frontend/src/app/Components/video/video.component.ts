import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit ,ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { CommentComponent } from '../comment/comment.component';
import { interval, Subscription, takeWhile } from 'rxjs';
import { MatButtonModule} from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { VideodetailComponent } from "../videodetail/videodetail.component";
import { trigger, transition, style, animate } from '@angular/animations';
import { UploadfileService } from '../../Services/uploadfile.service';
import { videoModel } from '../../Models/video.model';
import { Title } from '@angular/platform-browser';
import { WebtorrentService } from '../../Services/webtorrent.service';
import WebTorrent from 'webtorrent';


@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommentComponent, MatButtonModule, VideodetailComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
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
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {

  baseUrl : string = `${environment.baseUrl}/video/` 
  videoId! : number 
  @ViewChild('videoplayer', {static : true}) videoPlayer! : ElementRef
  @ViewChild('container', {static : true}) container! : ElementRef
  parammap$! : Subscription
  videoDetail! : videoModel

  //all subs
  videoDetail$! : Subscription
  subCount!: number;
  action: any;
  closer$!: Subscription;

  constructor(private _route : ActivatedRoute,
    private _videoService : UploadfileService,
    private title : Title,
    private webtorrent : WebtorrentService
  ){}

  ngOnInit(){
    this.parammap$ = this._route.paramMap.subscribe(
      (response) => {
        this.videoId = Number(response.get('VideoId'))
        // this.getVideoDetails()
      }
    )
  }

  ngAfterViewInit(): void {
    this.getVideoDetails()
  }

  getVideoDetails() {
    this.videoDetail$ = this._videoService.getVideoDetails(this.videoId).subscribe({
      next: (res) => {
        this.videoDetail = res.videoDetail
        this.subCount = res.sub
        this.action = res.action
        this.title.setTitle(this.videoDetail.title);
        let torrentp : any = this.webtorrent.client.get(this.videoDetail.infoHash) as any
        if (!torrentp) {
          this.webtorrent.client.add(this.videoDetail.infoHash, (torrent) => {
            torrent.files[0].renderTo(this.videoPlayer.nativeElement)
            // torrent.files[0].appendTo(this.container.nativeElement)
          })
        } else {
          this.closer$ = interval(1000).pipe(takeWhile(() => torrentp.files[0] == undefined)).subscribe({
            complete : () => torrentp.files[0].renderTo(this.videoPlayer.nativeElement)
          })
          // torrentp.files[0].renderTo(this.videoPlayer.nativeElement)
          // torrentp.files[0].appendTo(this.container.nativeElement)
        }
      }
    })
  }

  showVideoBorder = true
  onFullScreen(){
    if(document.fullscreenElement){
      this.showVideoBorder = false
    }else{
      this.showVideoBorder = true
    }
  }

  ngOnDestroy(): void {
    this.videoPlayer.nativeElement.src = ''
    this.videoPlayer.nativeElement.load()

    this.parammap$ ? this.parammap$.unsubscribe() : undefined
    this.videoDetail$ ? this.videoDetail$.unsubscribe() : undefined
    this.closer$ ? this.closer$.unsubscribe() : undefined
  }
}
