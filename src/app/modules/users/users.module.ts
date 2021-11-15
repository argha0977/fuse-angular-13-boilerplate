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

@NgModule({
  declarations: [
    UsersComponent,
    UsersidebarComponent,
    UserlistComponent,
    AdduserformComponent
  ],
  imports: [
    RouterModule.forChild(usersRoutes),
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class UsersModule { }
