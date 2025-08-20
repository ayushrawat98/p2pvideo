import {Component,input, OnInit } from '@angular/core';
import { videoModel } from '../../Models/video.model';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent} from '@angular/material/card'
import { environment } from '../../../environments/environment';
import { interval, map, Subject, Subscribable, Subscription, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-videothumbnail',
  standalone: true,
  imports: [RouterLink, MatCard, MatCardContent],
  templateUrl: './videothumbnail.component.html',
  styleUrl: './videothumbnail.component.scss',
})
export class VideothumbnailComponent implements OnInit {

  baseUrl = `${environment.staticBaseUrl}/thumbnails/`

  videoDetails = input.required<videoModel>()

  imageList : string[] = []

  imgurl = ""

  slideshow$ = new Subject<string>()

  ngOnInit(): void {
    this.imgurl = this.baseUrl + this.videoDetails().id + '.jpg'
    this.imageList = [
      this.baseUrl + this.videoDetails().id + '-1.jpg',
      this.baseUrl + this.videoDetails().id + '-2.jpg',
      this.baseUrl + this.videoDetails().id + '-3.jpg',
      this.baseUrl + this.videoDetails().id + '-4.jpg',
      this.baseUrl + this.videoDetails().id + '.jpg',
    ]
  }


  tempsub! : Subscription
  slideshowImageTouch(){
    if(this.tempsub){this.tempsub.unsubscribe()}
    this.tempsub = interval(1000).pipe(
      take(5),
      map(i => {
          return this.imageList[i%5]
      })
      ).subscribe({
      next : (res) => {
        this.imgurl = res
      },
      complete : () => {
        this.imgurl = this.baseUrl + this.videoDetails().id + '.jpg'
      }
    })
  }

  slideshowImage(event : any){
    interval(1000).pipe(
      takeUntil(this.slideshow$),
      take(5),
      map(i => {
          return this.imageList[i%5]
      })
      ).subscribe({
      next : (res) => {
        this.imgurl = res
      },
      complete : () => {
        this.imgurl = this.baseUrl + this.videoDetails().id + '.jpg'
      }
    })
  }

  stopSlideshow(){
    this.slideshow$.next('')
    this.slideshow$.complete()
    this.slideshow$ = new Subject<string>()
  }
}
