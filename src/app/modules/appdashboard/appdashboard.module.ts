import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppdashboardComponent } from './appdashboard.component';
import { appdashboardRoutes } from './appdashboard.routing';
import { FuseCardModule } from '@fuse/components/card';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AddlistComponent } from './addlist/addlist.component';
import { AddfeatureComponent } from './addfeature/addfeature.component';



@NgModule({
  declarations: [
    AppdashboardComponent,
    AddlistComponent,
    AddfeatureComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appdashboardRoutes),
    FuseCardModule,
    FuseAlertModule,
    SharedModule

  ]
})
export class AppdashboardModule { }
