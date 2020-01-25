import { NgModule } from '@angular/core';

import { KeyboardNavItemDirective } from './keyboard-nav-item/keyboard-nav-item.directive';
import { KeyboardNavDirective } from './keyboard-nav/keyboard-nav.directive';

@NgModule({
  declarations: [
    KeyboardNavDirective,
    KeyboardNavItemDirective
  ],
  exports: [
    KeyboardNavDirective,
    KeyboardNavItemDirective
  ]
})
export class KeyboardNavModule { }
