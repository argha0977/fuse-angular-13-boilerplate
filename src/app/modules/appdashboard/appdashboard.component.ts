import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Chat, Profile } from 'app/modules/admin/apps/chat/chat.types';
import { ChatService } from 'app/modules/admin/apps/chat/chat.service';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { Store } from '@ngrx/store';
import { deleteOrganization, setOrganization } from 'app/store/actions/organization.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AddfeatureComponent } from './addfeature/addfeature.component';
import { AddlistComponent } from './addlist/addlist.component';

@Component({
  selector: 'app-appdashboard',
  templateUrl: './appdashboard.component.html',
  styleUrls: ['./appdashboard.component.scss']
})
export class AppdashboardComponent implements OnInit ,OnDestroy
  {
    // chats: Chat[];
    // drawerComponent: 'profile' | 'new-chat';
    drawerOpened: boolean = false;
    // filteredChats: Chat[];
    // profile: Profile;
    // selectedChat: Chat;
    countries=[];
    states= [];
    cities= [];
    user:any;
    dashboard = {country: '', state: '', city: '', oname: '', ocode:''};
    userList = [];
    configForm: FormGroup;
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmationDialogComponent>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
      private commonService: CommonService,
      private _formBuilder: FormBuilder,
      private organizationService: OrganizationService,
      private store: Store<{ organization: any }>,
      private _fuseConfirmationService: FuseConfirmationService,
      private _matDialog: MatDialog,
        // private _chatService: ChatService,
        // private _changeDetectorRef: ChangeDetectorRef
    )
    {  this._unsubscribeAll = new Subject();}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this.user = this.commonService.getItem('currentUser');
      this.getCountry();
      this.getData();
      this.configureDeleteConfirmation();
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

    getCountry(){
      this.countries=[];
      this.organizationService.countries({})
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
         console.log(response);
         let data= JSON.parse(JSON.stringify(response));
         if(data.length>0){
           for(let i=0;i<data.length;i++){
            this.countries.push(data[i]);
           }
           this.countries.unshift('All');
           this.dashboard.country=this.countries[0];
           this.getState(this.dashboard.country);
         }
        console.log(this.countries);
        },
        respError => {
            this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
    }
    getState(country:string){
    this.states=[];
    if(country!="All"){
      let obj={country:country};
      this.organizationService.states(obj)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(response => {
           console.log(response);
           let data= JSON.parse(JSON.stringify(response));
           if(data.length>0){
             for(let i=0;i<data.length;i++){
              this.states.push(data[i]);
             }
             this.states.unshift('All');
             this.dashboard.state=this.states[0];
             this.getCity(country,this.dashboard.state);
           }
          console.log(this.states);
          },
          respError => {
              this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
    }
    else{
      this.states.push('All');
      this.dashboard.state=this.states[0];
      this.getCity(country,this.dashboard.state);
    }
    
    }
    getCity(country:string,state:string){
      this.cities=[];
      if(country!="All" && state!="All"){
      let obj={country:country,state:state};
      this.organizationService.cities(obj)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(response => {
           console.log(response);
           let data= JSON.parse(JSON.stringify(response));
           if(data.length>0){
             for(let i=0;i<data.length;i++){
              this.cities.push(data[i]);
             }
             this.cities.unshift('All');
             this.dashboard.city=this.cities[0];
           }
          console.log(this.cities);
          },
          respError => {
              this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
        }
        else{
          this.cities.push('All');
          this.dashboard.city=this.cities[0];
        }
    }
  
  
  
    onFilter(){
      // this.loading = true;
      let obj={};
       if(this.dashboard.country!="All"){
         obj['country']=this.dashboard.country;
       }
       if(this.dashboard.state!="All"){
        obj['state']=this.dashboard.state;
      }
      if(this.dashboard.city!="All"){
        obj['city']=this.dashboard.city;
      }
      if(this.dashboard.oname!=" "){
        obj['oname']=this.dashboard.oname;
      }
      if(this.dashboard.ocode!=" "){
        obj['ocode']=this.dashboard.ocode;
      }
     
      this.getSearch(obj)
      
    }
    getSearch(obj:any){
      this.organizationService.search(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response =>{
        console.log('test',response)
        let users = JSON.parse(JSON.stringify(response));
        // this.store.dispatch(new SetOrganizationAction(users));
        this.store.dispatch(setOrganization({organizations: users}));
        // this.loading = false;
        // this.filter.emit(this.loading);
      },
      respError => {
        // this.loading = false;
        // this.filter.emit(this.loading);
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
    })
    }
    getData(){
      this.userList = [];
      this.store.select('organization')
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
  
         
            this.userList = [];
            let userList = JSON.parse(JSON.stringify(response.organizations));
            if(userList.length>0){
              for (let i = 0; i < userList.length; i++) {
             
                this.userList.push(userList[i]);
              }
            }
              else{
                let obj={};
                 obj['skip']=0;
                 obj['limit']=14;
                  this.getSearch(obj);
              }
          
           
            console.log(this.userList);
  
          
        })
  
    }

    setProduct(list:any){
      this.dialogRef = this._matDialog.open(AddfeatureComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          data: list,
          currentUser: this.user,
          action: 'edit'
        }
      });
  
      this.dialogRef.afterClosed()
        .subscribe((response: any) => {
          if (!response) {
            return;
          }
  
        });
    }
    vendorEdit(list:any){
      this.dialogRef = this._matDialog.open(AddlistComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          data: list,
          currentUser: this.user,
          action: 'edit'
        }
      });
  
      this.dialogRef.afterClosed()
        .subscribe((response: any) => {
          if (!response) {
            return;
          }
  
        });
    }
    addnew(){
      this.dialogRef = this._matDialog.open(AddlistComponent, {
        panelClass: 'contact-form-dialog',
        data: {
          currentUser: this.user,
          action: 'add'
        }
      });
  
      this.dialogRef.afterClosed()
        .subscribe((response: any) => {
          if (!response) {
            return;
          }
  
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
  
    deleteVendor(list:any){
      if (list.userid != this.user['userid']) {
        this.openConfirmationDialog(list);
      }
      else {
        this.commonService.showSnakBarMessage('You can\'t remove yourself', 'error', 2000);
      }
    }
    userDelete(list: any) {
      list.duserid = this.user['userid'];
      this.organizationService.delete(list)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          this.store.dispatch(deleteOrganization({ organization: list }));
        },
          respError => {
            this.commonService.showSnakBarMessage(respError, 'error', 2000);
          })
    }

}

