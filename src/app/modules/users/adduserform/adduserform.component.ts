import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { addUser } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adduserform',
  templateUrl: './adduserform.component.html',
  styleUrls: ['./adduserform.component.scss']
})
export class AdduserformComponent  {
// Private
private _unsubscribeAll: Subject<any>;

action: string;
updateFlag = false;
currentUser: any;
saving = false;
user = {
    firstname: '',
    lastname: '',
    mobile: '',
    email: '',
    imageUrl: '',
    role: '',
    password:''
};
contactForm: FormGroup;
dialogTitle: string;
roles = [];
passwordFlag = true;
 visible = false;
  constructor(  public matDialogRef: MatDialogRef<AdduserformComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    // private store: Store<AppState>,
    private userService: UserService,
    private commonService: CommonService,private store: Store<{ user: any }>,)
  { 
    this._unsubscribeAll = new Subject();
    this.currentUser= this.commonService.getItem('currentUser');
    this.getDefaultRoles();
    this.action = _data.action;
    if ( this.action === 'edit' )
    {
        this.dialogTitle = 'Edit User/Employee';
        this.updateFlag = true;
        this.user = _data.user;
        // this.passwordFlag = false;
        this.user.imageUrl = this.userService.profilePic(this.user['image']);
    }
    else
    {
        this.dialogTitle = 'New User/Employee';
        this.user.imageUrl = this.userService.profilePic('noluser.png');
    }
    this.contactForm = this.createContactForm();
  }
  createContactForm(): FormGroup
  {
      return this._formBuilder.group({
          firstname: [''],
          lastname: [''],
          email: [''],
          mobile: [''],
          password: [''],
          role: [''],
      });
  }
  
  getDefaultRoles() {
    this.roles = [];
    this.commonService.getDefaultRole()
        .subscribe(response => {
            let defaultRoles = JSON.parse(JSON.stringify(response));
            if(this.user.role == 'APPUSER') defaultRoles.splice(0,1);
            else if (this.user.role != 'APPADMIN') defaultRoles.splice(0, 2);
            // this.store.dispatch(new SetRolesAction(defaultRoles));
            //this.getCustomRole(defaultRoles);
            for(let i=0;i<defaultRoles.length;i++){
              this.roles.push(defaultRoles[i]);
            }
           if(this.roles.length>0 && this.action === 'add') {
            this.user.role=this.roles[0].name; 
           }
            console.log(this.roles);
        })
}
onSave() {
  this.saving = true;
  if (this.updateFlag) {
      this.updateUser();
  }
  else {
      this.createUser();
  }
}

createUser() {
  let obj = JSON.parse(JSON.stringify(this.user));
  //console.log(obj);
  obj.ocode = this.currentUser.ocode;
  obj.cuserid = this.currentUser.userid;
 // console.log(obj);
  this.userService.create(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let data= JSON.parse(JSON.stringify(response));
          this.saving = false;
          this.store.dispatch(addUser({user: data}));
          console.log(response);
          this.matDialogRef.close(this.contactForm);
      },
          respError => {
              this.saving = false;
              this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
}

updateUser() {
  let obj = JSON.parse(JSON.stringify(this.user));
  obj.cuserid = this.currentUser.userid;
  let imageUrl = obj.imageUrl;
  delete obj.imageUrl;
  this.userService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
          if (response) {
              this.user = JSON.parse(JSON.stringify(response));
              this.user.imageUrl = imageUrl;
              this.matDialogRef.close(this.user);
              //this.commonService.setItem('currentUser', this.user);
          }
      },
      respError => {
          this.saving = false;
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
      })
}


}
