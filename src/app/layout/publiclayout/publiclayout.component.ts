import { Component,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { SignalrServiceService } from '../../Services/Utility/signalr-service.service';

@Component({
  selector: 'app-publiclayout',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './publiclayout.component.html',
  styleUrl: './publiclayout.component.css'
})
export class PubliclayoutComponent implements OnInit {

  private apiUrl = environment.candidateapibaseUrl + '/api/Visitor';
  totalVisitors: number = 0;

  constructor(private http: HttpClient,private signalRService: SignalrServiceService) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    
    //Using SignalR to listen for real-time updates
    this.signalRService.onVisitorUpdate((count: number) => {
      this.totalVisitors = count;
    });

    // Initial load of visitor count without SignalR
    this.loadVisitorCount();
  }
 
  trackVisitor() {
    const alreadyTracked = localStorage.getItem('visitorTracked');

    if (!alreadyTracked) {
      // ✅ First time → track + then load count
      this.http.get(`${this.apiUrl}/track`).subscribe({
        next: () => {
          localStorage.setItem('visitorTracked', 'true');
          this.loadVisitorCount(); // load after tracking
        },
        error: (err) => {
          console.error('Tracking error:', err);
          this.loadVisitorCount(); // fallback
        }
      });
    } else {
      // ✅ Already tracked → just get latest count
      this.loadVisitorCount();
    }
}


  loadVisitorCount(): void {
    this.http.get<{ totalVisitors: number }>(`${this.apiUrl}/count`)
      .subscribe({
        next: (response) => {
          this.totalVisitors = response.totalVisitors;
        },
        error: (error) => {
          console.error('Error fetching visitor count:', error);
        }
      });
  }

}
