import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  baseUrl = '';
  authorization = '';

  constructor(public http: HttpClient, public commonService: CommonService) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
  }
  create(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/create', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  update(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/update', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  delete(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/delete', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  count(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/count', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  search(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/search', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  countries(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/countries', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  states(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/states', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  cities(organization: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/cities', organization, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  showByCode(ocode: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.get(this.baseUrl + '/organization/showByCode/' + ocode, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandler)
    )
  }
  orgLogo(file: string) {
    if (!file) {
      file = 'nouser.png';
    }
    return this.baseUrl + '/organization/orgLogo/' + file;
  }
  upload(file: FormData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/organization/upload', file, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  errorHandler(error: Response) {
    console.log(error);
    let message = (error['error']) ? ((error['error'].error) ? error['error'].error : error['message']) : error['message'];
    console.log(message);
    return throwError(message || 'Remote server unreachable. Please check your Internet connection.');
  }
}
