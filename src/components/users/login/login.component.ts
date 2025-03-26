import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent{
  //Template Driven Forms
  @ViewChild('formRef') formEl!: NgForm;
  authService = inject(AuthService);
  router = inject(Router);
  @Input('title') pageTitle: string = '/';
  errorMessage = '';
  
  get userEmailEmpty(){
    const userEmailControl = this.formEl?.controls['userEmail'];
    return !userEmailControl?.value && userEmailControl?.touched;
  }
  get userEmailValid(){
    const userEmailControl = this.formEl?.controls['userEmail'];
    return userEmailControl?.value && !userEmailControl?.valid;
  }
  get passwordEmpty(){
    const passwordControl = this.formEl?.controls['userPassword'];
    return !passwordControl?.value && passwordControl?.touched;
  }
  // get passwordPatternValid(){
  //   const passwordControl = this.formEl?.controls['userPassword'];
  //   return passwordControl?.value && !passwordControl?.valid && passwordControl?.errors && passwordControl?.errors['pattern'];
  // }
  get passwordLengthValid(){
    const passwordControl = this.formEl?.controls['userPassword'];
    return passwordControl?.value && !passwordControl?.valid && passwordControl?.errors && passwordControl?.errors['minlength'];
  }
  
  onLogin(){         
    this.authService.login(this.formEl.controls['userEmail'].value, this.formEl.controls['userPassword'].value).subscribe((isValid) =>{
      if(isValid){
        //localStorage.setItem('userEmail', JSON.stringify(this.formEl.controls['userEmail'].value));
        this.router.navigate(['/'+this.pageTitle]);
      }else{
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
