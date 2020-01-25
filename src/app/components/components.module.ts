import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimelineComponent } from './timeline/timeline.component';
import { KeyboardNavModule } from '../keyboard-nav/keyboard-nav.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    KeyboardNavModule
  ],
  declarations: [
    TimelineComponent
  ],
  exports: [
    TimelineComponent
  ]
})
export class ComponentsModule { }
