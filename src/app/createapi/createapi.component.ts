import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MainService } from '../services/main.service';
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-createapi',
  templateUrl: './createapi.component.html',
  styleUrl: './createapi.component.css'
})
export class CreateapiComponent {


  formGroupEndPoint: FormGroup;
  receivedData: any;


  constructor(private formBuilder: FormBuilder,private mainService:MainService,private router:Router,private communicationSer:CommunicationService) {
    this.formGroupEndPoint = this.formBuilder.group({
      apiName: [null],
      endpoint: [null, [Validators.required]],
      method: [null],
      output_encoding: [null],
      host: [null],
      backendMethod: [null],
      encoding: [null],
      url_pattern: [null],
      is_collection:[false]
    })
  }

  submitForm() {
    // console.log(this.formGroupEndPoint.get("apiName")?.value);
    if (this.formGroupEndPoint.valid) {
      console.log(this.formGroupEndPoint.value);
      const createApiBody = {
        "apiName": this.formGroupEndPoint.get("apiName")?.value,
        "endpoint": this.formGroupEndPoint.get("endpoint")?.value,
        "method": this.formGroupEndPoint.get("method")?.value,
        "output_encoding": this.formGroupEndPoint.get("output_encoding")?.value,
        "backend": [
          {
            "method": this.formGroupEndPoint.get("backendMethod")?.value,
            "url_pattern": this.formGroupEndPoint.get("url_pattern")?.value,
            "encoding": this.formGroupEndPoint.get("encoding")?.value,
            "host": [
              this.formGroupEndPoint.get("host")?.value
            ],
            "is_collection": this.formGroupEndPoint?.get("is_collection")?.value,

          }
        ]

      }
      console.log(createApiBody);
      this.mainService.createEndpoint(createApiBody).subscribe({
        next:(res =>{
            console.log(res);
            this.communicationSer.emitApiCreated(res)
            this.router.navigate(['apis'],{ replaceUrl: true })
        }),
        error:(err=>{

        })
      })


    }
  }

}
