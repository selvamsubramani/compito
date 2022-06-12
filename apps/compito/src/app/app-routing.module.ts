import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
// import { AuthGuard } from '@auth0/auth0-angular';
import { MsalGuard } from '@azure/msal-angular';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./landing/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'app',
    canActivateChild: [MsalGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('@compito/web/auth').then((m) => m.WebAuthModule),
  },
  {
    path: '**',
    redirectTo: 'app',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation:'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
