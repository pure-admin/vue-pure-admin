import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperMapGisRoutingModule } from './super-map-gis-routing.module';
import { SuperMapGisComponent } from './super-map-gis.component';


@NgModule({
  declarations: [SuperMapGisComponent],
  imports: [
    CommonModule,
    SuperMapGisRoutingModule
  ],
  exports: [SuperMapGisComponent]
})
export class SuperMapGisModule { }
