import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http:HttpClient) { }

  getUserDetails(userId:any){
    const url=urls.getUser;
    const headers={
      'userId':userId
    }
    const options={headers:headers}
    return this.http.post(url,null,options)
  }
}
