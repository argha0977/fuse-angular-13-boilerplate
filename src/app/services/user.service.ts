import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = '';
  authorization = '';

  constructor(public http: HttpClient, public commonService: CommonService) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
  }

  signin(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/signin', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  signout(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/signout', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  verifyToken(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization,
        'user-token': user.usertoken
      })
    };
    return this.http.get(this.baseUrl + '/user/verifyToken', httpOptions);
  }

  errorHandler(error: Response) {
    console.log(error);
    let message = (error['error']) ? ((error['error'].error) ? error['error'].error : error['message']) : error['message'];
    console.log(message);
    return throwError(message || 'Remote server unreachable. Please check your Internet connection.');
  }
}
