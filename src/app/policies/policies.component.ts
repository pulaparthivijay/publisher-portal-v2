import { JsonPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit{

  securityPolTooltip="Implement all sorts of validations and user access control, from parameter compliance, to RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control) strategies."
  secReqPolicyToolTip="Policy. Example: hasQuerystring('q')"


  formGroupPolicies: FormGroup;
  jsonValue: any;
  endpointId: any;
    
  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  constructor(private formBuilder:FormBuilder, private endpointService:EndpointService,private route: ActivatedRoute){
    this.formGroupPolicies = this.formBuilder.group({
      securityReqPolicy: [null],
      secReqErrorStCode: [null],
      secReqErrorBody: [null],
      secReqErrorContentType: [null],
      securityResPolicy: [null],
      secResErrorStCode: [null],
      secResErrorBody: [null],
      secResErrorContentType: [null],
      jwtReqPolicy: [null],
      enableDebug: [false],
      autoJoinPolicies: [false],
      disableMacros: [false],
      resSchemaValErrorMsg: [null],
      resSchemaValErrorStCode: [null],
      secReqPolicyArrayValue: [[]],
      secResPolicyArrayValue: [[]],
      jwtReqPolicyArrayValue: [[]],
      isSpFilterActive:[false],
      isRequestSchValidatorActive:[false],
      isResponseSchValidatorActive:[false],
      
      reqJSONSchema:[JSON.stringify(this.jsonDataForReq, null, 2) ],
      resJSONSchema:[JSON.stringify(this.jsonDataForRes, null, 2) ]

    })
  }

  jsonDataForReq =
    {
      "type": "object",
      "required": [
        "number",
        "street_name",
        "street_type"
      ],
      "properties": {
        "number": {
          "type": "number"
        },
        "street_name": {
          "type": "string"
        },
        "street_type": {
          "type": "string",
          "enum": [
            "Street",
            "Avenue",
            "Boulevard"
          ]
        }
      }
    };

  jsonDataForRes = {
    "type": "object",
    "required": [
      "required_field_1",
      "required_field_2"
    ]
  }
    
  
  addParameter(fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    const fieldValue = this.formGroupPolicies.get(fieldName)?.value;
    if (fieldName) {
      if (fieldName === 'securityReqPolicy') {
        this.parameterArraySecReqPolicy.push(fieldValue);
        this.formGroupPolicies.get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
      }
      else if (fieldName === 'securityResPolicy') {
        this.parameterArraySecResPolicy.push(fieldValue);
        this.formGroupPolicies.get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
      }
      else if (fieldName === 'jwtReqPolicy') {
        this.parameterArrayJwtValReqPolicy.push(fieldValue);
        this.formGroupPolicies.get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
      }
      this.formGroupPolicies.get(fieldName)?.reset();
    }

  }

  removeParameter(index: number, fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
    if (fieldName === 'securityReqPolicy') {
      this.parameterArraySecReqPolicy.splice(index, 1);
      this.formGroupPolicies.get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
    }
    else if (fieldName === 'securityResPolicy') {
      this.parameterArraySecResPolicy.splice(index, 1);
      this.formGroupPolicies.get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
    }
    else if (fieldName === 'jwtReqPolicy') {
      this.parameterArrayJwtValReqPolicy.splice(index, 1);
      this.formGroupPolicies.get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
    }
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    // this.formGroupPolicies.patchValue({
    //   secReqPolicyArrayValue:this.formData?.extra_config?.["security/policies"]?.req?.policies,
    //   secReqErrorBody:this.formData?.extra_config?.["security/policies"]?.req?.error?.body,
    //   secReqErrorStCode:this.formData?.extra_config?.["security/policies"]?.req?.error?.status,
    //   // securityReqPolicy: [null],
    //   secReqErrorContentType:this.formData?.extra_config?.["security/policies"]?.req?.error?.content_type ,
    //   // securityResPolicy: [null],
    //   secResErrorStCode: this.formData?.extra_config?.["security/policies"]?.resp?.error?.status,
    //   secResErrorBody: this.formData?.extra_config?.["security/policies"]?.resp?.error?.body,
    //   secResErrorContentType: this.formData?.extra_config?.["security/policies"]?.resp?.error?.content_type,
    //   jwtReqPolicy: '',
    //   enableDebug: this.formData?.extra_config?.["security/policies"]?.debug,
    //   autoJoinPolicies: this.formData?.extra_config?.["security/policies"]?.auto_join_policies,
    //   disableMacros: this.formData?.extra_config?.["security/policies"]?.disable_macros,
    //   resSchemaValErrorMsg: this.formData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.error?.body,
    //   resSchemaValErrorStCode: this.formData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.error?.status,
    //   secResPolicyArrayValue: this.formData?.extra_config?.["security/policies"]?.resp?.policies,
    //   jwtReqPolicyArrayValue: this.formData?.extra_config?.["security/policies"]?.jwt?.policies,
    //   isSpFilterActive:!!this.formData?.extra_config?.["security/policies"],
    //   isRequestSchValidatorFiltrActive:!!this.formData?.extra_config?.["validation/json-schema"],
    //   isRequestSchValidatorActive:!!this.formData?.extra_config?.["plugin/req-resp-modifier"]?.name?.includes("response-schema-validator"),
    //   reqJSONSchema:this.formData?.extra_config?.["validation/json-schema"],
    //   resJSONSchema:this.formData?.extra_config?.["plugin/req-resp-modifier"]?.["response-schema-validator"]?.schema
    // })


  }

  submit(){    
    const body = {
      ...(this.formGroupPolicies.value?.isSpFilterActive && {
        "security/policies": {
          "req": {
            "policies": this.formGroupPolicies.value?.secReqPolicyArrayValue,
            "error": {
              "body": this.formGroupPolicies.value?.secReqErrorBody,
              "status": this.formGroupPolicies.value?.secReqErrorStCode,
              "content_type": this.formGroupPolicies.value?.secReqErrorContentType
            }
          },
          "resp": {
            "policies": this.formGroupPolicies.value?.secResPolicyArrayValue,
            "error": {
              "status": this.formGroupPolicies.value?.secResErrorStCode,
              "body": this.formGroupPolicies.value?.secResErrorBody,
              "content_type": this.formGroupPolicies.value?.secResErrorContentType
            }
          },
          "jwt": {
            "policies": this.formGroupPolicies.value?.jwtReqPolicyArrayValue
          },
          "debug": this.formGroupPolicies.value?.enableDebug,
          "auto_join_policies": this.formGroupPolicies.value?.autoJoinPolicies,
          "disable_macros": this.formGroupPolicies.value?.disableMacros
        }
      }),

      ...((this.formGroupPolicies.value?.isResponseSchValidatorActive) && {
        "plugin/req-resp-modifier": {
          "name": [
            this.formGroupPolicies.value?.isResponseSchValidatorActive && "response-schema-validator",
          ].filter(Boolean),
          ...(this.formGroupPolicies.value?.isResponseSchValidatorActive && {
            "response-schema-validator": {
              "error": {
                "status": this.formGroupPolicies.value?.resSchemaValErrorStCode,
                "body": this.formGroupPolicies.value?.resSchemaValErrorMsg
              },
              "schema": this.formGroupPolicies.value?.resJSONSchema ? JSON.parse(this.formGroupPolicies.value?.resJSONSchema) :null ,
            }
          }),
        }
      }),
      ...(this.formGroupPolicies.value?.isRequestSchValidatorActive &&{"validation/json-schema": this.formGroupPolicies.value?.reqJSONSchema ? JSON.parse(this.formGroupPolicies.value?.reqJSONSchema) :null}),
    };
    
    this.endpointService.addPolicies(this.endpointId, body).subscribe({
      next:(res)=>{
        console.log(res)
      },
      error:(err)=>{
        console.error(err)
      }
    })


  }

}
