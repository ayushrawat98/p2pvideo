import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UploadfileService } from '../../Services/uploadfile.service';
import { UserService } from '../../Services/user.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  searchString! : string
  namelist! : {id : number, username : string}[]
  videolist! : {id : number, title : string}[]
  baseUrl = environment.baseUrl

  constructor(private route : ActivatedRoute,
    private _userService: UserService,
    private _uploadService : UploadfileService
  ){}

  ngOnInit(){
    this.route.paramMap.subscribe(
      (response) => {
        this.searchString = response.get('searchString')?.trim() as string
        if(this.searchString.length != 0){
          this.search(this.searchString)
        }
      }
    )
  }

  search(name : string){
    this._userService.searchUser(name).subscribe({
      next : (res) => {
        this.namelist = res
      },
      error : (err) => {
        console.log(err)
      }
    })

    this._uploadService.searchVideo(name).subscribe(
      (res) => {
        this.videolist = res
      }
    )
    
  }


}
