import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';

const usersRoutes: Route[] = [
  {
    path: '',
    component: UsersComponent
  }
]

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    RouterModule.forChild(usersRoutes),
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class UsersModule { }
