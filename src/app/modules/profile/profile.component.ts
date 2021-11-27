import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private _router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
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
    this.AboutmeFlag = true;
    this.aboutEdit = JSON.parse(JSON.stringify(this.user));
  }
  
  saveAboutMe() {
    let obj = JSON.parse(JSON.stringify(this.user));
    obj['email'] = this.aboutEdit.email;
    obj['mobile'] = this.aboutEdit.mobile;
    obj['cuserid'] = this.currentUser.userid;
    delete obj.imageURL;
    this.userService.update(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        this.user = JSON.parse(JSON.stringify(response));
        if (this.currentUser.userid == this.user.userid) {
          this.currentUser .email = this.aboutEdit.email;
          this.currentUser.mobile = this.aboutEdit.mobile;
          this.commonService.setItem('currentUser', this.currentUser);
          this.store.dispatch(signin({ user: this.currentUser }));
        }
        this.user.imageURL = this.userService.profilePic(this.user.image);

        this.About = 'Contact Info';
        this.AboutmeFlag = false;
      },
        respError => {
          this.commonService.showSnakBarMessage(respError, 'error', 2000);
        })

  }

  editPost() {
    this.postFlag = true;
    this.postEdit = JSON.parse(JSON.stringify(this.user));
  }

  savePost() {
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

}
