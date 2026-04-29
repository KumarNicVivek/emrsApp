import { CanActivate,ActivatedRouteSnapshot,Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class permissionGuard implements CanActivate {
 
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as string;

    if(!requiredPermission){
      return true;
    }

    const hasPermission = this.authService.hasPermission(requiredPermission);
    if (!hasPermission) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
   
  }
  
}
