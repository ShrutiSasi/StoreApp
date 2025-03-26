import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scrollup',
  templateUrl: './scrollup.component.html',
  styleUrls: ['./scrollup.component.css']
})
export class ScrollupComponent{
  showButton = false;
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showButton = window.scrollY > 600; // Show after scrolling 600px
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
