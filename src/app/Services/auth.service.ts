import { Injectable } from '@angular/core';   
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import {jwtDecode} from "jwt-decode";
import { Router } from '@angular/router';
import { catchError,throwError,switchMap } from 'rxjs'; 
import CryptJs from 'crypto-js';
import { SessiontimerService } from './sessiontimer.service';
import { environment } from '../../environments/environment';
import { LoginUserViewModel } from '../models/login-user-view-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.authbaseUrl + '/api/auth';

  private warningTimeout: any;
  private logoutTimeout: any;

  private permissions : string[] = []; // Store user permissions

  constructor(private http : HttpClient, private sessionTimerService: SessiontimerService,private router: Router) { }



  setLogindata(response: any) : void {
    const token = response.token;
    const role = response.role; 
    
    // const decodedToken: any = jwtDecode(token);
    // const expirySeconds = decodedToken.exp - Math.floor(Date.now() / 1000);

    localStorage.setItem('token', token);
    localStorage.setItem('role', role); 

    localStorage.setItem('permissions', JSON.stringify(response.permissions || [])); // Store permissions in localStorage

    this.permissions = response.permissions || []; // Update permissions in service

    console.log('Permissions set:', this.permissions);
  }

  // Method for has Permission
  hasPermission(permission: string): boolean {
    if (this.permissions.length === 0) {
      const storedPermissions = localStorage.getItem('permissions');
      this.permissions = storedPermissions ? JSON.parse(storedPermissions) : [];
    }
    return this.permissions.includes(permission);
  }

  login(request: LoginUserViewModel) {
      const { email: username, password, captchaInput } = request;

    return this.getLoginNonce(username).pipe(
      switchMap((nonceresponse: any) => {
        const nonce = nonceresponse.nonce;
        const hashedPassword = this.hashPassword(password, nonce);

        return this.http.post<any>(`${this.apiUrl}/login`, { username, password: hashedPassword });
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Unable to login. Please try again.';

        if (error.status === 401) {
          errorMessage = 'Invalid username or password. Please check your credentials and try again.';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your network connection and try again.';
        }
        else if (error.status === 400) {
            errorMessage = error.error?.message || 'Invalid request.';
          }
          else if (error.status === 500) {
            errorMessage = 'Internal server error. Try again later.';
          }
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please check your credentials and try again.'));
      })
    );

  }

  getLoginNonce(userName: string ) {
    return this.http.get<{ nonce: string }>(`${this.apiUrl}/nonce?username=${encodeURIComponent(userName)}`);
  }

  private hashPassword(password: string, nonce: string): string {
    debugger;
    // Implement a hashing function here, e.g., using SHA-256
    const pwdhash = CryptoJS.SHA512(password) ; //
    const hashNonce = CryptoJS.SHA512(nonce);

    // Combine the hashed password and hashed nonce
    const combined = pwdhash.clone().concat(hashNonce);
    
    const finalHash = CryptoJS.SHA512(combined).toString(CryptoJS.enc.Hex);


    return finalHash;

  }

  saveAuth(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  logout() : void {

    //For Multi Tab Logout Synchronization
    localStorage.setItem('logout-event', Date.now().toString());

    localStorage.clear();

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions'); // Clear permissions on logout

    this.permissions = []; // Clear permissions in service
    this.sessionTimerService.clearAllTimers(); // Clear session timers on logout
    this.router.navigate(['/login']);
  }

  clearTimers() : void {
      if (this.warningTimeout) {
        clearTimeout(this.warningTimeout);
      }

      if (this.logoutTimeout) {
        clearTimeout(this.logoutTimeout);
      }
    }
  

    isLoggedIn() : boolean{
    const token = this.getToken();

    if(!token) {
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      if (decodedToken.exp && decodedToken.exp < currentTime) {

        return false; // Token has expired
      }
     // Token is valid
    }
    catch (error) {
      return false;
    }

     return true; 
  }

  getRole():string | null {
    return localStorage.getItem('role');
  }

  getToken(): string | null {  
    return localStorage.getItem('token');
  }

  getTokenExpirationTime(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp ? decodedToken.exp * 1000 : null; // convert to milliseconds
    }
    catch (error) {
      return null;
    }
  }

  startSessionTimerFromToken(): void {
    const token = this.getToken();
    if (!token || !token.includes('.'))
      {
        console.log('No valid token found. Timer not started.');
        return;
      } 

    const decoded: any = jwtDecode(token);
    if (!decoded.exp)
    {
      console.log('Token has no exp field.');
      return;
    } 

    const remainingSeconds = Math.floor(decoded.exp - (Date.now() / 1000));

      // console.log('JWT Exp (unix):', decoded.exp);
      // console.log('Current time (unix):', Math.floor(Date.now() / 1000));
      // console.log('Remaining session seconds:', remainingSeconds);
      // console.log('Session will expire at:', new Date(decoded.exp * 1000));
    

    if (remainingSeconds <= 0) {
      //console.log('Token already expired → logging out');
      this.logout();
      return;
    }
    //console.log('Starting session timer...');

    // 🔥 Pass logout on toke expiry callback
    this.sessionTimerService.startSessionTimers(
      remainingSeconds,
      () => {
        console.log('Token expired → logging out');
        this.logout();
      } 
    );


  }


  refreshCaptcha() {
    //alert('Captcha refresh triggered : ' + this.apiUrl);
    return this.http.get<any>(
      this.apiUrl +'/refreshCaptcha'
    );
  }
  // getLoginNonce(username: string) {
  //   return this.http.get<any>(`${this.apiUrl}/login-nonce`,
  //     { params: {username}}
  //   );
  // }



}
