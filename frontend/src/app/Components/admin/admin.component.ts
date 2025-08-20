import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { RouterLink } from '@angular/router';
import { LivechatComponent } from "../livechat/livechat.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, LivechatComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  reportList! : any[]
  constructor(private _adminService : AdminService){}

  ngOnInit(){
    this.getReport()
  }

  deleteuser(id : number | string){
    this._adminService.deleteUserById(id).subscribe(
      (response)=>{
        alert('deleted')
      },
      (error)=>{
        alert(error)
      }
    )
  }
  deletevideo(id : number | string){
    this._adminService.deleteVideoById(id).subscribe(
      (response)=>{
        alert('deleted')
      }
    )
  }

  deletecomment(id : number | string){
    this._adminService.deleteCommentById(id).subscribe(
      (response)=>{
        alert('deleted')
      }
    )
  }

  getReport(){
    this._adminService.getAllReportedVideos().subscribe(
      (response) => {
        this.reportList = response
      }
    )
  }

}
