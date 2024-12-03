import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-creategateway',
  templateUrl: './creategateway.component.html',
  styleUrl: './creategateway.component.css'
})
export class CreategatewayComponent {

  formGroupGateway:FormGroup;

  constructor(private formBuilder: FormBuilder,private mainService:MainService,private router:Router,private communicationSer:CommunicationService){
    this.formGroupGateway = this.formBuilder.group({
      gatewayName:[null],
      port:[null],
      host:[null]
    })
  }
  submitForm(){
    console.log(this.formGroupGateway.value);
    const createGatewayBody={
      "name": this.formGroupGateway?.get("gatewayName")?.value,
        "port": this.formGroupGateway?.get("port")?.value,
        "host":[ this.formGroupGateway?.get("host")?.value],
    }
    if(this.formGroupGateway.valid){
      this.mainService.createGateway(createGatewayBody).subscribe({
        next:(res =>{
            console.log(res);
            this.communicationSer.emitGatewayCreated(res)
            this.router.navigate(['gateways'],{ replaceUrl: true })
        }),
        error:(err=>{

        })
      })
    }
  }

}
