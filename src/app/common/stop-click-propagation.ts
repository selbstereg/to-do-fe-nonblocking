import {Directive, HostListener} from '@angular/core';

@Directive({
    selector: '[stopMouseEventPropagation]'
})
export class StopMouseEventPropagationDirective {
    @HostListener('click', ['$event'])
    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    @HostListener('mouseup', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('mousemove', ['$event'])
    @HostListener('touchmove', ['$event'])
    public onClick(event: any): void {
        event.stopPropagation();
    }
}
