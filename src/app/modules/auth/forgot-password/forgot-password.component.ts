import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';
import { CommonService } from 'app/services/common.service';
import { Subject } from 'rxjs';
import { UserService } from 'app/services/user.service';


@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean = false;
    forgotPasswordForm: FormGroup;
    buttonText = 'VERIFY AND RESET';
    resetting = false;
    user = { userid: '' };
    success = false;

    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     */
    constructor(

        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private commonService: CommonService
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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    resetPassword() {
        this.resetting = true;
        this.buttonText = 'VERIFYING';
        this.checkUserAccount();
    }

    checkUserAccount() {
        let obj = JSON.parse(JSON.stringify(this.user));
        this.userService.showUser(obj.userid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {console.log(response);
                this.reset(JSON.parse(JSON.stringify(response)));
            },
                respError => {
                    this.commonService.showSnakBarMessage(respError, 'error', 2000);
                    this.resetting = false;
                    this.buttonText = 'VERIFY AND RESET';
                })
    }

    reset(user: any) {
        this.buttonText = 'RESETTING PASSWORD';
        this.userService.resetPassword(user)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {console.log(response);
                this.resetting = false;
                this.buttonText = 'VERIFY AND RESET';
                this.router.navigateByUrl('confirmation-required');
            },
                respError => {
                    this.commonService.showSnakBarMessage(respError, 'error', 2000);
                    this.resetting = false;
                    this.buttonText = 'VERIFY AND RESET';
                })
    }
    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Password reset sent! You\'ll receive an email if you are registered on our system.'
                    };
                },
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Email does not found! Are you sure you are already a member?'
                    };
                }
            );
    }
}
