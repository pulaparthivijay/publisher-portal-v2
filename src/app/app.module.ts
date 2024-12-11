import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavbarComponent } from './sidenavbar/sidenavbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApicardsComponent } from './apicards/apicards.component';
import { GatewaycardsComponent } from './gatewaycards/gatewaycards.component';
import { CreateapiComponent } from './createapi/createapi.component';
import { ViewapiComponent } from './viewapi/viewapi.component';
import { ApiOverviewComponent } from './api-overview/api-overview.component';
import { ParameterForwardingComponent } from './parameter-forwarding/parameter-forwarding.component';
import { AuthComponent } from './auth/auth.component';
import { KeycloakService } from 'keycloak-angular';
import { AuthInterceptor } from './auth.interceptor';
import { DeploymentComponent } from './deployment/deployment.component';
import { CreategatewayComponent } from './creategateway/creategateway.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ViewgatewayComponent } from './viewgateway/viewgateway.component';
import { GatewayDashboardComponent } from './gateway-dashboard/gateway-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BackendComponent } from './backend/backend.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import { ThrottlingComponent } from './throttling/throttling.component';
import { PoliciesComponent } from './policies/policies.component';
import { ResponseManipulationComponent } from './response-manipulation/response-manipulation.component';
import { ConnectivityComponent } from './connectivity/connectivity.component';
import { OpenapiComponent } from './openapi/openapi.component';
import { ServiceSettingsComponent } from './service-settings/service-settings.component';

// keycloak
function initializeKeycloak(keycloak: KeycloakService){
  return () =>{
   
    keycloak.init({
      config: {
        realm: 'master',
        url: 'http://localhost:8080/',
        clientId: 'publisherportal',
       
       
      },
       initOptions: {
        onLoad: 'login-required',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        flow:'implicit',
      },
       enableBearerInterceptor:true,
       loadUserProfileAtStartUp:true,
       
       
    });
 
  }
   
   
}
@NgModule({
  declarations: [
    AppComponent,
    SidenavbarComponent,
    ApicardsComponent,
    GatewaycardsComponent,
    CreateapiComponent,
    ViewapiComponent,
    ApiOverviewComponent,
    ParameterForwardingComponent,
    AuthComponent,
    DeploymentComponent,
    CreategatewayComponent,
    ViewgatewayComponent,
    GatewayDashboardComponent,
    BackendComponent,
    ThrottlingComponent,
    PoliciesComponent,
    ResponseManipulationComponent,
    ConnectivityComponent,
    OpenapiComponent,
    ServiceSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    HttpClientModule,
    // NgbModule,
    MatTooltipModule,
    NgbModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatExpansionModule,
    MatSlideToggleModule
    
  ],
  providers: [KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimationsAsync()
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
