import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { AuthUnlockSessionComponent } from 'app/modules/auth/unlock-session/unlock-session.component';
import { authUnlockSessionRoutes } from 'app/modules/auth/unlock-session/unlock-session.routing';

@NgModule({
    declarations: [
        AuthUnlockSessionComponent
    ],
    imports     : [
        RouterModule.forChild(authUnlockSessionRoutes),
        FuseCardModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class AuthUnlockSessionModule
{
}
