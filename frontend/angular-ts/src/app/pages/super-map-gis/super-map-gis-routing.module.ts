import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperMapGisComponent } from './super-map-gis.component'

const routes: Routes = [
  {
    path: '',
    component: SuperMapGisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperMapGisRoutingModule { }
