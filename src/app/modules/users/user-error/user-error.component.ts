import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Store } from '@ngrx/store';
import { setActionUser } from 'app/store/actions/user.actions';
import { UsersComponent } from '../users.component';

@Component({
  selector: 'app-user-error',
  templateUrl: './user-error.component.html',
  styleUrls: ['./user-error.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserErrorComponent implements OnInit {

  constructor(private usersComponent: UsersComponent,
    private store: Store<{ user: any }>,) { }

  ngOnInit(): void {
  }

  search() {
    this.store.dispatch(setActionUser({ action: 'search' }));
    this.usersComponent.matDrawer.open();

  }

}
