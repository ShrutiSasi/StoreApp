import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent{
  @Input() message: string = 'Alert!';
  @ViewChild('alertBox') alertBox!: ElementRef;
  @ViewChild('backDrop') backDrop!: ElementRef;
  constructor(private renderer: Renderer2) {}

  openModal(){
    const fadeScreen = this.backDrop.nativeElement;
    this.renderer.addClass(fadeScreen, 'modal-backdrop');
    this.renderer.addClass(fadeScreen, 'fade'); 
    this.renderer.addClass(fadeScreen, 'show'); 
    const modal = this.alertBox.nativeElement;
    this.renderer.setStyle(modal, 'display', 'block');
    this.renderer.addClass(modal, 'show');      
  }
  closeModal(){
    const fadeScreen = this.backDrop.nativeElement;
    this.renderer.removeClass(fadeScreen, 'modal-backdrop');
    this.renderer.removeClass(fadeScreen, 'fade');  
    this.renderer.removeClass(fadeScreen, 'show');
    const modal = this.alertBox.nativeElement;
    this.renderer.setStyle(modal, 'display', 'none');
    this.renderer.removeClass(modal, 'show');       
  }
}
