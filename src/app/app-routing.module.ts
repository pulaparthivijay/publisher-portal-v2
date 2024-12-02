import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApicardsComponent } from './apicards/apicards.component';
import { GatewaycardsComponent } from './gatewaycards/gatewaycards.component';
import { CreateapiComponent } from './createapi/createapi.component';
import { ViewapiComponent } from './viewapi/viewapi.component';
import { ApiOverviewComponent } from './api-overview/api-overview.component';
import { ParameterForwardingComponent } from './parameter-forwarding/parameter-forwarding.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {path:"apis",component:ApicardsComponent,children:[
    {path:"createapi",component:CreateapiComponent},
    {path:"viewapi",component:ViewapiComponent,children:[
      {path:"overview",component:ApiOverviewComponent},
      {path:"parameter",component:ParameterForwardingComponent},
      {path:"auth",component:AuthComponent},

    ]}
  ]},
  {path:"gateways",component:GatewaycardsComponent},
  { path: '', redirectTo: '/apis', pathMatch: 'full' }
  // {path:"gateways",component:GatewaycardsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
