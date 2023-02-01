import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { setActionUser, setListUserData } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdduserformComponent } from './adduserform/adduserform.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class UsersComponent implements OnInit {
  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  dialogRef: any;
  loading = true;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private store: Store<{ user: any }>,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _matDialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {

        // Set the drawerMode and drawerOpened if
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
          this.drawerOpened = false;
        }
        else {
          this.drawerMode = 'over';
          this.drawerOpened = false;
        }
      });
    //Subscribe to MatDrawer opened change
    this.matDrawer.openedChange.subscribe((opened) => { //
      if (!opened) {
        this.store.dispatch(setActionUser({ action: '' }));
        this.store.dispatch(setListUserData({ data: undefined }));
        this.drawerOpened = false;
        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });
    this.commonService.loading.subscribe(res => this.loading = res)
    //  this.getStoreUserid();
    //this.store.dispatch(setActionUser({ action: 'search' }));
  }

  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.commonService.loading.next(true);
    this.store.dispatch(setActionUser({ action: 'search' }));
  }

  bck2parentSide(value: Boolean) {
    console.log(value)
    if (value == false) {
      this.store.dispatch(setActionUser({ action: 'add' }));
      this.drawerOpened = false;
      this.matDrawer.close();
    }
  }
  bck2parent(value: Boolean) {
    console.log(value)
    if (value == false) {
      this.store.dispatch(setActionUser({ action: 'edit' }));
      // this.action='edit';
      this.drawerOpened = true;


    }
  }
  search() {
    // console.log('search');

    this.matDrawer.open();
    // this.action='search';
    this.store.dispatch(setActionUser({ action: 'search' }));
  }

  addnew() {
    // console.log('add');

    // if(this.drawerOpened == true){
    //   console.log('add true');
    // }
    // else if(this.drawerOpened == false){
    //   console.log('add false');
    //

    // }
    this.matDrawer.open();
    this.store.dispatch(setActionUser({ action: 'add' }));
    // this.action='add';
  }

}
