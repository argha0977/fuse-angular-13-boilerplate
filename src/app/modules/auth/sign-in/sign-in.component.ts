import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { signin } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit, OnDestroy
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    // Private
    private _unsubscribeAll: Subject<any>;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    signingin = false;
    signinButtontext = 'LOGIN';
    user = { userid: '', password: '' };

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private store: Store<{ user: any }>,
        private commonService: CommonService,
        private userService: UserService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            userid: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: ['']
        });
        /* this.signInForm = this._formBuilder.group({
            email     : ['hughes.brian@company.com', [Validators.required, Validators.email]],
            password  : ['admin', Validators.required],
            rememberMe: ['']
        }); */
    }

    /**
    * On destroy
    */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        this.userService.signin(this.user)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                let currentUser = JSON.parse(JSON.stringify(response));
                console.log(currentUser.features)
               if(!currentUser.features){
                this.commonService.getFeatures() 
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(
                (data:any)=> { console.log(data);
                 let features= JSON.parse(JSON.stringify(data));
                 let newdata=[];
                 if(features.length>0){
                     for(let i=0;i<features.length;i++){
                      newdata.push(features[i].name);
                     }
                     currentUser.features=newdata;
                 }
                 this.commonService.setItem('currentUser', currentUser);
                 this.store.dispatch(signin({user: currentUser}));
                 this.getDefaultRoles(currentUser);
                })
                }
                else{
                    this.commonService.setItem('currentUser', response);
                    this.store.dispatch(signin({user: response}));
                    this.getDefaultRoles(currentUser);
                }
               
               

            },
                (respError) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: respError
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );


        // Sign in
        /* this._authService.signIn(this.signInForm.value)
            .subscribe(
                () => {

                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);

                },
                (response) => {

                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            ); */
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
                    this.redirectToDashboad(user, defaultRoles[index]);
                }
                //else this.getCustomRole(user);
            })
    }

    redirectToDashboad(currentUser: any, role: any) {
        this.signingin = false;
        this.signinButtontext = 'LOGIN';
        if (currentUser.onetime) {
            this._router.navigateByUrl('reset-password');
        }
        else {
            if (role.privilege.indexOf('App Dashboard') >= 0){
                //Redirect to App Dashboard
                this._router.navigate(['appdashboard']);
            }
            else {
                //Redirect to Dashboard
                 const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                this._router.navigateByUrl(redirectURL);
            }
            
        }
    }
}