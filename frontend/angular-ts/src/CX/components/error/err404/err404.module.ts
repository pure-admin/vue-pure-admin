import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Err404Component } from './err404.component';



@NgModule({
  declarations: [Err404Component],
  imports: [
    CommonModule
  ],
  exports: [Err404Component]
})
export class Err404Module { }
