import { ContentChildren,
  Directive,
  HostListener,
  QueryList,
} from '@angular/core';

import { KeyboardNavItemDirective } from '../keyboard-nav-item/keyboard-nav-item.directive';
import {TimelineComponent} from "../../components/timeline/timeline.component";


@Directive({
  selector: '[jlKeyboardNav]'
})
export class KeyboardNavDirective {

  constructor(private timeline: TimelineComponent ) { }

  /**
   * Keyboard nav items.
   */
  @ContentChildren(KeyboardNavItemDirective, { descendants: true })
  public items: QueryList<KeyboardNavItemDirective>;

  /**
  * Set focus to next/previous element.
  *
  * @param event Keyboard event.
  */
  @HostListener('keydown.ArrowLeft', ['$event'])
  @HostListener('keydown.ArrowRight', ['$event'])
  private nav(event: KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.items.length) {
      return;
    }

    const items: KeyboardNavItemDirective[] = this.items.toArray();
    const step: number = (event.code === 'ArrowLeft') ? -1 : 1;
    let active: number;
    let i: number = this.items.length;

    while (i--) {
      if (items[i].element === document.activeElement) {
        active = i;
        break;
      }
    }

    if (active === undefined) {
      items[0].element.focus();
      return;
    }

    const target: KeyboardNavItemDirective = items[active + step];

    if (target) {
      target.element.focus();
      let attributes = target.element.attributes;
      let id = attributes['data-action-id'];
      this.timeline.sendActionId(event, parseInt(id.value));
      console.log(parseInt(id.value));
    }
  }
}
