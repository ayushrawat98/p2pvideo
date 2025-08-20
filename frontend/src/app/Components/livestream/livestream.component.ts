import { Component, effect, ElementRef, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticateService } from '../../Services/authenticate.service';
import { jwtData } from '../../Models/jwt.model';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { transition, trigger, style, animate } from '@angular/animations';

@Component({
  selector: 'app-livestream',
  standalone: true,
  imports: [MatButtonModule, MatChipSet, MatChip, MatFormField, MatLabel, MatInput],
  templateUrl: './livestream.component.html',
  styleUrl: './livestream.component.scss',
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
export class LivestreamComponent implements OnInit, OnDestroy {
  startStreamDisabled = true
  stopStreamDisabled = true
  connection!: WebSocket
  mediaRecorder!: MediaRecorder
  @ViewChild('streamervideo', {static : true}) streamerVideo! : ElementRef
  @ViewChild('streamedvideo', {static : true}) streamedVideo! : ElementRef
  baseUrl : string = `${environment.baseUrl}/video/`
  ms! : MediaSource
  sb! : SourceBuffer
  loggedIn! : Signal<boolean>
  userData! : Signal<jwtData>
  showStreamerVideo = true
  showStreamedVideo = true

  usertext : string[] = [] //user messages
  userName : string[] = [] //all users online

  constructor(private _authenticateService: AuthenticateService, private _matSnackBar : MatSnackBar){
    this.loggedIn = this._authenticateService.loggedIn
    this.userData = this._authenticateService.user_data

    effect(() => {
      //if user logs out or logs out , reset his name 
      if((this.loggedIn() || !this.loggedIn()) && this.connection.readyState == 1){
        this.becomePyaara()
      }
      
    })
  }

  ngOnInit(): void {
    this.connect()
    
    this.ms = new MediaSource()
    this.streamedVideo.nativeElement.src = URL.createObjectURL(this.ms);
    this.ms.addEventListener('sourceopen', () => {
      this.sb = this.ms.addSourceBuffer('video/webm; codecs="vp8, opus"');
    })
  }

  connect() {
    const serverUrl = environment.wsVideoBaseUrl
    this.connection = new WebSocket(serverUrl);
    this.connection.onopen = () => {
      console.log('connection open', this.connection.readyState)
      this.startStreamDisabled = false
      // while(this.connection.readyState == 0){}
      if (this.connection.readyState == 1) {
        this.connection.send(this.userData().username == '' ? "प्यारा" : this.userData().username)
      }
    };
    this.connection.onmessage = (event) => {
      if (typeof event.data == 'string') {
        this.streamText(event.data)
      } else {
        this.streamVideo(event.data)
      }
    };
    this.connection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.connection.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  //change name on logout/login
  becomePyaara(){
    this.connection.send(this.userData().username == '' ? "प्यारा" : this.userData().username)
  }

  checkLength(){
    this.usertext.length == 15 ? this.usertext.pop() : undefined
  }

  sendText(message : string){
    this.checkLength()
    this.usertext.unshift(`@${this.userData().username == '' ? "प्यारा" : this.userData().username} : ${message.trim()}`)
    this.connection.send(`T9${message.trim()}`)
  }

  streamText(message : string) {
    if(message == 'ignore'){

    }
    else if(message == 'locked'){
      this.startStreamDisabled = true
      this.stopStreamDisabled = true
    }
    else if(message == 'unlocked'){
      this.startStreamDisabled = false
      this.stopStreamDisabled = true
      this.ms.endOfStream()
    }
    else if(message.includes("T9")){
      this.checkLength()
      this.usertext.unshift(message.split("T9")[1])
    }else{
    this.userName = message.split(',')
    }
  }

  // timeSet = false
  async streamVideo(data : Blob) {
    this.showStreamedVideo = false
    let temp = await data.arrayBuffer()
    if (this.ms.readyState === 'open' && typeof this.sb != 'undefined' && typeof data != 'undefined') {
      this.sb.appendBuffer(temp)
    }
    // if (this.timeSet == false && this.sb.buffered.length != 0) {
    //   // this.setTime();
    //   this.timeSet = true;
    // }
  }

  startStream() {

    this.showStreamerVideo = false
    this.connection.send('locked')

    navigator.mediaDevices.getUserMedia({ audio: {channelCount: 2,echoCancellation: false,noiseSuppression: false}, video: {facingMode : 'environment', frameRate : {ideal : 24}}  }).then(stream => {
        
      this.startStreamDisabled = true
      this.stopStreamDisabled = false

      this.streamerVideo.nativeElement.srcObject = stream

      this.mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 30 * 1000, videoBitsPerSecond : 300 * 1000, mimeType : 'video/webm; codecs="vp8, opus"' })
      
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.connection.send(event.data); 
      }

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach(x => x.stop())
        this.connection.send('unlocked')
        this.showStreamerVideo = false
        this.startStreamDisabled = false
        this.stopStreamDisabled = true
      };

      this.mediaRecorder.start(200);
      // this.connection.send(this.userData().username + ' recording')
    })

  }

  endStream() {
    this.mediaRecorder.stop()
  }

  setTime() {
    //set the time to the latest seekable time
    this.streamedVideo.nativeElement.currentTime = this.streamedVideo.nativeElement.seekable.end(0);
  
    //if the video is playing, then set a timeout for 10 seconds to update the stream,
    //if the video is paused, then set a timeout for one second to constantly update the stream
    if (this.streamedVideo.nativeElement.currentTime > 0 && !this.streamedVideo.nativeElement.paused && !this.streamedVideo.nativeElement.ended) {
      setTimeout(this.setTime, 10000);
    } else if (this.streamedVideo.nativeElement.paused) {
      setTimeout(this.setTime, 1000);
    }
  }

  ngOnDestroy(): void {
    this.connection.close()
  }
}

