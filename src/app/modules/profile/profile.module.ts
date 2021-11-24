import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { profilesRoutes } from './profile.routing';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(profilesRoutes),
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ]
})
export class ProfileModule { }


