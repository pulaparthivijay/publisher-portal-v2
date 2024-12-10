import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urls } from '../../urls';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {

  constructor(private http:HttpClient) { }

  addParameterForwarding(endpointId:any, body:any){
    const url = urls.addParametersByEndpoint+`?endpointId=${endpointId}`;
    // const headers = {
    //   "endpointId":endpointId
    // }
    // const options:any = {
    //   headers:headers
    // }
    return this.http.post(url, body);
  }

  addThrottling(endpointId:any,body:any){
    const url = urls.addThrottling+`?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  addPolicies(endpointId:any,body:any){
    const url = urls.addPolicies+`?endpointId=${endpointId}`;
    return this.http.post(url, body);
  }

  getEndpointById(endpointId:any){
    const url = urls.getEndpoint+`?endpointId=${endpointId}`;
    return this.http.get(url);
  }

}
