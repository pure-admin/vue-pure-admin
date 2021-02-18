import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectivePreloadingStrategyService } from '../CX/services/selective-preloading-strategy.service';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'page',
  },
  {
    path: 'page',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'login',
    canActivate: [AuthGuard],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: true,
        preloadingStrategy:  SelectivePreloadingStrategyService
      }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
