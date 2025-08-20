import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { VideolistComponent } from '../videolist/videolist.component';
import { UploadfileService } from '../../Services/uploadfile.service';
import { videoModel } from '../../Models/video.model';
import { delay, Subscription } from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator'
import { trigger, transition, style, animate } from '@angular/animations';
import {Title} from '@angular/platform-browser'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { WebtorrentService } from '../../Services/webtorrent.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [VideolistComponent, MatPaginator, MatProgressSpinnerModule, MatTabGroup, MatTab],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
      trigger('slideFromTop', [
        // On element enter, start from above and slide to its position, with opacity fade-in
        transition(':enter', [
          style({  opacity: 0 }), // Start off-screen and fully transparent
          animate('500ms ease-out', style({  opacity: 1 })) // Slide to normal position and fade in
        ]),
        // On element leave, slide it back to the top and fade-out
        transition(':leave', [
          animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 })) // Slide off-screen and fade out
        ])
      ])
    ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  allvideo : {count : number , rows : videoModel[]} = {count : 0, rows : []}
  fileUpdateSubscription! : Subscription
  pageNumber = 0
  @ViewChild('latest') targetElement!: ElementRef;
  loading = true
  trendingVideo! : videoModel[]

  constructor(private _uploadService : UploadfileService, private title : Title, private webtorrent : WebtorrentService){}

  ngOnInit(){
    this.title.setTitle('BharatTube')
    this.fileUpdateSubscription = this._uploadService.fileUploaded.pipe(delay(3000)).subscribe(
      (response) => {
        this.getVideos()
      }
    )

    this.getVideos()
    // this.getTrendingVideo()
  }

  getVideos(){
    this.loading = true
    this._uploadService.getFile(this.pageNumber).subscribe({
      next : (res) => {
        this.allvideo = res
          this.loading = false
      }
    })
  }

  goToPage(event : PageEvent){
    this.pageNumber = event.pageIndex
    this.getVideos()
    this.targetElement.nativeElement.scrollIntoView({ behavior: 'smooth' })
  }

  getTrendingVideo(){
    this._uploadService.getTrendingVideo().subscribe({
      next : (res) => {
        this.trendingVideo = res
      }
    })
  }

  ngOnDestroy(): void {
    this.fileUpdateSubscription.unsubscribe()
  }

}


