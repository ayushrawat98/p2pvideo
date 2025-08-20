import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticateService } from './Services/authenticate.service';
import { jwtData } from './Models/jwt.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet'
import { UploadComponent } from './Components/upload/upload.component';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { MatBadge } from '@angular/material/badge';
import { UserService } from './Services/user.service';  
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { DatePipe, NgClass } from '@angular/common';
import { NotificationModel } from './Models/notification.model';
import { LoginComponent } from './Components/login/login.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatMenu, MatBadge, MatMenuItem, MatPaginator, NgClass, DatePipe, MatMenuTrigger, MatFormField, MatLabel, MatInputModule, MatIconButton, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'bharatube';

  loggedIn = computed(() => {
    return this._authenticateService.user_key().length > 0
  })

  user_data!: Signal<jwtData>

  notificationData : {
    count : number,
    rows : NotificationModel[]
  } = {count : 0 , rows : []}
  notReadNotification = 0
  

  constructor(
    private _authenticateService: AuthenticateService,
    private _matBottomSheet: MatBottomSheet,
    private _userService: UserService,
    private router : Router
  ) {
    this.user_data = this._authenticateService.user_data
  }

  ngOnInit() {
    this.reloginUser()
    //check notification every 30 second if the user is loggedin
    this.loggedIn() ? this.getNotifications() : undefined
    setInterval(() => {if(this.loggedIn()){this.getNotifications()}}, 60000)
  }

  //login user if his jwt token is still valid
  reloginUser() {
    let key = localStorage.getItem('key')
    let jwtpayload: JwtPayload | null = null
    if (key) {
      jwtpayload = jwtDecode(key)
    }
    if (key && jwtpayload && jwtpayload.exp && Date.now() < jwtpayload?.exp * 1000) {
      this._authenticateService.setUserKey(key)
    }
  }

  logout() {
    this._authenticateService.resetUserKey()
  }

  showBottomUpload() {
    this._matBottomSheet.open(UploadComponent)
  }

  showBottomLoginRegister(){
    this._matBottomSheet.open(LoginComponent)
  }

  notificationPageNumber = 0
  goToPage(event: PageEvent) {
    this.notificationPageNumber = event.pageIndex
  }

  getNotifications() {
    this._userService.getNotifications(this.notificationPageNumber).pipe().subscribe(
      (response) => {
        this.notificationData = response
        this.notReadNotification = this.notificationData.rows.filter((x:any) => x.viewed == false).length
      }
    )
  }


  markAsReadNotification() {
    this.notReadNotification = 0
    this._userService.markAsReadNotification().subscribe({
      next: (res) => {

      },
      error: (res) => {

      }
    })
  }

  enterPressed(value : string){
    this.router.navigateByUrl('/search/'+value)
  }

}


