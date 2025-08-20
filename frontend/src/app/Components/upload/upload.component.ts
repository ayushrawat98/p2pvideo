import { Component, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button'
import { MatSnackBar } from '@angular/material/snack-bar'
import { UploadfileService } from '../../Services/uploadfile.service';
import { MatProgressBar } from '@angular/material/progress-bar'
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field'
import { MatInput } from '@angular/material/input'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { uploadBody } from '../../Models/upload.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { noWhiteSpace } from '../../Services/common.service';
import { AuthenticateService } from '../../Services/authenticate.service';
import { LoginComponent } from '../login/login.component';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatButton, MatProgressBar, MatInput, MatFormField, MatLabel, ReactiveFormsModule, MatError, MatHint ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {

  constructor(
    private _snackBar: MatSnackBar,
    private _uploadFile: UploadfileService,
    private _bottomSheetRef : MatBottomSheetRef<UploadComponent>,
    private _matBottomSheet: MatBottomSheet,
    private _authenticate : AuthenticateService
  ) {}

  allowedsize: number = 100 * 1024 * 1024 //in byte , 100 MB
  filename = ''
  allvideos!: any[]
  selectedfile!: FileList
  uploadProgress = 0
  loggedIn! : Signal<Boolean>;
  showGuidelines = false
  detailsform = new FormGroup({
    title: new FormControl('', {nonNullable : true, validators : [Validators.required, Validators.maxLength(200), noWhiteSpace]}),
    description: new FormControl('')
  })
  uploadButtonEnabled = false

  ngOnInit() {
    this.loggedIn = this._authenticate.loggedIn
  }

  setFile(event: Event) {
    let inputevent = event.target as HTMLInputElement
    let file = inputevent.files as FileList
    if (file[0] && file[0].size > this.allowedsize) {
      this.showSnackBar("Max allowed size is 100 MB", "OK", 2000)
    } else {
      this.selectedfile = file
      // inputevent.value = ''
    }
  }

  

  uploadFile() {
    this.uploadButtonEnabled = false
    let body : uploadBody = {
      title : this.detailsform.controls.title.value.trim(),
      description : this.detailsform.controls.description.value ?? '',
      file : this.selectedfile,
    }
    let value = this._uploadFile.uploadFile(body)
    value.pipe(debounceTime(750)).subscribe(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if (event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          }
          break;

        case HttpEventType.Response:
          if (event instanceof HttpResponse) {
            this.showSnackBar("Upload success", "OK", 2000)
            this.uploadProgress = 0
            this._bottomSheetRef.dismiss('done')
            this._uploadFile.fileUploaded.next('update')
            this.uploadButtonEnabled = true
          }
          break;
      }
    },
    (err) => {this.uploadButtonEnabled = true},
    () => {this.uploadButtonEnabled = true}
  )
  }

  showSnackBar(message: string, dismissbuttontext: string, duration: number) {
    this._snackBar.open(message, dismissbuttontext, {
      duration: duration
    })
  }

  close(){
    this._bottomSheetRef.dismiss()
    this._matBottomSheet.open(LoginComponent)
  }
}
