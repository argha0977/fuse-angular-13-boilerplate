import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { Store } from '@ngrx/store';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { InventoryPagination, InventoryProduct } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { signin } from 'app/store/actions/user.actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdduserformComponent } from '../adduserform/adduserform.component';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations     : fuseAnimations
})
export class UserlistComponent implements OnInit{


  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user = {
    firstname: '',
    lastname: '',
    imageUrl: '',
    role: '',
    image:''
};
   userList=[];
   dialogRef: any;
   confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
  constructor(
    private store: Store<{ user: any }>,  private commonService: CommonService, private userService: UserService,private _matDialog: MatDialog,)
  {
  }

  ngOnInit(): void {
  this.getUserFromStore();
  }

   ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
    async getUserFromStore() {
      this.userList=[];
      this.store.select('user')
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe( response =>{
          
          if (response.user) {
              this.user = JSON.parse(JSON.stringify(response.user));
              this.user.imageUrl = this.userService.profilePic(this.user.image);
          }
          else {
            this.getUserFromStorage();
          }
          if(response.users){
            let userList= JSON.parse(JSON.stringify(response.users));
            for(let i=0; i<userList.length;i++){
              this.userList.push(userList[i]);
            }
            console.log(this.userList);

          }
      })
      
  }

  getUserFromStorage() {
      let user = this.commonService.getItem('currentUser');
      console.log(user);
      if(user) this.store.dispatch(signin({user: user}));
  }
  edtiUSer(index:number ,list:any) :void {
    this.dialogRef = this._matDialog.open(AdduserformComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'edit',
        user:list
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
  deleteUser(index:number ,list:any) :void {
  if(list.userid != this.user['userid']) {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmationDialogComponent, {
        disableClose: false
    });

    // this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if (result) {
            // this.userDelete(list);
        }
        this.confirmDialogRef = null;
    });
}
else {
    this.commonService.showSnakBarMessage('You can\'t remove yourself', 'error', 2000);
}
  }
}
