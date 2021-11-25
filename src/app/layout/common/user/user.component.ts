import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
/* import { UserService } from 'app/core/user/user.service'; */
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { signin } from 'app/store/actions/user.actions';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    //user: User;

    //user: User;
    user = {
        firstname: '',
        lastname: '',
        imageUrl: '',
        email: '',
        role: '',
        status: ''
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        //private _userService: UserService,
        private store: Store<{ user: any }>,
        private commonService: CommonService,
        private userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getUserFromStore();
        // Subscribe to user changes
        /* this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }); */
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async getUserFromStore() {
        this.store.select('user')
            .subscribe(response => {

                if (response.user) {
                    this.user = JSON.parse(JSON.stringify(response.user));
                    this.user.imageUrl = this.userService.profilePic(this.user['image']);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
                else this.getUserFromStorage();
            })

    }

    getUserFromStorage() {
        let user = this.commonService.getItem('currentUser');
        console.log(user);
        if (user) this.store.dispatch(signin({ user: user }));
    }

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        /* this._userService.update({
            ...this.user,
            status
        }).subscribe(); */
    }

    /**
     * Sign out
     */
    showProfile(): void {
        this._router.navigate(['/profile',this.user['_id']]);
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }
}
