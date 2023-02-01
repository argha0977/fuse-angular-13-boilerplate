import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserComponent } from 'app/layout/common/user/user.component';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { addUser, updateUser } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersComponent } from '../users.component';

@Component({
  selector: 'app-adduserform',
  templateUrl: './adduserform.component.html',
  styleUrls: ['./adduserform.component.scss']
})
export class AdduserformComponent implements OnInit {//
  // Private
  private _unsubscribeAll: Subject<any>;
  // @Input() action: any;
  @Output() updateParent2 = new EventEmitter<boolean>();
  action: string;
  updateFlag = false;
  currentUser: any;
  saving = false;
  user = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
  contactForm: FormGroup;
  dialogTitle: string;
  roles = [];
  passwordFlag = true;
  visible = false;
  addFlag = true;
  editFlag = true;
  data = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
  //  constructor( ){

  //  }
  //  ngOnInit(): void {

  //  }
  constructor(

    // private store: Store<AppState>,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private usersComponent: UsersComponent,
    private commonService: CommonService, private store: Store<{ user: any }>,) {
    this._unsubscribeAll = new Subject();
    // this.currentUser = this.commonService.getItem('currentUser');
    // this.action = _data.action;
    // if (this.action === 'edit') {
    //   this.dialogTitle = 'Edit User';
    //   this.updateFlag = true;
    //   this.user = _data.user;
    //   // this.passwordFlag = false;
    //   this.user.imageUrl = this.userService.profilePic(this.user['image']);
    // }
    // else {
    //   this.dialogTitle = 'New User';
    //   this.user.imageUrl = this.userService.profilePic('noluser.png');
    // }
    // this.contactForm = this.createContactForm();
    // this.getDefaultRoles();

  }




  ngOnInit(): void {
    this.currentUser = this.commonService.getItem('currentUser');

    this.getStoreData();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // showicon(){
  //   if(this.addFlag && !this.editFlag){
  //    this.visible=!this.visible;
  //   }
  //   // else if(!this.addFlag && this.editFlag){

  //   // }
  // }
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      mobile: ['', Validators.pattern(/^\d{10}$/)],
      password: ['', Validators.required],
      role: [this.user.role],
    });
  }
  getStoreData() {
    this.store.select('user')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        console.log(response);

        if (response.action) {
          this.action = JSON.parse(JSON.stringify(response.action));
        }
        if (this.action != 'search') {

          if (this.action === 'edit') {
            // this.searchFlag=false;
            this.editFlag = true;
            this.addFlag = false;
            if (response.data) {
              this.user = JSON.parse(JSON.stringify(response.data));
              this.data = JSON.parse(JSON.stringify(response.data));

              // this.user.password= response.data.password;
              this.user.imageUrl = this.userService.profilePic(this.user['image']);
            }
            this.contactForm = this.createContactForm();
          }
          else {
            // this.searchFlag=false;
            this.addFlag = true;
            this.editFlag = false;
            this.user.imageUrl = this.userService.profilePic('noluser.png');
            this.user = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
            this.contactForm = this.createContactForm();
            this.contactForm.reset();
            // this.generalsettingForm.controls['obdate'].setValue(new Date());

          }
          this.getDefaultRoles();
        }
        //  else{
        //   this.searchFlag=true;
        //   this.addFlag=false;
        //   this.editFlag=false;
        //   this.getCountry();
        //  }
        // this.getcustomer();

      })
  }
  getDefaultRoles() {
    this.roles = [];
    this.commonService.getDefaultRole()
      .subscribe(response => {
        this.roles = [];
        let defaultRoles = JSON.parse(JSON.stringify(response));
        if (this.user.role == 'APPUSER') defaultRoles.splice(0, 1);
        else if (this.user.role != 'APPADMIN') defaultRoles.splice(0, 2);
        // this.store.dispatch(new SetRolesAction(defaultRoles));
        //this.getCustomRole(defaultRoles);
        for (let i = 0; i < defaultRoles.length; i++) {
          this.roles.push(defaultRoles[i]);
        }
        if (this.roles.length > 0) {
          if (this.action === 'add') {
            this.user.role = this.roles[0].name;
          }
          else if (this.action === 'edit') {
            console.log(this.user.role)
            /* let index= this.commonService.findItem(this.roles,'name', this.data.role);
            if(index!=-1){
              this.user.role = this.roles[index].name; 
            } */

          }

        }
      })
  }


  onAdd() {
    this.saving = true;
    if (!this.user.firstname) {
      this.saving = false;
      // this.commonService.showSnakBarMessage('Enter Users Firstname', 'error', 2000);
      return;
    }
    if (!this.user.lastname) {
      this.saving = false;
      // this.commonService.showSnakBarMessage('Enter Users Lastname', 'error', 2000);
      return;
    }
    if (!this.user.mobile) {
      this.saving = false;
      // this.commonService.showSnakBarMessage('Enter a Users Mobile No. ', 'error', 2000);
      return;
    }
    if (!this.user.password) {
      this.saving = false;
      // this.commonService.showSnakBarMessage('Enter a Password. ', 'error', 2000);
      return;
    }
    if (!this.user.email) {
      this.saving = false;
      // this.commonService.showSnakBarMessage('Enter a Password. ', 'error', 2000);
      return;
    }

    if (this.user.mobile.trim() == '') {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter mobile number ', 'error-toast', 2000);
      return;
    }
    let mpattern = /(^\d{10}$)/;
    if (!mpattern.test(this.user.mobile)) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter mobile number in correct format', 'error', 2000);
      return;
    }

    if (this.contactForm.valid) {
      let obj = JSON.parse(JSON.stringify(this.user));
      //console.log(obj);
      obj.ocode = this.currentUser.ocode;
      obj.cuserid = this.currentUser.userid;
      // console.log(obj);
      this.userService.create(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          let data = JSON.parse(JSON.stringify(response));
          this.saving = false;
          this.store.dispatch(addUser({ user: data }));
          console.log(response);
          this.cancel();
        },
          respError => {
            this.saving = false;
            this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
    }
  }

  onUpdate() {
    this.saving = true;
    if (!this.user.firstname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter users firstname', 'error', 2000);
      return;
    }
    if (!this.user.lastname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter users lastname', 'error', 2000);
      return;
    }
    if (!this.user.mobile) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter  users mobile no. ', 'error', 2000);
      return;
    }
    console.log('update', this.user);
    console.log('update', this.contactForm.valid);
    if (this.contactForm.valid) {
      let obj = JSON.parse(JSON.stringify(this.user));
      obj.cuserid = this.currentUser.userid;
      let imageUrl = obj.imageUrl;
      delete obj.imageUrl;
      console.log(obj);
      this.userService.update(obj)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          console.log(response);
          if (response) {
            this.saving = false;
            this.user = JSON.parse(JSON.stringify(response));
            this.user.imageUrl = imageUrl;
            this.store.dispatch(updateUser({ user: this.user }));
            // this.userService.userfilter.next(this.user);//sourav code

            this.cancel();
            // this.commonService.setItem('currentUser', this.user);
          }
        },
          respError => {
            this.saving = false;
            this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
    }
  }

  cancel() {
    // this.searchFlag=false;
    this.addFlag = false;
    this.editFlag = false;
    this.user = { firstname: '', lastname: '', mobile: '', email: '', imageUrl: '', role: '', password: '' };
    this.updateParent2.emit(false);
  }

  close() {

    this.usersComponent.matDrawer.close()

  }
}
