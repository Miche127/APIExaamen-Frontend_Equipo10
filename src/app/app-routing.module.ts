import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogComponent } from './log/log.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [

  { path: '', redirectTo: '/log', pathMatch: 'full' },
  { path: 'log', component: LogComponent },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
