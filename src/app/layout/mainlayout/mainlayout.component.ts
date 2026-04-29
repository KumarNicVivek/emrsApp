import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from "../../shared/directives/has-permission.directive";
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-mainlayout',
  standalone: true,  
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.css',
  imports: [RouterOutlet, HasPermissionDirective]
})
export class MainlayoutComponent {

  isCollapsed = false;
  emrsMenuOpen = false;

  constructor(public authService: AuthService) { }

  logout(event?: Event) : void {
    if (event) {
      event.preventDefault();
    }

    this.authService.logout();
  }

  toggleFraMenu(){
    this.emrsMenuOpen = !this.emrsMenuOpen;
  }  

  toggleSidebar(){
    this.isCollapsed = !this.isCollapsed;
  }
}
