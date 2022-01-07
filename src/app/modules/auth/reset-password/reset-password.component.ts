import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/services/common.service';
import { Subject } from 'rxjs';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    private _unsubscribeAll: Subject<any>;
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    currentUser: any;
    role: any;
    reseting = false;
    resetButtontext = 'SET MY PASSWORD';
    userPassword = { password: '', cpassword: '' };
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private commonService:CommonService,
        private userService:UserService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    )
    {
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
        this.currentUser= this.commonService.getItem('currentUser');
        this.getDefaultRoles(this.currentUser);

    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
    getDefaultRoles(user: any) {
        this.commonService.getDefaultRole()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {
                let defaultRoles = JSON.parse(JSON.stringify(response));
                //console.log(response);
                let index = defaultRoles.map( item => item.name).indexOf(user.role);
                if(index >= 0) {
                    // this.store.dispatch(new SetUserRoleAction(defaultRoles[index]));
                    this.commonService.setItem('currentRole', defaultRoles[index]);
                    // this.redirectToDashboad(user, defaultRoles[index]);
                }
                //else this.getCustomRole(user);
            })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */

    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;
    
            this.reseting = true;
            this.resetButtontext = 'Reseting Your Password';
            let obj = JSON.parse(JSON.stringify(this.currentUser));
            obj.onetime = false;
            obj.password = this.userPassword.password;
            // obj.otype = this.commonService.otype;
            this.userService.updatePassword(obj)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe( response => {
                    this.reseting = false;
                    this.resetButtontext = 'SET MY PASSWORD';
                    // if (this.role.privilege.indexOf('View Organization') >= 0) {
                    //     //Redirect to App Dashboard
                    //     this._router.navigate(['/pages/appdashboard']);
                    // }
                    // else {
                        //Redirect to Dashboard
                        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    console.log(redirectURL);
                        this._router.navigateByUrl(redirectURL);
                    // }
                },
                respError => {
                    this.commonService.showSnakBarMessage(respError, 'error', 2000);
                    this.reseting = false;
                    this.resetButtontext = 'SET MY PASSWORD';
                })
    }

        // Send the request to the server
        // this._authService.resetPassword(this.resetPasswordForm.get('password').value)
        //     .pipe(
        //         finalize(() => {

        //             // Re-enable the form
        //             this.resetPasswordForm.enable();

        //             // Reset the form
        //             this.resetPasswordNgForm.resetForm();

        //             // Show the alert
        //             this.showAlert = true;
        //         })
        //     )
        //     .subscribe(
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'success',
        //                 message: 'Your password has been reset.'
        //             };
        //         },
        //         (response) => {

        //             // Set the alert
        //             this.alert = {
        //                 type   : 'error',
        //                 message: 'Something went wrong, please try again.'
        //             };
        //         }
        //     );
    }

    // this.reseting = true;
    // this.resetButtontext = 'Reseting Your Password';
    // let obj = JSON.parse(JSON.stringify(this.user));
    // obj.onetime = false;
    // obj.password = this.userPassword.password;
    // obj.otype = this.commonService.otype;
    // this.userService.updatePassword(obj)
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe( response => {
    //         this.reseting = false;
    //         this.resetButtontext = 'SET MY PASSWORD';
    //         if (this.role.privilege.indexOf('View Organization') >= 0) {
    //             //Redirect to App Dashboard
    //             this.router.navigate(['/pages/appdashboard']);
    //         }
    //         else {
    //             //Redirect to Dashboard
    //             this.router.navigate(['/pages/dashboard']);
    //         }
    //     },
    //     respError => {
    //         this.commonService.showSnakBarMessage(respError, 'error', 2000);
    //         this.reseting = false;
    //         this.resetButtontext = 'SET MY PASSWORD';
    //     })
// }
