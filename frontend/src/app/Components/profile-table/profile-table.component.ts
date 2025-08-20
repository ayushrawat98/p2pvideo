import {  Component, computed, input, ViewChild } from '@angular/core';
import { videoModel } from '../../Models/video.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { environment } from '../../../environments/environment';
import { UserService } from '../../Services/user.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-profile-table',
  standalone: true,
  imports: [MatTableModule, MatPaginator, DatePipe, MatSort],
  templateUrl: './profile-table.component.html',
  styleUrl: './profile-table.component.scss'
})
export class ProfileTableComponent {
  data = input<videoModel[]>()
  
  dataSource = computed(() => {
    let temp = new MatTableDataSource<videoModel>(this.data())
    temp.paginator = this.paginator
    return temp 
  })

  baseUrl = `${environment.baseUrl}/video/thumbnail/`

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _userService : UserService){}

  delete(id : string|number){
    this._userService.deleteVideoById(id).pipe(debounceTime(2000)).subscribe({
      next : (res) => {
        alert(res.message)
      },
      error : (res) => {
        console.log(res)
        alert(res.error.message)
      }
    })
  }

}
