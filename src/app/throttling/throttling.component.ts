import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EndpointService } from '../services/endpoint.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-throttling',
  templateUrl: './throttling.component.html',
  styleUrl: './throttling.component.css'
})
export class ThrottlingComponent implements OnInit {
  formGroupThrottling: FormGroup;

  ipFilterTooltip = 'The IP filtering plugin allows you to restrict the traffic to your API gateway based on the IP address. It works in two different modes (allow or deny) where you define the list of IPs (CIDR blocks) that are authorized to use the API, or that are denied from using the API.'
  timeoutTooltip = "Maximum time you'll wait for the slowest response"
  cacheTootip = "For how long a proxy can cache a request to this endpoint"
  cidrTooltip = "  The CIDR blocks (list of IPs) you want to allow or deny. Examples: 192.168.0.0/24, 172.17.2.56/32, 127.0.0.1"
  trustedProxTooltip = "A custom list of all the recognized machines/balancers that proxy the client to your application. This list is used to avoid spoofing when trying to get the real IP of the client."
  clientIPAddTooltip = "A custom ordered list of all headers that might contain the real IP of the client. The first matching IP in the list will be used"
  allowTooltip = "Check to only allow connections in the CIDR list. Uncheck to deny all IPs from the list."
  rateLimitTooltip = "Maximum requests you want to let this endpoint handle in the specified time (every). Leave 0 for no default limit."
  everyTooltip = "Time window where this rate limit applies."
  capacityTooltip = "Number of tokens you can store in the Token Bucket. Traduces into maximum concurrent requests this endpoint will accept for all users."
  userQuotaTooltip = "Maximum requests per second you want to allow to each different API user. This value will be used as default for all the endpoints unless overridden in each of them. Use 0 for no limitation."
  clientCapacityTooltip = "Number of tokens you can store in the Token Bucket for each individual user. Traduces into maximum concurrent requests this endpoint will accept for the connected user."
  endpointRateTooltip = "Limits the number of requests this endpoint can receive"
  tokenizerFieldTooltip = "A custom field that contains the tokenizer (e.g., extracting the token from a custom header other than Authorization or using a claim from a JWT other than jti)"
  tokenizerTooltip = "The strategy to define users. How do you identify a user?"
  burstTooltip = "How many requests a client can make above the rate specified during a peak"
  periodTooltip = "Time window on which the counters take effect."
  rateTooltip = "Number of allowed requests during the observed period."
  addressTooltip = "The host and port where your redis is using the format host:port, e.g.: redis:6379"
  redisTooltip = "The global rate limit functionality enables a Redis database store to centralize all KrakenD node counters. Instead of having each KrakenD node count its hits, the counters are global and stored in the database."


  cidrArray: any[] = [];
  trustedProxiesArray: any[] = [];
  clientIPHeadersArray: any[] = [];
  endpointId: any;

  constructor(private formBuilder: FormBuilder, private endpointService: EndpointService, private route: ActivatedRoute) {
    this.formGroupThrottling = this.formBuilder.group({
      timeout: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      cacheTtl: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      cidr: [''],
      cidrArrayValue: [[]],
      trustedProxies: [''],
      trustedProxiesArrayValue: [[]],
      clientIpHeaders: [''],
      clientIPHeadersArrayValue: [[]],
      allowModeActive: [false],
      rateLimit: ['', Validators.required],
      every: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      capacity: [''],
      defaultUserQuota: [''],
      clientCapacity: [''],
      address: [''],
      rate: ['', Validators.required],
      periods: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      burst: ['', Validators.required],
      tokenizer: [''],
      tokenizerField: [''],
      isIpFilterActive: [false],
      isEndPointRateLimitEnabledActive: [false],
      isRedisRateLimitEnabledActive: [false]
    })
  }

  ngOnInit(): void {

    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });

    this.endpointService.getEndpointById(this.endpointId).subscribe({
      next: (res) => {
        console.log(res)
        const data: any = res;

        // this.parameterArray= data?.input_query_strings;
        // this.parameterHeaderArray=data?.input_headers
        // this.parameterForm.patchValue({
        //   input_parameter: '',
        //   input_header: '',
        //   input_query_strings:data?.input_query_strings,
        //   input_headers:data?.input_headers
        // })
      }
    })
  }

  addParameter(fieldName: 'cidr' | 'trustedProxies' | 'clientIpHeaders') {
    const fieldValue = this.formGroupThrottling.get(fieldName)?.value;

    if (fieldName) {
      if (fieldName === 'cidr') {
        this.cidrArray.push(fieldValue);
        this.formGroupThrottling.get('cidrArrayValue')?.setValue([...this.cidrArray])

      } else if (fieldName === 'trustedProxies') {
        this.trustedProxiesArray.push(fieldValue);
        this.formGroupThrottling.get('trustedProxiesArrayValue')?.setValue([...this.trustedProxiesArray])


      } else if (fieldName === 'clientIpHeaders') {
        this.clientIPHeadersArray.push(fieldValue);
        this.formGroupThrottling.get('clientIPHeadersArrayValue')?.setValue([...this.clientIPHeadersArray])

      }

      this.formGroupThrottling.get(fieldName)?.reset();
    }
  }

  removeParameter(index: any, fieldName: 'cidr' | 'trustedProxies' | 'clientIpHeaders') {
    if (fieldName === 'cidr') {
      this.cidrArray.splice(index, 1);
      this.formGroupThrottling.get('cidrArrayValue')?.setValue([...this.cidrArray]);
    } else if (fieldName === 'trustedProxies') {
      this.trustedProxiesArray.splice(index, 1);
      this.formGroupThrottling.get('trustedProxiesArrayValue')?.setValue([...this.trustedProxiesArray]);

    } else if (fieldName === 'clientIpHeaders') {
      this.clientIPHeadersArray.splice(index, 1);
      this.formGroupThrottling.get('clientIPHeadersArrayValue')?.setValue([...this.clientIPHeadersArray])
    }

  }


  submit() {
    console.log(this.formGroupThrottling.value);

    const body = {
      "throttling":{
      ...(this.formGroupThrottling.value?.isEndPointRateLimitEnabledActive && {
        "qos/ratelimit/router": {
          ...(this.formGroupThrottling.value?.rateLimit && { "max_rate": this.formGroupThrottling.value?.rateLimit }),
          ...(this.formGroupThrottling.value?.defaultUserQuota && { "client_max_rate": this.formGroupThrottling.value?.defaultUserQuota }),
          "strategy": "ip",
          ...(this.formGroupThrottling.value?.capacity && { "capacity": this.formGroupThrottling.value?.capacity }),
          ...(this.formGroupThrottling.value?.every && { "every": this.formGroupThrottling.value?.every }),
          ...(this.formGroupThrottling.value?.clientCapacity && { "client_capacity": this.formGroupThrottling.value?.clientCapacity })
        }
      }),
      ...(this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && {
        "plugin/http-server": {
          "name": [
            this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && "redis-ratelimit"
          ].filter(Boolean),
          ...(this.formGroupThrottling.value?.isRedisRateLimitEnabledActive && {
            "redis-ratelimit": {
              ...(this.formGroupThrottling.value?.address && { "host": this.formGroupThrottling.value?.address }),
              ...(this.formGroupThrottling.value?.tokenizer && { "tokenizer": this.formGroupThrottling.value?.tokenizer }),
              ...(this.formGroupThrottling.value?.burst && { "burst": this.formGroupThrottling.value?.burst }),
              ...(this.formGroupThrottling.value?.rate && { "rate": this.formGroupThrottling.value?.rate }),
              ...(this.formGroupThrottling.value?.periods && { "period": this.formGroupThrottling.value?.periods }),
              ...(this.formGroupThrottling.value?.tokenizerField && { "tokenizerField": this.formGroupThrottling.value?.tokenizerField })
            }
          })
        }
      }),
      ...(this.formGroupThrottling.value?.isIpFilterActive && {
        "plugin/req-resp-modifier": {
          "name": [
            this.formGroupThrottling.value?.isIpFilterActive && "ip-filter"
          ].filter(Boolean),
          ...(this.formGroupThrottling.value?.isIpFilterActive && {
            "ip-filter": {
              ...(this.formGroupThrottling.value?.allowModeActive && { "allow": this.formGroupThrottling.value?.allowModeActive }),
              ...(this.formGroupThrottling.value?.clientIPHeadersArrayValue.length != 0 && { "client_ip_headers": this.formGroupThrottling.value?.clientIPHeadersArrayValue }),
              ...(this.formGroupThrottling.value?.cidrArrayValue.length != 0 && { "CIDR": this.formGroupThrottling.value?.cidrArrayValue }),
              ...(this.formGroupThrottling.value?.trustedProxiesArrayValue.length != 0 && { "trusted_proxies": this.formGroupThrottling.value?.trustedProxiesArrayValue })
            }
          })
        }
      }),
    },
      ...(this.formGroupThrottling.value?.timeout &&{"timeout":this.formGroupThrottling.value?.timeout}),
      ...(this.formGroupThrottling.value?.cacheTtl &&{"cache_ttl":this.formGroupThrottling.value?.cacheTtl})


    }

    console.log(body);

    this.endpointService.addThrottling(this.endpointId,body).subscribe({
      next:(res)=>{
        console.log("added", res);
      },
      error:(err)=>{
        console.error(err)
      }
    })
  }


}
