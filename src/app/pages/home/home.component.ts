import { Component,AfterViewInit, ElementRef, ViewChild  } from '@angular/core';
import { CountUpDirective } from '../../shared/directives/count-up.directive';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CountUpDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  // @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  // @ViewChild('list') list!: ElementRef;
@ViewChild('track') track!: ElementRef;
  scrollPos = 0;
  speed = 0.3; // Adjust this value to increase/decrease the speed of scrolling
  paused = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
  const el = this.track.nativeElement;

  // clone content dynamically (no manual duplicate)
  el.innerHTML += el.innerHTML;
}
  
// ngAfterViewInit() {

//   const container = document.getElementById("newsContainer") as HTMLElement;
//   const list = document.getElementById("whatsNewList") as HTMLElement;

//   if (!container || !list) return;

//   let scrollPos = 0;
//   let buffer = 0;        // 🔥 key for smoothness
//   const speed = 0.4;
//   let paused = false;

//   const smoothScroll = () => {

//     if (!paused) {

//       buffer += speed;

//       if (buffer >= 1) {
//         const move = Math.floor(buffer);
//         scrollPos += move;
//         buffer -= move;

//         container.scrollTop = scrollPos;
//       }

//       if (scrollPos >= list.scrollHeight - container.clientHeight) {
//         scrollPos = 0;
//         container.scrollTop = 0;
//         buffer = 0;   // reset buffer
//       }
//     }

//     requestAnimationFrame(smoothScroll);
//   };

//   container.addEventListener("mouseenter", () => paused = true);
//   container.addEventListener("mouseleave", () => paused = false);

//   smoothScroll();
// }

  // ngAfterViewInit() {
  //   // Your initialization code here
  //   const container = this.scrollContainer.nativeElement;

  //   if (!container) {
  //   console.log('Container not found ❌');
  //   return;
  // }

  // console.log('Scroll started ✅');
  //   const list = this.list.nativeElement;

  //   // pause on hover
  //   container.addEventListener('mouseenter', () => this.paused = true);
  //   container.addEventListener('mouseleave', () => this.paused = false);

  //   const step = () => {
  //     if (!this.paused) {
  //       this.scrollPos += this.speed;
  //       container.scrollTop = this.scrollPos;

  //       if (this.scrollPos >= list.scrollHeight - container.clientHeight) {
  //         this.scrollPos = 0;
  //         container.scrollTop = 0;
  //       }
  //     }

  //     requestAnimationFrame(step);
  //   };

  //   requestAnimationFrame(step);
    
  // }


}
