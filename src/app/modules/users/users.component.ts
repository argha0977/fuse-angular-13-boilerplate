import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngrx/store';
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
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  dialogRef: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private store: Store<{ user: any }>,
    private _fuseMediaWatcherService: FuseMediaWatcherService, private _matDialog: MatDialog, private _changeDetectorRef: ChangeDetectorRef,) { }

    ngOnInit(): void {
      // Subscribe to media changes
      this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({matchingAliases}) => {
     
          // Set the drawerMode and drawerOpened if
          if ( matchingAliases.includes('lg') )
          {
            this.drawerMode = 'side';
            this.drawerOpened = false;
          }
          else
          {
              this.drawerMode = 'over';
              this.drawerOpened = false;
          }
      });
     //  this.getStoreUserid();
       }

  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createUsers(): void {

    const dialogRef = this._matDialog.open(AdduserformComponent, {
      data: {
        action: 'new'
      }
    }
    );

    dialogRef.afterClosed()
      .subscribe((result) => {
        console.log('Compose dialog was closed!');
      });

  }
  bck2parentSide(value:Boolean){
    console.log(value)
           if(value==false){
           this.drawerOpened = false;
           this.matDrawer.close();
         }
  }

}
