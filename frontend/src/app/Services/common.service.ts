import { AbstractControl } from "@angular/forms"

export function noWhiteSpace(control: AbstractControl) {
    if (control && control.value.trim() == "") {
        return { required: true }
    } else {
        return null
    }
}

export function alphaNumbericOnly(control : AbstractControl){
      // Regex to allow alphanumeric characters and spaces
      const regex = /^[a-zA-Z0-9-_]*$/;
      const isValid = regex.test(control.value);
    console.log(isValid)
      return isValid ? null : { 'alphanumericSpace': true }; // Return an error if invalid
}