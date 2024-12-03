import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }
  private apiCreatedSource = new Subject<any>();

  apiCreated$ = this.apiCreatedSource.asObservable();

  emitApiCreated(data: any) {
    this.apiCreatedSource.next(data);
  }
  private gatewayCreatedSource = new Subject<any>();

  gatewayCreated$ = this.gatewayCreatedSource.asObservable();

  emitGatewayCreated(data: any) {
    this.gatewayCreatedSource.next(data);
  }
}
