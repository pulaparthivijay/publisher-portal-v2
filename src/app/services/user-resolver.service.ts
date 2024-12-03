// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserResolverService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { MainService } from './main.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class UserResolver implements Resolve<any> {
  constructor(private mainSer: MainService, private keycloak: KeycloakService) {}

  async resolve() {
    const token = this.keycloak.getKeycloakInstance().token;
    if (!token) {
      return null;
    }
    const userInfo: any = await this.keycloak.getKeycloakInstance().loadUserInfo();
    localStorage.setItem('userid', userInfo.sub);
    return this.mainSer.getUserDetails(userInfo.sub).toPromise();
  }
}

