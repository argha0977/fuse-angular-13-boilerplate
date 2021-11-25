import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { UserService } from 'app/services/user.service';
import { signin } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  id='';
  user={
    addedby: "",addedon: "",email: "",firstname: "",image: "",lastname: "",lastupdatedby: "",lastupdatedon: "",mobile: "",ocode: "",office:'',
    onetime: false,password: "",role: "",selected: false,status: "",userid: "",_id: '' ,imageURL:'' };
  coverUrl='';
  AboutmeFlag=false;
  About='Contact Info';
  postFlag=false;
  roles=[];
  postEdit={role:'',firstname:'',lastname:''};
  aboutEdit={email:'',mobile:''};
  currentUser:any;
  constructor(private activeRoute: ActivatedRoute, private userService:UserService,private commonService:CommonService ,   private store: Store<{ user: any }>,) 
  { 
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.currentUser= this.commonService.getItem('currentUser');
    this.activeRoute.params.subscribe(params => { console.log(params);
      if (params['id']) {
        this.id = params['id'];
        console.log(this.id );
        this.coverUrl='assets/images/pages/profile/'+ this.commonService.getRandom(1,30)+'.jpg';
        this.getCurrentUser();
        this.getDefaultRoles();
      }

        })
  }
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
  getCurrentUser(){
    this.userService.show(this.id) 
   .pipe(takeUntil(this._unsubscribeAll))
   .subscribe(response => {
    console.log(response);
    this.user=JSON.parse(JSON.stringify(response));
    if(this.user.image!=''){
      this.user.imageURL= this.userService.profilePic(this.user.image);
    }
  },
  respError => {
      this.commonService.showSnakBarMessage(respError, 'error', 2000);
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
           if(this.roles.length>0 && this.postFlag) {
            this.postEdit.role=this.roles[0].name; 
           }
        })
}
  editAboutMe(){
  this.About='Edit Contact';
  this.AboutmeFlag=true;
  this.aboutEdit=JSON.parse(JSON.stringify(this.user));
  }
  saveAboutMe(){
    let obj= JSON.parse(JSON.stringify(this.user));
    obj['email']=this.aboutEdit.email;
    obj['mobile']=this.aboutEdit.mobile;
    obj['cuserid']=this.currentUser.userid;
    delete obj.imageURL;
    this.userService.update(obj) 
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => {
     console.log(response);
     this.user=JSON.parse(JSON.stringify(response));
     if(this.user.image!=''){
      this.user.imageURL = this.userService.profilePic(this.user.image);
     }
     if(this.currentUser.userid==this.user.userid){
      this.commonService.setItem('currentUser', this.user);
      this.store.dispatch(signin({user: this.user}));
    }
     this.About='Contact Info';
     this.AboutmeFlag=false;
   },
   respError => {
       this.commonService.showSnakBarMessage(respError, 'error', 2000);
   })
   
  }
  editPost(){
  this.postFlag=true;
  this.postEdit=JSON.parse(JSON.stringify(this.user));
  }
  savePost(){
    let obj= JSON.parse(JSON.stringify(this.user));
    obj['role']=this.postEdit.role;
    obj['firstname']=this.postEdit.firstname;
    obj['lastname']=this.postEdit.lastname;
    obj['cuserid']=this.currentUser.userid;
    delete obj.imageURL;
    this.userService.update(obj) 
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => {
     console.log(response);
     this.user=JSON.parse(JSON.stringify(response));
     if(this.currentUser.userid==this.user.userid){
      this.commonService.setItem('currentUser', this.user);
      this.store.dispatch(signin({user: this.user}));
    }
     if(this.user.image!=''){
      this.user.imageURL = this.userService.profilePic(this.user.image);
     }
   
     
     this.postFlag=false;
   },
   respError => {
       this.commonService.showSnakBarMessage(respError, 'error', 2000);
   })
    
  }
  onFileSelect(files: FileList) {
    if (files.length > 0) {
        let fileItem = files.item(0);
        let formData = new FormData();
        formData.append('file', fileItem, fileItem.name);
        for (let key in this.user) {
            if (key != 'imageURL') {
                formData.append(key, this.user[key]);
            }
        }
        this.userService.upload(formData)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(response => {console.log(response);
                let user = JSON.parse(JSON.stringify(response));
                this.user.image = user.image;
                if(this.user.image!=''){
                  this.user.imageURL = this.userService.profilePic(this.user.image);
                 }
                if(this.currentUser.userid==this.user.userid){
                  this.commonService.setItem('currentUser', this.user);
                  this.store.dispatch(signin({user: this.user}));
                }
              
                
            }, respError => {
                this.commonService.showSnakBarMessage(respError, 'error', 2000);
            });
    }

}

}
