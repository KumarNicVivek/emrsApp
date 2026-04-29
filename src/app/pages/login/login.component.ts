import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  // captchaImageUrl: string = '';
  // baseSalt: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  error = '' ;

  captchaImageUrl: string = '';
  captchaKey: string = '';
  

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(20)
      ]],
      captchaInput: ['', Validators.required]
    });

    this.loadCaptcha();
    
  }  

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill all required fields');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const formValue = { ...this.loginForm.value };   
    
    const payload = {
      username: formValue.email,  
      captchaInput: formValue.captchaInput,
      captchaKey: this.captchaKey
    };


    this.authService.login(formValue).subscribe({
      next: (res) => {
        this.isLoading = false;

        console.log('🔑 Permissions from API:', res.permission);
        this.authService.setLogindata(res);
        
        //Start session timer after successful login
        this.authService.startSessionTimerFromToken();

        //this.toastr.success('Login successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.userMessage || 'Invalid Login. Please try again.';
        this.toastr.error(this.error);
        //this.refreshCaptcha();
        
      }
    });
  }

  loadCaptcha() {
    this.authService.refreshCaptcha().subscribe((res: any) => {
      this.captchaImageUrl = res.imageUrl;
      this.captchaKey = res.captchaKey;
    });
  }

  refreshCaptcha() {
    this.loadCaptcha();
  }

   togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}