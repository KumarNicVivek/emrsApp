import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})

export class SessiontimerService {

  private warningTimeout: any;
  private tokenlogoutTimeout: any;
  private idleTimeout: any;

  private readonly IDLE_LMIT_TS = 15 * 60 * 1000; // 15 minutes

  constructor(private toastr: ToastrService) { }


  startSessionTimers(
      expirySeconds: number,
      onLogout: () => void
    ) : void {
    const tokenExpiryMs = expirySeconds * 1000;

    const idleLimit = Math.min(tokenExpiryMs, this.IDLE_LMIT_TS);

    this.clearTokenTimers();
    const warningMs = (tokenExpiryMs - 60) * 1000; // Warn 1 minute before expiry
    const logoutMs = expirySeconds * 1000;

    if(warningMs)
    {
      this.warningTimeout = setTimeout(() => {
        this.toastr.warning('Your session will expire in 1 minute. Please save your work.', 'Session Expiring');
      }, warningMs);
    }

    this.tokenlogoutTimeout = setTimeout(() => {
      this.toastr.info('Session Expired');
      this.clearTokenTimers();
      onLogout();
    }, tokenExpiryMs);

   
  }

// Starts idle timer to log out user after inactivity
  startIdleTimer(onLogout: () => void): void {

    const reset = () => this.resetIdleTimer(onLogout);

    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => window.addEventListener(event, reset));

    this.resetIdleTimer(onLogout);
  }

  // Resets idle timer on user activity
  resetIdleTimer(onLogout: () => void): void {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => {
      this.toastr.info('You have been logged out due to inactivity.');
      this.clearAllTimers();
      onLogout();
    }, this.IDLE_LMIT_TS);
    
  }


//Method to clear  all timers when user logs out or session expires
  clearTokenTimers(): void {
    clearTimeout(this.warningTimeout);
    clearTimeout(this.tokenlogoutTimeout);
    clearTimeout(this.idleTimeout);
  }

  clearAllTimers(): void {
    this.clearTokenTimers();
    clearTimeout(this.idleTimeout);
  }


}
