import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { addUser, updateUser } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adduserform',
  templateUrl: './adduserform.component.html',
  styleUrls: ['./adduserform.component.scss']
})
export class AdduserformComponent implements OnInit{//
  // Private
  private _unsubscribeAll: Subject<any>;
  // @Input() action: any;
  @Output() updateParent2 = new EventEmitter<boolean>();
  action: string;
  updateFlag = false;
  currentUser: any;
  saving = false;
  user = { firstname: '',lastname: '', mobile: '', email: '', imageUrl: '',role: '', password: ''};
  contactForm: FormGroup;
  dialogTitle: string;
  roles = [];
  passwordFlag = true;
  visible = false;
  addFlag=true;
  editFlag=true;
  //  constructor( ){

  //  }
  //  ngOnInit(): void {

  //  }
  constructor(
  
    // private store: Store<AppState>,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService, private store: Store<{ user: any }>,) 
    {
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
    this.contactForm = this.createContactForm();
    this.getStoreData();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      firstname: [''],
      lastname: [''],
      email: ['', Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)],
      mobile: ['', Validators.pattern(/^\d{10}$/)],
      password: [''],
      role: [''],
    });
  }
  getStoreData(){
    this.store.select('user')
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => { 
      console.log(response);
      
     if(response.action){
       this.action=JSON.parse(JSON.stringify(response.action));
     }
     if(this.action!='search'){
      
      if (this.action==='edit'){
        // this.searchFlag=false;
        this.editFlag=true;
        this.addFlag=false;
        if(response.data){
          this.user=JSON.parse(JSON.stringify(response.data));
          this.user.imageUrl = this.userService.profilePic(this.user['image']);
        }
      }
      else{
        // this.searchFlag=false;
        this.addFlag=true;
        this.editFlag=false;
        this.user.imageUrl = this.userService.profilePic('noluser.png');
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
        let defaultRoles = JSON.parse(JSON.stringify(response));
        if (this.user.role == 'APPUSER') defaultRoles.splice(0, 1);
        else if (this.user.role != 'APPADMIN') defaultRoles.splice(0, 2);
        // this.store.dispatch(new SetRolesAction(defaultRoles));
        //this.getCustomRole(defaultRoles);
        for (let i = 0; i < defaultRoles.length; i++) {
          this.roles.push(defaultRoles[i]);
        }
        if (this.roles.length > 0 && this.action === 'add') {
          this.user.role = this.roles[0].name;
        }
      })
  }
  

  onAdd() {
    this.saving = true;
    if (!this.user.firstname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter Users Firstname', 'error', 2000);
      return;
    }
    if (!this.user.lastname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter Users Lastname', 'error', 2000);
      return;
    }
    if (!this.user.mobile) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter a Users Mobile No. ', 'error', 2000);
      return;
    }
    if (!this.user.password) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter a Password. ', 'error', 2000);
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

  onUpdate(){
    this.saving = true;
    if (!this.user.firstname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter Users Firstname', 'error', 2000);
      return;
    }
    if (!this.user.lastname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter Users Lastname', 'error', 2000);
      return;
    }
    if (!this.user.mobile) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Enter a Users Mobile No. ', 'error', 2000);
      return;
    }
    if (this.contactForm.valid) {
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
          this.store.dispatch(updateUser({ user: this.user }));
          this.cancel();
          //this.commonService.setItem('currentUser', this.user);
        }
      },
        respError => {
          this.saving = false;
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
  }
}

  cancel(){
    // this.searchFlag=false;
    this.addFlag=false;
    this.editFlag=false;
    this.user = { firstname: '',lastname: '', mobile: '', email: '', imageUrl: '',role: '', password: ''};
    this.updateParent2.emit(false);
  }
}
