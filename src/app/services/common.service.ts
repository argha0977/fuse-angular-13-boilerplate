import { Injectable, Inject } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  //private apiUrl = 'http://localhost:4006/api';//Local API
  private apiUrl = 'https://erp.sisx.in/vcrmapidev/api';//Dev API
  //private apiUrl = 'http://ecollect.myaastha.in/clapehrapidev/api';//Prod API
  private authorization = 'Bearer c29mdG1lZXRzdmVuZG9yQ1JNOkoxNzFUU2U1VA==';
  //For Sign up Link
  private appUrl = 'http://ecollect.myaastha.in/hrmpoc/#/';
  private appUrlSms = 'http%3A%2F%2Fecollect.myaastha.in%2F%23%2F';
  private otype = 'Company';

  private jsonUrl = 'assets/jsons';

  constructor(
     public snakBar: MatSnackBar,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public http: HttpClient
  ) { }


  /**
   * ***********************************************************************************
   * API URL Functions
   * ***********************************************************************************
   */
  getBaseUrl(): string {
    return this.apiUrl;
  }

  getAuthorization(): string {
    return this.authorization;
  }

  getAppUrl(): string {
    return this.appUrl;
  }

  getAppUrlSms(): string {
    return this.appUrlSms;
  }



  /**
   * ***********************************************************************************
   * Local Functions
   * ***********************************************************************************
   */

  findItem(array: any, key: string, value: string): number {
    for (let index = 0; index < array.length; index++) {
      if (array[index][key] === value) {
        return index;
      }
    }
    return -1;
  }

   showSnakBarMessage(message: string, type: string, duration: number, action?: string): void {
    this.snakBar.open(message, action, {
      duration: duration,
      panelClass: type
    });
  } 

  /**
   * ***********************************************************************************
   * Local/Session Storage Functions
   * ***********************************************************************************
   */

  setItem(key: string, value: any): void {
    this.storage.set(key, value);
  }

  getItem(key: string): any {
    const value = this.storage.get(key) || undefined;
    return value;
  }

  removeItem(key: string): void {
    this.storage.remove(key);
  }

  removeAll(): void {
    this.storage.clear();
  }

  getRandom(min:number,max:number){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * ***********************************************************************************
   * JSON Service Functions
   * ***********************************************************************************
   */

  getDefaultRole(): any {
     return this.http.get(this.jsonUrl + '/defaultroles.json')
      .pipe(map((response: Response) => response)) 
  }

  getPrivileges(): any {
     return this.http.get(this.jsonUrl + '/privileges.json')
      .pipe(map((response: Response) => response)) 
  }

  getFeatures(): any {
   return this.http.get(this.jsonUrl + '/features.json')
      .pipe(map((response: Response) => response)) 
  }

/**
 * ***********************************************************************************
 * Clear all store items
 * ***********************************************************************************
 */

  clearStore(): any {
    /* this.store.dispatch(new ClearAllUser(undefined));
    this.store.dispatch(new ClearAllRole(undefined)); */
  }
}


