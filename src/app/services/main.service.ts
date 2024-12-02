import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http:HttpClient) { }
userId=localStorage.getItem('userid')
  getUserDetails(userId:any){
    const url=urls.getUser;
    const headers={
      'userId':userId
    }
    const options={headers:headers}
    return this.http.post(url,null,options)
  }

  getEndpointCards(){
    const url=urls.getEndpointCards+"?pageNo=0&pageSize=10";
    const headers={
      'userId':this.userId
    }
    const options:any={headers:headers}
    return this.http.post(url,null,options)
  }

  getCards(){
      const url=urls.getJsonCards+"?pageNo=0&pageSize=10";
      const headers={
        'userId':this.userId
      }
      const options:any={headers:headers}
      return this.http.post(url,null,options)
    }
}
