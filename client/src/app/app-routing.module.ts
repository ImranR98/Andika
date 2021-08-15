import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './about/about.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArchivedComponent } from './archived/archived.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'account',
    component: DashboardComponent,
    canActivate: [UserService]
  },
  {
    path: 'archived',
    component: ArchivedComponent,
    canActivate: [UserService]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
