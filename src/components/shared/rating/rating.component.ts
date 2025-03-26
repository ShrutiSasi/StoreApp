import { Component, computed, Input} from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  
})
export class RatingComponent{
  @Input() rating: number = 0;
  stars = computed(() => {
    const fullstars: number = Math.floor(this.rating);
    const halfstar = (this.rating % fullstars >= 0.5) ? 1 : 0;
    const emptystars = 5 - fullstars - (halfstar ? 1 : 0);
    return { fullstars: Array(fullstars).fill(0), halfstar, emptystars: Array(emptystars).fill(0) };
  });
}
