import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './Services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'EMRS APPLICATON';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout-event' ) {
        // Token has been removed, redirect to login page
       this.authService.logout();
      } else if (event.key === 'token' && !event.newValue ) {
        // Token has been added or updated, you can handle it if needed
        console.log('Token updated:', event.newValue);
        this.authService.logout(); // Optionally, you can log out the user if the token is updated or removed
      }
    });

  }
}
