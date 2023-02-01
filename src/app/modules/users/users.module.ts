import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { usersRoutes } from './users.routing';
import { UsersidebarComponent } from './usersidebar/usersidebar.component';
import { UserlistComponent } from './userlist/userlist.component';
import { AdduserformComponent } from './adduserform/adduserform.component';
import { UserErrorComponent } from './user-error/user-error.component';
// import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    UsersComponent,
    UsersidebarComponent,
    UserlistComponent,
    AdduserformComponent,
    UserErrorComponent
  ],
  imports: [
    // CommonModule,
    RouterModule.forChild(usersRoutes),
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class UsersModule { }

