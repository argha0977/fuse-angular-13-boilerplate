import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { updateOrganization } from 'app/store/actions/organization.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-addfeature',
  templateUrl: './addfeature.component.html',
  styleUrls: ['./addfeature.component.scss']
})
export class AddfeatureComponent  {
  private _unsubscribeAll: Subject<any>;
  action: string;
  currentUser: any;
  dataProduct:any;
  productsSearch=[];


  constructor( @Inject(MAT_DIALOG_DATA) private _data: any, private commonService:CommonService,
  private organizationService:OrganizationService , public matDialogRef: MatDialogRef<AddfeatureComponent>,
   private store: Store<{ organization: any }>,
  ) 
  {
     this._unsubscribeAll = new Subject();
    this.action =_data.action;
    this.currentUser =  JSON.parse(JSON.stringify(_data.currentUser));
    this.dataProduct =  JSON.parse(JSON.stringify(_data.data));
    if(!this.dataProduct.features){
      this.dataProduct.features=[];
    }
    // this.productSearch();
    this.featureSearch();
    console.log(this.dataProduct);
   }
    
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
   featureSearch(){
    this.productsSearch=[];
      this.commonService.getFeatures()
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
          (response:any)=> {console.log(response);
            let data=JSON.parse(JSON.stringify(response));
            console.log(data);
            for(let i=0;i<data.length;i++){
            let index= this.dataProduct.features.indexOf(data[i].name)
            if(index!=-1){
              data[i].checkFlag=true;
            }
            else if (data[i].default) data[i].checkFlag = true;
            else{
             data[i].checkFlag=false;
            }
             this.productsSearch.push(data[i]);
            }
              
          }
      )
    
   }
  //  productSearch(){
  //    this.productsSearch=[];
  //    let obj={ocode:this.currentUser.ocode};
  //    this.productService.search(obj)
  //    .pipe(takeUntil(this._unsubscribeAll))
  //    .subscribe(response =>{
  //      let data=JSON.parse(JSON.stringify(response));
  //      console.log(data);
  //      for(let i=0;i<data.length;i++){
  //      let index= this.dataProduct.products.indexOf(data[i].pcode)
  //      if(index!=-1){
  //        data[i].checkFlag=true;
  //      }
  //      else{
  //       data[i].checkFlag=false;
  //      }
  //       this.productsSearch.push(data[i]);
  //      }
    
  //   },
  //      respError => {
  //          this.commonService.showSnakBarMessage(respError, 'error', 2000);
  //      })

  //  }

  checkProduct(name: any) {
    let index = this.dataProduct.features.indexOf(name)
    if (index != -1) {
      this.dataProduct.features.splice(index, 1);
    }
    else {
      this.dataProduct.features.push(name);
    }
  }

  onSave() {
    let obj = JSON.parse(JSON.stringify(this.dataProduct))
    this.organizationService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let data = JSON.parse(JSON.stringify(response));
        this.store.dispatch(updateOrganization({organization: data}));
        this.matDialogRef.close();
      },
        respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
  }
}
