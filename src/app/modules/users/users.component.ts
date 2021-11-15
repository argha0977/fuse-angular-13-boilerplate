import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdduserformComponent } from './adduserform/adduserform.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class UsersComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    dialogRef: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService, private _matDialog: MatDialog,) { }

  ngOnInit(): void {
 // Subscribe to media changes
 this._fuseMediaWatcherService.onMediaChange$
 .pipe(takeUntil(this._unsubscribeAll))
 .subscribe(({matchingAliases}) => {

     // Set the drawerMode and drawerOpened if
     if ( matchingAliases.includes('lg') )
     {
         this.drawerMode = 'side';
         this.drawerOpened = true;
     }
     else
     {
         this.drawerMode = 'over';
         this.drawerOpened = false;
     }
 });
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
    createUsers() :void {
      this.dialogRef = this._matDialog.open(AdduserformComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          action: 'new'
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

}
