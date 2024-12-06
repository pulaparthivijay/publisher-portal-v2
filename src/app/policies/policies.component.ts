import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private formBuilder:FormBuilder){
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
    
  readonly panelOpenState = signal(false);
  
  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  
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

  }

}
