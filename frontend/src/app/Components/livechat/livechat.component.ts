import { Component, computed, effect, OnDestroy, OnInit, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthenticateService } from '../../Services/authenticate.service';
import { jwtData } from '../../Models/jwt.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-livechat',
  standalone: true,
  imports: [MatButtonModule, MatChipSet, MatChip, MatInput, MatFormField, MatLabel],
  templateUrl: './livechat.component.html',
  styleUrl: './livechat.component.scss',
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
export class LivechatComponent implements OnInit, OnDestroy {

  mediaRecorder!: MediaRecorder
  audioChunks: Blob[] = []
  connection!: WebSocket
  sendAudioDisabled = true
  stopAudioDisabled = true
  loggedIn: Signal<boolean>;
  userData: Signal<jwtData>;
  allUsers : string[] = []

  constructor(private _authenticateService: AuthenticateService, private _matSnackBar : MatSnackBar) {
    this.loggedIn = this._authenticateService.loggedIn
    this.userData = this._authenticateService.user_data

    effect(() => {
      if (this.loggedIn() && (!this.connection || this.connection.CLOSED)) {
        this.connect()
      }
      if(!this.loggedIn() && this.connection){
        console.log('computed close')
        this.connection.close()
      }
    })
  }

  ngOnInit(): void {
    
  }

  connect() {
    
    const serverUrl = environment.wsAudioBaseUrl
    this.connection = new WebSocket(serverUrl);

    this.connection.onopen = () => {
      console.log('connection open', this.connection.readyState)
      this.sendAudioDisabled = false
      // while(this.connection.readyState == 0){}
      if(this.connection.readyState == 1){
        this.connection.send(this.userData().username)
      }
    };

    this.connection.onmessage = (event) => {
      if(typeof event.data == 'string'){
        this.playThatText(event.data)
      }else{
        this.playThatSong(event.data)
      }
    };


    this.connection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.connection.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendAudio() {

    navigator.mediaDevices.getUserMedia({ audio: {channelCount: 2,echoCancellation: false,noiseSuppression: false}, video: false }).then(stream => {

      this.sendAudioDisabled = true
      this.stopAudioDisabled = false

      this.mediaRecorder = new MediaRecorder(stream, { audioBitsPerSecond: 30000 })

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.audioChunks.push(event.data)
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg' });
        this.audioChunks = []; // Reset the chunks for the next recording
        this.connection.send(audioBlob);
        stream.getTracks().forEach(x => x.stop())
      };

      this.mediaRecorder.start(100);
      this.connection.send(this.userData().username +' recording')
    })

  }

  stopAudio() {
    this.sendAudioDisabled = false
    this.stopAudioDisabled = true
    this.connection.send(this.userData().username)
    this.mediaRecorder.stop()
  }

  playThatSong(audioBlob : Blob){
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.muted = true
      audio.play()
      audio.muted = false
  }

  usertext :string[] = []
  playThatText(message : any){
     if(message.includes("T9")){
        this.checkLength()
        this.usertext.unshift(message.split("T9")[1])
      }else{
      this.allUsers = message.split(',')
      }
  }

  sendText(message : string){
    this.checkLength()
    this.usertext.unshift(`@${this.userData().username} : ${message.trim()}`)
    this.connection.send(`T9${message.trim()}`)
  }

  checkLength(){
    this.usertext.length == 15 ? this.usertext.pop() : undefined
  }

  ngOnDestroy(): void {
    this.connection.close()
  }
}


/*
-video stream like code doesn't work when there are multiple people
-sending blob and receiving it also doesnt work.
*/