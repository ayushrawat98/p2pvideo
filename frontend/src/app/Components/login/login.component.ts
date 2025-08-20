import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { AuthenticateService } from '../../Services/authenticate.service';
import { authenticateBody } from '../../Models/authenticate.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { alphaNumbericOnly, noWhiteSpace } from '../../Services/common.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { debounceTime } from 'rxjs';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [MatFormField, MatLabel, MatError, MatInput, MatButton, ReactiveFormsModule, MatTab, MatTabGroup],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {

	constructor(private _authenticate: AuthenticateService,
		 private _matSnackBar: MatSnackBar,
		  private _router: Router,
		  private _bottomSheetRef : MatBottomSheetRef<LoginComponent>,
	) { }

	loginform = new FormGroup({
		username: new FormControl('', [Validators.required]),
		password: new FormControl('', [Validators.required])
	})

	login() {

		let body: authenticateBody = {
			username: this.loginform.controls.username.value ?? '',
			password: this.loginform.controls.password.value ?? ''
		}

		this._authenticate.login(body).pipe(debounceTime(1500)).subscribe({
			next: (response) => {
				this._authenticate.setUserKey(response.message)
				this._bottomSheetRef.dismiss('logged in')
				this._matSnackBar.open("logged in", "OK", { duration: 2000 })
			},
			error: (error) => {
				this._matSnackBar.open(error.error.message, "OK", { duration: 2000 })
			}
		})
	}


	//REGISTER FORM STARTS

	registerform = new FormGroup({
		username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(16), alphaNumbericOnly] }),
		password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(16), alphaNumbericOnly] }),
		repeatpassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(16), alphaNumbericOnly] })
	}, { validators: this.doPasswordMatch })

	doPasswordMatch(control: AbstractControl): ValidationErrors | null {
		let form = control as FormGroup
		return form.get('password')?.value == form.get('repeatpassword')?.value ? null : { 'dontmatch': true }

	}

	matcher = new MyErrorStateMatcher()

	register() {
		let body: authenticateBody = {
			username: this.registerform.controls.username.value,
			password: this.registerform.controls.password.value
		}

		this._authenticate.register(body).subscribe({
			next: (response) => {
				this._authenticate.setUserKey(response.token)
				this._bottomSheetRef.dismiss('logged in')
				this._matSnackBar.open(response.message, "OK", { duration: 3000 })
			},
			error: (error) => {
				this._matSnackBar.open(error.error.message, "OK", { duration: 2000 })
			}
		})
	}
}

class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const formhaserror = form && form.hasError('dontmatch')
		return !!(((control && control.invalid) || formhaserror) && (control && (control.dirty || control.touched)));
	}

}
