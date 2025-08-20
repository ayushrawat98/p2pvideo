import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { VideothumbnailComponent } from '../videothumbnail/videothumbnail.component';
import { videoModel } from '../../Models/video.model';
import { SortPipe } from '../../Pipes/sort.pipe';

@Component({
  selector: 'app-videolist',
  standalone: true,
  imports: [VideothumbnailComponent, SortPipe],
  templateUrl: './videolist.component.html',
  styleUrl: './videolist.component.scss',
  
})
export class VideolistComponent implements OnInit{
  
  videoList = input.required<videoModel[]>()
  sortAllowed = input.required<boolean>()
  latestFirst = input.required<boolean>()

  ngOnInit(): void {
    
  }
  
}
