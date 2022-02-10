import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngrx/store';
import { setActionUser, setListUserData } from 'app/store/actions/user.actions';
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
      //Subscribe to MatDrawer opened change
      this.matDrawer.openedChange.subscribe((opened) => { //
       if ( !opened )
       {
           this.store.dispatch(setActionUser({action: ''}));
           this.store.dispatch(setListUserData({data:undefined}));
           this.drawerOpened = false;
           // Mark for check
           this._changeDetectorRef.markForCheck();
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
  
  bck2parentSide(value:Boolean){
    console.log(value)
           if(value==false){
            this.store.dispatch(setActionUser({action: 'add'}));
           this.drawerOpened = false;
           this.matDrawer.close();
         }
  }
  bck2parent(value:Boolean){
    console.log(value)
           if(value==false){
            this.store.dispatch(setActionUser({action: 'edit'}));
            // this.action='edit';
           this.drawerOpened = true;
         
           
         }
  }
  addnew(){
    // console.log('add');
    
    // if(this.drawerOpened == true){
    //   console.log('add true');
    // }
    // else if(this.drawerOpened == false){
    //   console.log('add false');
    //

    // }
    this.matDrawer.toggle();
    this.store.dispatch(setActionUser({action: 'add'}));
    // this.action='add';
  }
  search(){
    // console.log('search');

    this.matDrawer.toggle();
    // this.action='search';
    this.store.dispatch(setActionUser({action: 'search'}));
  }
}
