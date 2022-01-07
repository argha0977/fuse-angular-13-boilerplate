import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { deleteUser, signin } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdduserformComponent } from '../adduserform/adduserform.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserlistComponent implements OnInit {


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user = {
    firstname: '',
    lastname: '',
    imageUrl: '',
    role: '',
    image: ''
  };
  userList = [];
  profileData = '';
  configForm: FormGroup;
  profileFlag = false;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  constructor(
    private store: Store<{ user: any }>,
    private commonService: CommonService,
    private userService: UserService,
    private _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.getUserFromStore();
    this.configureDeleteConfirmation();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  async getUserFromStore() {
    this.userList = [];
    this.store.select('user')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {

        if (response.user) {
          this.user = JSON.parse(JSON.stringify(response.user));
          this.user.imageUrl = this.userService.profilePic(this.user.image);
        }
        else {
          this.getUserFromStorage();
        }
        if (response.users) {
          this.userList = [];
          let userList = JSON.parse(JSON.stringify(response.users));
          for (let i = 0; i < userList.length; i++) {
            userList[i].imageUrl = this.userService.profilePic(userList[i].image);
            this.userList.push(userList[i]);
          }
          console.log(this.userList);

        }
      })

  }

  getUserFromStorage() {
    let user = this.commonService.getItem('currentUser');
    console.log(user);
    if (user) this.store.dispatch(signin({ user: user }));
  }
  edtiUSer(index: number, user: any): void {
    this.dialogRef = this._matDialog.open(AdduserformComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'edit',
        user: JSON.parse(JSON.stringify(user))
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        //this._contactsService.updateContact(response.getRawValue());
      });

  }

  configureDeleteConfirmation() {
    // Build the config form
    this.configForm = this._formBuilder.group({
      title: 'Remove User',
      message: 'Are you sure you want to remove this user permanently? <span class="font-medium">This action cannot be undone!</span>',
      icon: this._formBuilder.group({
        show: true,
        name: 'heroicons_outline:exclamation',
        color: 'warn'
      }),
      actions: this._formBuilder.group({
        confirm: this._formBuilder.group({
          show: true,
          label: 'Remove',
          color: 'warn'
        }),
        cancel: this._formBuilder.group({
          show: true,
          label: 'Cancel'
        })
      }),
      dismissible: true
    });
  }

  openConfirmationDialog(list: any): void {
    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result == "confirmed") {
        this.userDelete(list)
      }
    });
  }

  deleteUser(index: number, list: any): void {
    if (list.userid != this.user['userid']) {
      this.openConfirmationDialog(list);
    }
    else {
      this.commonService.showSnakBarMessage('You can\'t remove yourself', 'error', 2000);
    }
  }
  userDelete(list: any) {
    list.duserid = this.user['userid'];
    this.userService.delete(list)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.store.dispatch(deleteUser({ user: list }));
      },
        respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
  }
  go2Profile(list: any, rindex: Number) {
    // this.router.navigateByUrl('profile',list._id);
    this.router.navigate(['/profile', 'users', list._id]);
  }

}
