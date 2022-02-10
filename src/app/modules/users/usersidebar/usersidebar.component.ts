import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { setUsers } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usersidebar',
  templateUrl: './usersidebar.component.html',
  styleUrls: ['./usersidebar.component.scss']
})
export class UsersidebarComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  @Input() action: any;
  @Output() updateParent1 = new EventEmitter<boolean>();
  user: any;
  roles = [];
  criteria={role:''};
  userList=[];
  addFlag=false;
  searchFlag=false;
  editFlag=false;
  constructor(private commonService:CommonService, private userService:UserService,private store: Store<{ user: any }>,) 
  {  this._unsubscribeAll = new Subject();}

  ngOnInit(): void {
    this.user = this.commonService.getItem('currentUser');
    this.getStoreData();
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
        this.searchFlag=false;
        this.editFlag=true;
        this.addFlag=false;
        // if(response.data){
        //   this.list=JSON.parse(JSON.stringify(response.data));
        // }
      }
      else{
        this.searchFlag=false;
        this.addFlag=true;
        this.editFlag=false;
      }
      // this. getCountries();
     }
     else{
      this.searchFlag=true;
      this.addFlag=false;
      this.editFlag=false;
      this.getDefaultRoles();
     }
 
    
    })
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
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe(response => {
      console.log(response)
      let data= JSON.parse(JSON.stringify(response));
      if(data.length>0){
        for(let i=0;i<data.length;i++){
          this.userList.push(data[i]);
        } 
      }

      this.store.dispatch(setUsers({users: this.userList}));
      this.updateParent1.emit(false); 
    },
    respError => {
        // this.loading = false;
        // this.filter.emit(this.loading);
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
    })
}
bck2parentAdd(value:Boolean){
  console.log(value)
         if(value==false){
          this.updateParent1.emit(false);
       }
}
}
