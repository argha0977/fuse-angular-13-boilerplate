import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class UsersComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _fuseMediaWatcherService: FuseMediaWatcherService) { }

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

}
