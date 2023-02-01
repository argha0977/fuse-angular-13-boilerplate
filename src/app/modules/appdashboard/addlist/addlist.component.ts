import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfigService } from '@fuse/services/config';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { addOrganization, updateOrganization } from 'app/store/actions/organization.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addlist',
  templateUrl: './addlist.component.html',
  styleUrls: ['./addlist.component.scss']
})
export class AddlistComponent  {

 // loading$: Observable<boolean>;
  // error$: Observable<Error>;
  private _unsubscribeAll: Subject<any>;
  saving = false;
  updateFlag = false;
  action: string;
  dialogTitle: string;
  passwordFlag: boolean;
  visible = false;
  user: any;
  currentUser: any;
  vendorForm: FormGroup;
  vendors = {oname:'', pin:'', address:'', country:'', state:'', city:'',};
  //googleapikey:''};
  countries=[];
  states = [];
  profileFlag= false;
   /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param _data
     *      
      * @param {MatDialogRef<VendoreditComponent>} matDialogRef
     * @param {FormBuilder} _formBuilder
     * 
     */

  constructor(
    private organizationService: OrganizationService,
    public matDialogRef: MatDialogRef<AddlistComponent>,
    private store: Store<{ organization: any }>,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _fuseConfigService: FuseConfigService,
    // private roleService:RoleService
   ) 
   {
    this._unsubscribeAll = new Subject();
    this.vendorForm = this.createForm();
    this.getCountries();
    this.action =_data.action;
    this.currentUser =  JSON.parse(JSON.stringify(_data.currentUser));
    if ( this.action === 'edit' )
    {
      this.dialogTitle = 'Edit Organization';
      this.updateFlag = true;
      this.vendors = JSON.parse(JSON.stringify(_data.data));
      console.log(_data.data);
      if (_data.data) {
        this.vendors.state = _data.data.state;
        this.vendors.country = _data.data.country;
        if (_data.data.pin) {
          this.vendors.pin = _data.data.pin;
        }
      }
      
      
     
      // this.vendors.googleapikey = JSON.parse(JSON.stringify(_data.data.googleapikey));
    }
    else{
        this.dialogTitle = 'Add Organization';
    }
    // if(_data.page == 'profile')   this.profileFlag= true;
   }

  
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
 
  createForm():FormGroup {
    return this._formBuilder.group({
        state: new FormControl(''),
        oname :new FormControl(''),
        country: new FormControl(''),
        city: new FormControl(''),
        address: new FormControl(''),
        pin: new FormControl(''),
        // googleapikey: new FormControl(''),
      });
  }  

  getCountries(){
    // alert('1')
    console.log('123');
    this.commonService.getCountries() 
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
        (data:any)=> { console.log(data);
            this.countries= JSON.parse(JSON.stringify(data));
            console.log(this.countries);
            if(this.countries.length > 0) {
              if(!this.updateFlag){
              this.vendors.country='India';
              }
              this.onSelect();
            }
            
        }
    )
  }
  
  onSelect(){
    let index = this.commonService.findItem(this.countries, 'name', this.vendors.country);
    if(index >= 0) {
        if(this.countries[index].states) {
            this.states = this.countries[index].states;
        }
        else this.states = [];
    }
    else this.states = [];
    if(this.states.length > 0) {
      if(!this.updateFlag){
        this.vendors.state = this.countries[index].states[0].name;
      }
    }
    else {
      if(!this.updateFlag){
      this.vendors.state = '';
      }
    }
  }
  onSave(){
    this.saving = true;
    if(this.vendors.oname==''){
      this.commonService.showSnakBarMessage('enter a name', 'error', 2000);
      return;
    }
    if(this.updateFlag){
    let obj = JSON.parse(JSON.stringify(this.vendors));
    obj['userid']=this.currentUser.userid;
    console.log(obj);
    this.organizationService.update(obj)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response =>{
      this.saving = false;
      let data=JSON.parse(JSON.stringify(response));
      this.store.dispatch(updateOrganization({organization: data}));
      this.matDialogRef.close(data);
   },
      respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
      })

    }
    else {
      let obj = JSON.parse(JSON.stringify(this.vendors));
      obj['userid']=this.currentUser.userid;
      console.log(obj);
      this.organizationService.create(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response =>{
        this.saving = false;
        let data=JSON.parse(JSON.stringify(response));
        this.store.dispatch(addOrganization({organization: data}));
        this.matDialogRef.close(data);
     },
        respError => {
            this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
  
      }
  }
 





}
