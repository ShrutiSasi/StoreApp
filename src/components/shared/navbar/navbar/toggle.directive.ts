import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appToggle]'
})
export class ToggleDirective {
  @Input('target') dropdownTarget: string = '';
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') toggleDropdown(){
    const target = document.querySelector(this.dropdownTarget);
    console.log(target);
    if(target){
      if(target.classList.contains('show')){
        this.renderer.removeClass(target, 'show');
        this.renderer.addClass(this.el.nativeElement, 'collapsed');
      }else{
        this.renderer.addClass(target,'show');
        this.renderer.removeClass(this.el.nativeElement, 'collapsed');
      }
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event){
    if(!this.el.nativeElement.contains(event.target)){
      const target = document.querySelector(this.dropdownTarget);
      if(target){
        this.renderer.removeClass(target, 'show');
        this.renderer.addClass(this.el.nativeElement, 'collapsed');
      }
    }
  }
}
