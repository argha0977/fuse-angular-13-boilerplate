import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonService } from 'app/services/common.service';
import { OrganizationService } from 'app/services/organization.service';
import { UserService } from 'app/services/user.service';
import { signin, updateUser } from 'app/store/actions/user.actions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;

  Id = '';
  user = {
    addedby: "", addedon: "", email: "", firstname: "", image: "", lastname: "", lastupdatedby: "", lastupdatedon: "", mobile: "", ocode: "", office: '',
    onetime: false, password: "", role: "", selected: false, status: "", userid: "", _id: '', imageURL: ''
  };
  coverUrl = '';
  AboutmeFlag = false;
  About = 'Contact Info';
  postFlag = false;
  roles = [];
  postEdit = { role: '', firstname: '', lastname: '' };
  aboutEdit = { email: '', mobile: '' };
  currentUser: any;
  userFlag = false;
  homeFlag=true;
  organizationFlag=false;

  organizations={address: "", city: "", createdon: "",email: "",expireon: "", features: [],lastupdatedby: "",
  lastupdatedon: "", logo: "",ocode: "",oname: "", otype: "", country:'',state:'',phone: "",pin: "", status: "",_id: "", imageURL: ''};
  orgAboutmeFlag = false;
  orgpostFlag = false;
  aboutorg='Contact Info';
  orgaboutEdit = { email: '', phone: '', oname: "", };
  orgpostEdit = { city: "", address: "", pin: "", country:'',state:'',};
  countries=[];
  states = [];
  saving = false;
  constructor(private _router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private organizationService: OrganizationService,
    private store: Store<{ user: any }>
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getUserFromStore();
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.Id = params['id'];
        this.coverUrl = 'assets/images/pages/profile/' + this.commonService.getRandom(1, 30) + '.jpg';
        this.getUser();
        this.getDefaultRoles();
      }
      if (params['from'] == 'users') {
        this.userFlag = true;
      }
      this.getShowbyCode();
      this.getCountries();
    })
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  async getUserFromStore() {
    this.store.select('user')
      .subscribe(response => {
        if (response.user) {
          this.currentUser = JSON.parse(JSON.stringify(response.user));
        }
        else this.getUserFromStorage();
      })

  }

  getUserFromStorage() {
    let user = this.commonService.getItem('currentUser');
    if (user) this.store.dispatch(signin({ user: user }));
  }


  back2list() {
    this._router.navigate(['/users']);
  }

  getUser() {
    this.userService.show(this.Id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.user = JSON.parse(JSON.stringify(response));
        this.user.imageURL = this.userService.profilePic(this.user.image);
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
        if (this.user.role == 'APPUSER') defaultRoles.splice(0, 1);
        else if (this.user.role != 'APPADMIN') defaultRoles.splice(0, 2);
        for (let i = 0; i < defaultRoles.length; i++) {
          this.roles.push(defaultRoles[i]);
        }
        if (this.roles.length > 0 && this.postFlag) {
          this.postEdit.role = this.roles[0].name;
        }
      })
  }

  editAboutMe() {
    this.About = 'Edit Contact';
    this.postFlag = false;
    this.AboutmeFlag = true;
    this.aboutEdit = JSON.parse(JSON.stringify(this.user));
  }

  saveAboutMe() {
    this.saving = true;
    if (!this.aboutEdit.email) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter email', 'error', 2000);
      return;
    }

    if (!this.aboutEdit.mobile) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter mobile number', 'error', 2000);
      return;
    }


    let splitted = this.aboutEdit.email.trim().split(' ');
    if(splitted.length > 1) {
      // this.saving = false;
      this.commonService.showSnakBarMessage('Please enter email in correct format', 'error', 2000);
      return;
    }
    let epattern = /[A-Za-z0-9._%+-]{1,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
    if (!epattern.test(this.aboutEdit.email)) {
      // this.saving = false;
      this.commonService.showSnakBarMessage('Please enter email  in correct format', 'error', 2000);
      return;
    }
    if (this.aboutEdit.mobile.trim() == '') {
      // this.saving = false;
      this.commonService.showSnakBarMessage('Please enter mobile number ', 'error-toast', 2000);
      return;
    }
    let mpattern = /(^\d{10}$)/;
    if (!mpattern.test(this.aboutEdit.mobile)) {
      // this.saving = false;
      this.commonService.showSnakBarMessage('Please enter mobile number in correct format', 'error', 2000);
      return;
    }




    let obj = JSON.parse(JSON.stringify(this.user));
    obj['email'] = this.aboutEdit.email;
    obj['mobile'] = this.aboutEdit.mobile;
    obj['cuserid'] = this.currentUser.userid;
    delete obj.imageURL;
    this.userService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let user = JSON.parse(JSON.stringify(response));
        this.user = JSON.parse(JSON.stringify(response));
        this.saving = false;
        this.store.dispatch(updateUser({ user: user }));
        if (this.currentUser.userid == this.user.userid) {
          this.currentUser.email = this.aboutEdit.email;
          this.currentUser.mobile = this.aboutEdit.mobile;
          this.commonService.setItem('currentUser', this.currentUser);
          this.store.dispatch(signin({ user: this.currentUser }));
        }
        this.user.imageURL = this.userService.profilePic(this.user.image);

        this.About = 'Contact Info';
        this.AboutmeFlag = false;
      },
        respError => {
          this.saving = false;
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })

  }

  editPost() {
    this.postFlag = true;
    this.AboutmeFlag = false;
    this.postEdit = JSON.parse(JSON.stringify(this.user));
  }

  savePost() {
    this.saving = true;
    if (!this.postEdit.firstname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter first name', 'error', 2000);
      return;
    }

    if (!this.postEdit.lastname) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter last name', 'error', 2000);
      return;
    }
    let obj = JSON.parse(JSON.stringify(this.user));
    obj['role'] = this.postEdit.role;
    obj['firstname'] = this.postEdit.firstname;
    obj['lastname'] = this.postEdit.lastname;
    obj['cuserid'] = this.currentUser.userid;
    delete obj.imageURL;
    this.userService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.user = JSON.parse(JSON.stringify(response));
        let user = JSON.parse(JSON.stringify(response));
        this.store.dispatch(updateUser({ user: user }));
        if (this.currentUser.userid == this.user.userid) {
          this.currentUser['firstname'] = this.postEdit.firstname;
          this.currentUser['lastname'] = this.postEdit.lastname;
          this.commonService.setItem('currentUser', this.currentUser);
          this.store.dispatch(signin({ user: this.currentUser }));
        }
        this.user.imageURL = this.userService.profilePic(this.user.image);
        this.postFlag = false;
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
        .subscribe(response => {
          let user = JSON.parse(JSON.stringify(response));
          this.user.image = user.image;
          this.store.dispatch(updateUser({ user: user }));
          this.user.imageURL = this.userService.profilePic(this.user.image);
          if (this.currentUser.userid == this.user.userid) {
            this.currentUser.image = user.image;
            this.commonService.setItem('currentUser', this.currentUser);
            this.store.dispatch(signin({ user: this.user }));
          }
        }, respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        });
    }

  }
  home(){
    this.organizationFlag=false;
    this.homeFlag=true;
    this.postFlag = false;
    this.AboutmeFlag = false;
    this.orgAboutmeFlag = false;
    this.orgpostFlag = false;
  }
  organization(){
   this.organizationFlag=true;
   this.homeFlag=false;
   this.orgAboutmeFlag = false;
   this.orgpostFlag = false;
   this.postFlag = false;
    this.AboutmeFlag = false;
  }
  cancel(){
    this.postFlag = false;
    this.AboutmeFlag = false;
    this.postEdit = { role: '', firstname: '', lastname: '' };
    this.aboutEdit = { email: '', mobile: '' };
    this.About = 'Contact Info';
  }


  //organization

  getShowbyCode(){
    this.organizationService.showByCode(this.currentUser.ocode)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(response => {console.log(response);
    this.organizations=JSON.parse(JSON.stringify(response));
    this.organizations.imageURL= this.organizationService.orgLogo(this.organizations.logo);
    },
      respError => {
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
      })
  }
  cancelorg(){
    this.aboutorg='Contact Info';
     this.orgaboutEdit = { email: '', phone: '',oname:'' };
    this.orgAboutmeFlag = false;
    this.orgpostFlag = false;
    this. orgpostEdit = { city: "", address: "", pin: "", country:'',state:'',};

  }
  editOrgAboutMe(){
    this.aboutorg = 'Edit Contact';
    this.orgAboutmeFlag = true;
    this.orgpostFlag = false;
    this.orgaboutEdit = JSON.parse(JSON.stringify(this.organizations));
  }
  saveOrgAboutMe(){

    this.saving = true;
    if (!this.orgaboutEdit.oname) {
        this.saving = false;
        this.commonService.showSnakBarMessage('Please enter organization name', 'error', 2000);
        return;
      }
      if (!this.orgaboutEdit.phone) {
        this.saving = false;
        this.commonService.showSnakBarMessage('Please enter mobile number', 'error', 2000);
        return;
      }

      if (!this.orgaboutEdit.email) {
        this.saving = false;
        this.commonService.showSnakBarMessage('Please enter email', 'error', 2000);
        return;
      }
  

    let splitted = this.orgaboutEdit.email.trim().split(' ');
    if(splitted.length > 1) {
      this.commonService.showSnakBarMessage('Please enter email in correct format', 'error', 2000);
      return;
    }
    let epattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!epattern.test(this.orgaboutEdit.email)) {
      this.commonService.showSnakBarMessage('Please enter email  in correct format', 'error', 2000);
      return;
    }
    if (this.orgaboutEdit.phone.trim() == '') {
      this.commonService.showSnakBarMessage('Please enter mobile number ', 'error', 2000);
      return;
    }
    let mpattern = /(^\d{10}$)/;
    if (!mpattern.test(this.orgaboutEdit.phone)) {
      this.commonService.showSnakBarMessage('Please enter mobile number in correct format', 'error', 2000);
      return;
    }

    let obj = JSON.parse(JSON.stringify(this.organizations));
    obj['email'] = this.orgaboutEdit.email;
    obj['phone'] = this.orgaboutEdit.phone;
    obj['userid'] = this.currentUser.userid;
    obj['oname'] = this.orgaboutEdit.oname;
    delete obj.imageURL;
    this.organizationService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let organizations = JSON.parse(JSON.stringify(response));
        this.organizations = JSON.parse(JSON.stringify(organizations));
        this.organizations.imageURL = this.organizationService.orgLogo(this.organizations.logo);
        this.aboutorg = 'Contact Info';
        this.orgAboutmeFlag = false;
      },
        respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
  }
  editorgPost(){
    this.aboutorg = 'Contact Info';
    this.orgAboutmeFlag = false;
    this.orgpostFlag = true;
    this.orgpostEdit = JSON.parse(JSON.stringify(this.organizations));
  }
  saveorgPost(){
    this.saving=true
    let ppattern = /(^\d{6}$)/;
    if (!ppattern.test(this.orgpostEdit.pin)) {
      this.saving = false;
      this.commonService.showSnakBarMessage('Please enter pincode in correct format', 'error', 2000);
      return;
    }
    let obj = JSON.parse(JSON.stringify(this.organizations));
    obj['address'] = this.orgpostEdit.address;
    obj['pin'] = this.orgpostEdit.pin;
    obj['userid'] = this.currentUser.userid;
    obj['city'] = this.orgpostEdit.city;
    obj['country'] = this.orgpostEdit.country;
    obj['state'] = this.orgpostEdit.state;
    delete obj.imageURL;
    this.organizationService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        let organizations = JSON.parse(JSON.stringify(response));
        this.organizations = JSON.parse(JSON.stringify(organizations));
        this.organizations.imageURL = this.organizationService.orgLogo(this.organizations.logo);
        this.orgpostFlag = false;
      },
        respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })
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
              if(!this.organizations.country){
              this.orgpostEdit.country='India';
              }

              this.onSelect();
            }
            
        }
    )
  }
  
  onSelect(){
    let index = this.commonService.findItem(this.countries, 'name', this.orgpostEdit.country);
    if(index >= 0) {
        if(this.countries[index].states) {
            this.states = this.countries[index].states;
        }
        else this.states = [];
    }
    else this.states = [];
    if(this.states.length > 0) {
      if(!this.organizations.state){
        this.orgpostEdit.state = this.countries[index].states[0].name;
      }
    }
    else {
      if(!this.organizations.state){
      this.orgpostEdit.state = '';
      }
    }
  }
  onFileSelect1(files: FileList) {
    if (files.length > 0) {
      let fileItem = files.item(0);
      let formData = new FormData();
      formData.append('file', fileItem, fileItem.name);
      for (let key in this.organizations) {
        if (key != 'imageURL') {
          formData.append(key, this.organizations[key]);
        }
      }
      this.organizationService.upload(formData)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(response => {
          let organizations = JSON.parse(JSON.stringify(response));
          this.organizations.logo = organizations.logo;
          // this.store.dispatch(updateUser({ user: user }));
          this.organizations.imageURL = this.organizationService.orgLogo(this.organizations.logo);
         
        }, respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        });
    }

  }
}
