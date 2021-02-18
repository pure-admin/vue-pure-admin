import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DisabledDirective } from './disabled.directive';

@NgModule({
  declarations: [DisabledDirective],
  imports: [
    CommonModule,
  ],
  exports: [DisabledDirective]
})
export class DirectivesModule { }
