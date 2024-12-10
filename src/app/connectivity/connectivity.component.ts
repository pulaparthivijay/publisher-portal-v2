import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrl: './connectivity.component.css'
})
export class ConnectivityComponent implements OnInit{

  conCallsToolTip="The concurrent requests are an excellent technique to improve the response times and decrease error rates by requesting in parallel the same information multiple times."
  seqProxyTooltip="Calls backends sequentially instead of in parallel, so you can inject data from a previous call in the url_pattern of the next call. injecting variables like {resp0_XXXX} where 0 is the index of the backend and XXXX the attribute. E.g: {resp1_hotel_id} takes the field hotel_id from the first backend call (index starts at 0)."

  queryParams: any;
  parameterHeader: any;
  formGroup1: FormGroup;
  parameterArray: any = [];

  constructor(private formBuilder: FormBuilder) {
    this.formGroup1 = this.formBuilder.group({
      inputHeader: [null],
      concurrentCalls: [null],
      backoffStrategy: [null],
      readBufferSize: ['', Validators.required],
      writeWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      maxRetries: ['', Validators.required],
      messageBufferSize: ['', Validators.required],
      writeBufferSize: ['', Validators.required],
      maxWriteBufferSize: ['', Validators.required],
      pongWait: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      inputHeaderArray: [[]],
      connectEvent: [false],
      disconnectEvent: [false],
      returnErr: [false],
      isWebSocketActive: [false], // Initially false
      isSequencialActive: [false],
    })
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  addParameter() {
    const queryParamsValue = this.formGroup1.get('inputHeader')?.value;

    if (queryParamsValue) {
      this.parameterArray.push(queryParamsValue);
      this.formGroup1.get('inputHeaderArray')?.setValue([...this.parameterArray]);
      this.formGroup1.get('inputHeader')?.reset();
    }
  }

  removeParameter(index: number) {
    this.parameterArray.splice(index, 1);
    this.formGroup1.get('inputHeaderArray')?.setValue([...this.parameterArray]);
  }



}
