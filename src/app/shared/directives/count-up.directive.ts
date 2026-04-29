import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit {

  constructor(private el: ElementRef) { }

  @Input() count!: number;

  ngOnInit(): void {
    this.animate();
  }

  animate() {
    let start = 0;
    const duration = 1200;
    const increment = this.count / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= this.count) {
        this.el.nativeElement.innerText = this.count.toLocaleString();
        clearInterval(counter);
      } else {
        this.el.nativeElement.innerText = Math.floor(start).toLocaleString();
      }
    }, 16);

  }

}
