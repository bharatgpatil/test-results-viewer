import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[jlKeyboardNavItem]'
})
export class KeyboardNavItemDirective {
  constructor(
    private elementRef: ElementRef
  ) { }

  /**
   * Host native element.
   */
  public element: HTMLElement = this.elementRef.nativeElement;
}
