import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { usersRoutes } from './users.routing';

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
