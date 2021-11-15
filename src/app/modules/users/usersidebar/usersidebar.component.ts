import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { setUsers } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-usersidebar',
  templateUrl: './usersidebar.component.html',
  styleUrls: ['./usersidebar.component.scss']
})
export class UsersidebarComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  user: any;
  roles = [];
  criteria={role:''};
  userList=[];
  constructor(private commonService:CommonService, private userService:UserService,private store: Store<{ user: any }>,) 
  {  this._unsubscribeAll = new Subject();}

  ngOnInit(): void {
  this.user= this.commonService.getItem('currentUser');
  this.getDefaultRoles();
  }
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
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
           if(this.roles.length>0 ) {
            this.criteria.role=this.roles[0].name; 
           }
            console.log(this.roles);
        })
}
onFilter(){
  this.userList=[];
  let criteria = JSON.parse(JSON.stringify(this.criteria));
  criteria.ocode = this.user.ocode;
  this.userService.search(criteria)
  .subscribe(response => {
      console.log(response)
      let data= JSON.parse(JSON.stringify(response));
      if(data.length>0){
        for(let i=0;i<data.length;i++){
          this.userList.push(data[i]);
        } 
      }
      this.store.dispatch(setUsers({users: this.userList}));
    },
    respError => {
        // this.loading = false;
        // this.filter.emit(this.loading);
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
    })
}
}
