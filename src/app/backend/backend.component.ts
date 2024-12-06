import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainService } from '../services/main.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.css'
})
export class BackendComponent {

  bodyEditor_tooltip="The response body you will return to the end-user. You can introduce the variables.resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx,.req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path";
  url_tooltip="The endpoint of the backend server to query. Reuse here any &#123;parameters&#125;defined in the parent endpoint. Also see Header routing";
  decodeas_tooltip="How to decode the response of the backend.";
  disSanitization_tooltip="For non-HTTP hosts. If unsure, leave the proposed value.";
  staticUrl_tooltip="The folder in the filesystem containing the static files. Relative to the working dir where KrakenD config is (e.g.: ./assets) or absolute (e.g.: /etc/krakend/assets).";
  directory_tooltip="For non-HTTP hosts. If unsure, leave the proposed value.";
  contentType_tooltip="The Content-Type that you are coding in the template. Defaults to application/json";
  debug_tooltip="shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production."
  path_tooltip="You can load the request from an external file instead of editing the template.";
  martian_tooltip="Paste here your JSON configuration to be used in the martian modifier.";
  rootObj_tooltip="Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces,special characters, or emoji.";
  collection_tooltip="KrakenD expects an object as a response in json inside brackets, e.g:'status':'OK' but if the backend returns a collection instead (e.g: [ 'a', 'b' ]) check this option.The collection will be returned inside the collection attribute. Use the renaming below to rename it to anything else."
  allowDeny_tooltip="If you want to filter the response, choose between allowing or denying attributes.If both are set, allowing will be used. If it's the same for you, denying performs much better"
  wrappingGroup_tooltip="Fill only if you want to capture all the response and encapsulate inside an attribute name."
  sharedCache_tooltip="Allow cached entries to be reused in different backend definitions when possible.";
  expression_tooltip="JMESpath query to execute on returned results of /"
  bodyEditorRes_tooltip="The response body you will return to the end-user. You can introduce the variables.resp_headers.xxx, .resp_headers.xxx (with no-op), .resp_status.xxx (with no-op), .resp_body.xxx,.req_params.Xxx, .req_headers.xxx, .req_querystring.xxx, .req_path"
  contentTypeRes_tooltip="The Content-Type that you are coding in the template. Defaults to application/json";
  debudRes_tooltip="shows useful information in the logs with DEBUG level about the input received and the body generated. Do not enable in production.";
  pathRes_tooltip="The Content-Type that you are coding in the template. Defaults to application/json"
  contentReplacer_tooltip="The find expression or literal you want to use";
  keyToReplace_tooltip="Write the key of the object you would like to replace content."
  replaceBy_tooltip="The literal string or expression you want to use as a replacement. You can use capture groups with $1, $2, etc."
  regexMode_tooltip="Check if you want to use regular expression instead of a literal string (faster)."
  bodyEditorMartian_tooltip="Paste here your JSON configuration to be used in the martian modifier."
  circuitName_tooltip="How this circuit breaker is shown in the logging.A friendly name to follow this circuit breaker's activity in the logs.Example: 'cb-backend-1'";
  maxErrors_tooltip="Consecutive failures from the backend to stop sending traffic to it";
  interval_tooltip="Time window where this circuit breaker counts errors";
  renaming_tooltip="You can rename any attributes returned by the backend and use a name more convenient for you."
  timeout_tooltip="Time to wait before stressing again a failing backend";

  panelOpenState = false;
  mainUrl:any;
  mainMethod:any;
  mainHost:any;
  // items=[
  //   {name:'abc',id:1},
  //   {name:'abcd',id:2},
  //   {name:'abcde',id:3},
  // ]
  // addPanel() {
  //   const newPanel = {
  //     id: this.items.length + 1, 
  //     name: `Panel ${this.items.length + 1}`
  //   };
  //   this.items.push(newPanel);
  // }
  formGroupUpstreamRequest:FormGroup |any;

  // response manipulation
  deniedAttributesArr:any[]=[];
  allowedAttributesArr:string[]=[];
  faltMapArr:any[]=[];
  itemsRes: any;
  formGroupResManipulation:FormGroup |any;
  objectMap: Map<string, string> = new Map();
  objectMapAuth: Map<string, string> = new Map();
  isKeyCreated: boolean = false;

  // policies
  parameterArraySecReqPolicy: any = [];
  parameterArraySecResPolicy: any = [];
  parameterArrayJwtValReqPolicy: any = [];

  // connectivity options
  amqpRoutingKeysArray: any[] = [];

  objectMapConnect: Map<string, string> = new Map();
  objectMapConnect1: Map<string, string> = new Map();

  jsonData = {
    "students": [
      { "name": "Bill", "age": 23 },
      { "name": "Mary", "age": 16 },
      { "name": "Jessica", "age": 19 }
    ]
  };
  
  selectedItem: any;

  selectItem(item: any) {
    console.log(item);
    this.selectedItem = item;
  }
 

  formArray: FormArray; // Holds a FormGroup for each panel
  items: any[] = []; // Items from the backend

  constructor(private fb: FormBuilder, private http: HttpClient,private mainSer:MainService,private route:ActivatedRoute) {
    this.itemsRes = [
      { name: 'Deny' },
      { name: 'Allow' },
    ];
    this.formArray = this.fb.array([]);
    // response manipulation
    this.formArray.controls.forEach((_, index) => {
      this.applyDynamicLogic(index);
    });
  }
  applyDynamicLogic(index: number): void {
    const formGroup = this.getFormGroup(index);
  
    // Disable 'path' field initially
    formGroup.get('path')?.disable();
  
    // Watch 'isCollection' changes and enable/disable 'rootObject'
    formGroup.get('isCollection')?.valueChanges.subscribe((isChecked) => {
      const rootObjectControl = formGroup.get('rootObject');
      if (isChecked) {
        rootObjectControl?.disable();
      } else {
        rootObjectControl?.enable();
      }
    });
  
    // Watch 'bodyEditor' changes and toggle 'template' and 'path'
    formGroup.get('bodyEditor')?.valueChanges.subscribe((value) => {
      const bodyEditorControl = formGroup.get('template');
      const pathControl = formGroup.get('path');
  
      if (value === 'bodyeditor') {
        bodyEditorControl?.enable();
        pathControl?.disable();
      } else if (value === 'external') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    });
  }
  
endpointId:any;
  // ngOnInit(): void {
  //   this.fetchItemsFromBackend();
  //   this.selectedItem = this.itemsRes[0];
  //   this.route.parent?.paramMap.subscribe((params:any) => {
  //     this.endpointId = params.get('id');
  //     console.log('Parent ID:', this.endpointId);
  //   });
    
  // }
  ngOnInit(): void {
    this.selectedItem = this.itemsRes[0];
    this.route.parent?.paramMap.subscribe((params: any) => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
  
      // Fetch items only after the endpointId is set
      if (this.endpointId) {
        this.fetchItemsFromBackend();
        
      }
    });
  }
  

  fetchItemsFromBackend() {
    this.mainSer.getEndpoint(this.endpointId).subscribe((data:any) => {
      this.items = data.backend.map((item:any) => ({ ...item, isNew: false })); // Mark all as existing
      this.initializeFormGroups();
    });
  }

  initializeFormGroups() {
    this.items.forEach((item) => {
      console.log(item);
      
      const group = this.fb.group({
        id: [item.id],
        extraConfigId:[item?.extra_config?.id],
       
      isStaticServerActive:[!!item?.extra_config?.['backend/static-filesystem']],
      isBodymanipulationActive:[!!item?.extra_config?.['modifier/body-generator']],
      isMartianActive:[!!item?.extra_config?.['modifier/martian']],
      sanitization:[item?.disable_host_sanitize],
      method:[item?.method],
      endpointUrl:[item?.url_pattern],
      decodeAs:[item?.encoding],
      staticUrl:[item?.extra_config?.['backend/static-filesystem']?.path],
      directory_Listing:[item?.extra_config?.['backend/static-filesystem']?.directory_listing],
      bodyEditor:[item?.bodyEditor],
      template:[item?.extra_config?.['modifier/body-generator']?.template],
      contentType:[item?.extra_config?.['modifier/body-generator']?.content_type],
      debug:[item?.extra_config?.['modifier/body-generator']?.debug],
      path:[item?.extra_config?.['modifier/body-generator']?.path],
      martianDslTextarea:[item?.extra_config?.['modifier/martian']],
      host:[item?.host ?? []],
      hostArrayValue:[item?.host ?? []],

      // response manipulation
      isCollection:[item?.is_collection],
      rootObject:[{value:item.rootObject, disabled:false}], 
      deniedAttr:[item?.deny ?? []],
      allowedAttr:[item.allowedAttr],
      deniedAttributesArrValue:[item?.deny],
      allowedAttributesArrValue:[item?.allow],
      wrappingGroup:[item?.group],
      originalObj:[item.originalObj],
      renamedObj:[item.renamedObj],
      objectMapValue:[item.objectMapValue],
      isCachingActive:[!!item?.extra_config?.['qos/http-cache']],
      isSharedCacheActive:[item?.extra_config?.['qos/http-cache']?.shared], 
      AdvResManipulationActive:[item?.extra_config?.["modifier/jmespath"]],
      resManiWithGoTemplActive:[item?.extra_config?.["modifier/response-body-generator"]],

      expression:[item?.extra_config?.["modifier/jmespath"]?.expr],


      // bodyEditorResponse:[item.bodyEditorResponse],
      templateResponse:[item?.extra_config?.["modifier/response-body-generator"]?.template],
      contentTypeResponse:[item?.extra_config?.["modifier/response-body-generator"]?.content_type],
      debugResponse:[item?.extra_config?.["modifier/response-body-generator"]?.debug],
      pathResponse:[item?.extra_config?.["modifier/response-body-generator"]?.path],

      contentReplacer: this.fb.group({}),
      contentReplacerKey:[item.contentReplacerKey],

      
      regexConReplacerActive:[item.regexConReplacerActive],


      operationType:[item.operationType],
      flatmapTargetObj:[item.flatmapTargetObj],
      flatmapOriginalObj:[item.flatmapOriginalObj],
      flatmapFilterArr:[item.flatmapFilterArr],
      martianActive:[item.martianActive],
      martian:[item.martian],
      // throttling
      isCircuitBreakerActive: [!!item?.extra_config?.["qos/circuit-breaker"]],
      isProxyRateLimitActive: [!!item?.extra_config?.["qos/ratelimit/proxy"]],
      circuitBreakerName: [item?.extra_config?.["qos/circuit-breaker"]?.name],
      maxError: [item?.extra_config?.["qos/circuit-breaker"]?.max_errors, Validators.required],
      interval: [item?.extra_config?.["qos/circuit-breaker"]?.interval, Validators.required],
      timeout: [item.extra_config?.["qos/circuit-breaker"]?.timeout, Validators.required],
      maxRateLimit: [item?.extra_config?.["qos/ratelimit/proxy"]?.max_rate, Validators.required],
      every: [item?.extra_config?.["qos/ratelimit/proxy"]?.every, Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      capacity: [item?.extra_config?.["qos/ratelimit/proxy"]?.capacity, Validators.required],
      logStatusChange: [item?.extra_config?.["qos/circuit-breaker"]?.log_status_change],

      // authentication
      clientId: [item?.extra_config?.["auth/client-credentials"]?.client_id],
      clientSecret: [item?.extra_config?.["auth/client-credentials"]?.client_secret],
      tokenUrl: [item?.extra_config?.["auth/client-credentials"]?.token_url],
      scopes: [item?.extra_config?.["auth/client-credentials"]?.scopes],
      audience: [item?.extra_config?.["auth/gcp"]?.audience],
      user: [item?.extra_config?.["auth/ntlm"]?.user],
      password: [item?.extra_config?.["auth/ntlm"]?.password],
      isAuthActive:[!!item?.extra_config?.["auth/client-credentials"]],
      isGoogleCloudActive:[item?.extra_config?.["auth/gcp"]],
      isNtlmAuthActive:[item?.extra_config?.["auth/ntlm"]],
      // objectMapValueAuth:[item.objectMapValueAuth],
      // endpointValue:[item.endpointValue],
      // endpointKey:[item.endpointKey],
      // policies
      isSecPolicyActive: [!!item?.extra_config?.["security/policies"]],
      isResSchValidatorActive: [!!item?.extra_config?.["plugin/req-resp-modifier"]?.name.includes("response-schema-validator")],
      securityReqPolicy: [item.securityReqPolicy],
      secReqErrorStCode: [item?.extra_config?.["security/policies"]?.req?.error?.status],
      secReqErrorBody: [item?.extra_config?.["security/policies"]?.req?.error?.body],
      secReqErrorContentType: [item?.extra_config?.["security/policies"]?.req?.error?.content_type],
      securityResPolicy: [item.securityResPolicy],
      secResErrorStCode: [item?.extra_config?.["security/policies"]?.resp?.error?.status],
      secResErrorBody: [item?.extra_config?.["security/policies"]?.resp?.error?.body],
      secResErrorContentType: [item?.extra_config?.["security/policies"]?.resp?.error?.content_type],
      jwtReqPolicy: [item.jwtReqPolicy],
      enableDebug: [item?.extra_config?.["security/policies"]?.debug],
      autoJoinPolicies: [item?.extra_config?.["security/policies"]?.auto_join_policies],
      disableMacros: [item?.extra_config?.["security/policies"]?.disable_macros],
      resSchemaValErrorMsg: [item.resSchemaValErrorMsg],
      resSchemaValErrorStCode: [item.resSchemaValErrorStCode],
      secReqPolicyArrayValue: [item?.extra_config?.["security/policies"]?.req?.policies],
      secResPolicyArrayValue: [item?.extra_config?.["security/policies"]?.resp?.policies],
      jwtReqPolicyArrayValue: [item?.extra_config?.["security/policies"]?.jwt?.policies],
      responseSchema: [item.responseSchema],
      // connectivity options
      isRestToSoapActive:[!!item?.extra_config?.["backend/soap"]],
      isHttpClientSettingActive:[item?.extra_config?.["backend/http/client"]],
      isRestToGraphqlActive:[!!item?.extra_config?.["backend/graphql"]],
      isAMQPconsumerActive:[item?.extra_config?.["backend/amqp/consumer"]],
      isAWSlambdaActive:[!!item?.extra_config?.["backend/lambda"]],
      isrestToGRPCActive:[!!item?.extra_config?.["backend/grpc"]],
      isPublicSubscriberActive:[!!item.extra_config?.["backend/pubsub/susbcriber"]],
      isPublicPublisherActive:[!!item.extra_config?.["backend/pubsub/publisher"]],
      isAMQPproducerActive:[!!item.extra_config?.["backend/amqp/producer"]],
    
      // bodyEditorConnect:[item.bodyEditorConnect],
      templateConnect:[item?.extra_config?.["backend/soap"]?.template],
      contentTypeConnect:[item?.extra_config?.["backend/soap"]?.content_type],
      debugConnect:[item?.extra_config?.["backend/soap"]?.debug],
      pathConnect:[item?.extra_config?.["backend/soap"]?.path],

      connectvWebProxyForm: [item?.extra_config?.["backend/http/client"]?.proxy_address],
      donotFollowRedirectsForm: [item?.extra_config?.["backend/http/client"]?.no_redirect],
   
      objectMapValueConnect: [item.objectMapValueConnect],
      objectMapValueConnect1: [item.objectMapValueConnect1],

      restTogrpcReqNamingConventionForm: [item?.extra_config?.["backend/grpc"]?.request_naming_convention],
      restTogrpcResNamingConventionForm: [item?.extra_config?.["backend/grpc"]?.response_naming_convention],
      restTogrpcUseReqBodyForm: [item?.extra_config?.["backend/grpc"]?.use_request_body],
      restTogrpcAllowInsecureConForm: [item?.extra_config?.["backend/grpc"]?.allow_insecure_connections],
      restTogrpcRemoveUnsetValForm: [item?.extra_config?.["backend/grpc"]?.output_remove_unset_values],
      restTogrpcEnumsAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_enum_as_string],
      restTogrpcTimestmpAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_timestamp_as_string],
      restTogrpcDurationAsStrgsForm: [item?.extra_config?.["backend/grpc"]?.output_duration_as_string],
      restTogrpcDisableQueryParamForm: [item?.extra_config?.["backend/grpc"]?.disable_query_params],

      restTogprcInputMappingFieldForm: [item.restTogprcInputMappingFieldForm],
      restTogprcInputMappingMapAsForm: [item.restTogprcInputMappingMapAsForm],

      restTographQLOpTypeForm:[item?.extra_config?.["backend/graphql"]?.type],
      restTographQLInlineQueryForm:[item?.extra_config?.["backend/graphql"]?.query],
      restToGraphqlOpNameForm: [item?.extra_config?.["backend/graphql"]?.operationName],
      restTographQLQueryPathForm:[item?.extra_config?.["backend/graphql"]?.query_path],
      // restTographQLVariable: [item.restTographQLVariable],
      // restTographQLValue: [item.restTographQLValue],
      
    
      amqpConsumerQueueNameForm: [item?.extra_config?.["backend/amqp/consumer"]?.name],
      amqpConsumerExchangeForm: [item?.extra_config?.["backend/amqp/consumer"]?.exchange],
      amqpConsumerBackOffStratgyForm: [item?.extra_config?.["backend/amqp/consumer"]?.backoff_strategy],
      amqpConsumerRoutingKeysForm: [''],
      amqpConsumerRoutingKeysFormArray: [item?.extra_config?.["backend/amqp/consumer"]?.routing_key],
      amqpConsumerPrefetchCntForm: [item?.extra_config?.["backend/amqp/consumer"]?.prefetch_count],
      amqpConsumerDurableForm: [item?.extra_config?.["backend/amqp/consumer"]?.durable],
      amqpConsumerNoLocalForm: [item?.extra_config?.["backend/amqp/consumer"]?.no_local],
      // amqpRoutingKeysArray:[item.amqpRoutingKeysArray], 

      awsLambdaFunctionNameForm: [item?.extra_config?.["backend/lambda"]?.function_name],
      awsLambdaFunctionParamNameForm: [item?.extra_config?.["backend/lambda"]?.function_param_name],
      awsLambdaRegionForm: [item?.extra_config?.["backend/lambda"]?.region],
      awsLambdaMaxRetriesForm: [item?.extra_config?.["backend/lambda"]?.max_retries],
      awsLambdaEndpointForm: [item?.extra_config?.["backend/lambda"]?.endpoint],


      

      publicSubSubscriptionTypeForm: [''],
      publicSubSubscriptionURLForm: [item?.extra_config?.["backend/pubsub/susbcriber"]?.subscription_url],
      publicPubSubscriptionTypeForm: [''],
      publicPubTopicURLForm: [item?.extra_config?.["backend/pubsub/publisher"]?.topic_url],
      amqpProducerQueueNameForm: [item?.extra_config?.["backend/amqp/producer"]?.name],
      amqpProducerExchangeForm: [item?.extra_config?.["backend/amqp/producer"]?.exchange],
      amqpProducerBackoffStrategyForm: [item?.extra_config?.["backend/amqp/producer"]?.backoff_strategy],
      amqpProducerDurableForm: [item?.extra_config?.["backend/amqp/producer"]?.durable]
      });
      this.formArray.push(group);
    });
  }
showBackend:boolean=true;
  addPanel() {
    const newItem = { 
      mainUrl:this.mainUrl,
      mainMethod:this.mainMethod,
      mainHost:this.mainHost,
      id: null,
      extraConfigId:null,
      isStaticServerActive: false,
      isBodymanipulationActive: false,
      isMartianActive: false,
      sanitization: false,
      method: null,
      endpointUrl: null,
      decodeAs: null,
      staticUrl: null,
      directory_Listing: false,
      bodyEditor: 'bodyeditor',
      template: '',
      contentType: '',
      debug: false,
      path: '',
      martianDslTextarea: null,
      host: null,
      hostArrayValue: [],

      // response manipulation
      isCollection:false,
      rootObject:'', 
      deniedAttr:[],
      allowedAttr:[],
      deniedAttributesArrValue:[],
      allowedAttributesArrValue:[],
      wrappingGroup:'',
      originalObj:'',
      renamedObj:'',
      objectMapValue:[],

      isCachingActive:false,
      isSharedCacheActive:false, 
      AdvResManipulationActive:false,
      resManiWithGoTemplActive:false,

      expression:'',


      bodyEditorResponse:'bodyeditor',
      templateResponse:'',
      contentTypeResponse:'',
      debugResponse:false,
      pathResponse:'',

      contentReplacer: this.fb.group({}),
      contentReplacerKey:'',

      
      regexConReplacerActive:false,


      operationType:'',
      flatmapTargetObj:'',
      flatmapOriginalObj:'',
      flatmapFilterArr:[],
      martianActive:false,
      martian:'',
      // throttling
      isCircuitBreakerActive: false,
      isProxyRateLimitActive: false,
      circuitBreakerName: null,
      maxError: '',
      interval: '',
      timeout: '',
      maxRateLimit: '',
      every: '',
      capacity: '',
      logStatusChange: false,
      // authentication
      clientId: null,
      clientSecret: null,
      tokenUrl: null,
      scopes: null,
      audience: null,
      user: null,
      password: null,
      isAuthActive:false,
      isGoogleCloudActive:false,
      isNtlmAuthActive:false,
      objectMapValueAuth:[],
      endpointValue:[],
      endpointKey:[],
      // policies
      isSecPolicyActive: false,
      isResSchValidatorActive: false,
      securityReqPolicy: null,
      secReqErrorStCode: null,
      secReqErrorBody: null,
      secReqErrorContentType: null,
      securityResPolicy: null,
      secResErrorStCode: null,
      secResErrorBody: null,
      secResErrorContentType: null,
      jwtReqPolicy: null,
      enableDebug: false,
      autoJoinPolicies: false,
      disableMacros: false,
      resSchemaValErrorMsg: null,
      resSchemaValErrorStCode: null,
      secReqPolicyArrayValue: [],
      secResPolicyArrayValue: [],
      jwtReqPolicyArrayValue: [],
      responseSchema: null,

      // connectivity options
      isRestToSoapActive:false,
      isHttpClientSettingActive:false,
      isRestToGraphqlActive:false,
      isAMQPconsumerActive:false,
      isAWSlambdaActive:false,
      isrestToGRPCActive:false,
      isPublicSubscriberActive:false,
      isPublicPublisherActive:false,
      isAMQPproducerActive:false,
    
      bodyEditorConnect:'',
      templateConnect:'',
      contentTypeConnect:'',
      debugConnect:false,
      pathConnect:'',

      connectvWebProxyForm: null,
      donotFollowRedirectsForm: false,
   
      objectMapValueConnect: [],
      objectMapValueConnect1: [],

      restTogrpcReqNamingConventionForm: null,
      restTogrpcResNamingConventionForm: null,
      restTogrpcUseReqBodyForm: false,
      restTogrpcAllowInsecureConForm: null,
      restTogrpcRemoveUnsetValForm: false,
      restTogrpcEnumsAsStrgsForm: false,
      restTogrpcTimestmpAsStrgsForm: false,
      restTogrpcDurationAsStrgsForm: false,
      restTogrpcDisableQueryParamForm: null,

      restTogprcInputMappingFieldForm: null,
      restTogprcInputMappingMapAsForm: null,

      restTographQLOpTypeForm:null,
      restTographQLInlineQueryForm:'',
      restToGraphqlOpNameForm: '',
      restTographQLQueryPathForm:'',
      restTographQLVariable: '',
      restTographQLValue: '',
      
    
      amqpConsumerQueueNameForm: null,
      amqpConsumerExchangeForm: null,
      amqpConsumerBackOffStratgyForm: null,
      amqpConsumerRoutingKeysForm: [],
      amqpConsumerRoutingKeysFormArray: [],
      amqpConsumerPrefetchCntForm: null,
      amqpConsumerDurableForm: null,
      amqpConsumerNoLocalForm: null,
      amqpRoutingKeysArray:false, 

      awsLambdaFunctionNameForm: null,
      awsLambdaFunctionParamNameForm: null,
      awsLambdaRegionForm: null,
      awsLambdaMaxRetriesForm: null,
      awsLambdaEndpointForm: null,


      

      publicSubSubscriptionTypeForm: null,
      publicSubSubscriptionURLForm: null,
      publicPubSubscriptionTypeForm: null,
      publicPubTopicURLForm: null,
      amqpProducerQueueNameForm: null,
      amqpProducerExchangeForm: null,
      amqpProducerBackoffStrategyForm: null,
      amqpProducerDurableForm: null,
      isNew: true };
    this.items.push(newItem);

    const newGroup = this.fb.group({
      mainUrl:[this.mainUrl,Validators.required],
      mainMethod:[this.mainMethod,Validators.required],
      mainHost:[this.mainHost,Validators.required],
      id: [null],
      extraConfigId:[null],
      // name: [''],
      isStaticServerActive:[false],
      isBodymanipulationActive:[false],
      isMartianActive:[false],
      sanitization:[false],
      method:[this.mainMethod],
      endpointUrl:[this.mainUrl],
      decodeAs:[null],
      staticUrl:[null],
      directory_Listing:[false],
      bodyEditor:['bodyeditor'],
      template:[''],
      contentType:[''],
      debug:[false],
      path:[''],
      martianDslTextarea:[null],
      host:[this.mainHost],
      hostArrayValue:[[]],
      // response manipulation
      isCollection:[false],
      rootObject:[{value:'', disabled:false}], 
      deniedAttr:[[]],
      allowedAttr:[[]],
      deniedAttributesArrValue:[[]],
      allowedAttributesArrValue:[[]],
      wrappingGroup:[''],
      originalObj:[''],
      renamedObj:[''],
      objectMapValue:[[]],

      isCachingActive:[false],
      isSharedCacheActive:[false], 
      AdvResManipulationActive:[false],
      resManiWithGoTemplActive:[false],

      expression:[''],


      bodyEditorResponse:['bodyeditor'],
      templateResponse:[''],
      contentTypeResponse:[''],
      debugResponse:[false],
      pathResponse:[''],

      contentReplacer: this.fb.group({}),
      contentReplacerKey:[''],

      
      regexConReplacerActive:[false],


      operationType:[''],
      flatmapTargetObj:[''],
      flatmapOriginalObj:[''],
      flatmapFilterArr:[[]],
      martianActive:[false],
      martian:[''],
      // throttling
      isCircuitBreakerActive: [false],
      isProxyRateLimitActive: [false],
      circuitBreakerName: [null],
      maxError: ['', Validators.required],
      interval: ['', Validators.required],
      timeout: ['', Validators.required],
      maxRateLimit: ['', Validators.required],
      every: ['', Validators.pattern("^[0-9]+(ns|ms|us|µs|s|m|h)$")],
      capacity: ['', Validators.required],
      logStatusChange: [false],
      // authentication
      clientId: [null],
      clientSecret: [null],
      tokenUrl: [null],
      scopes: [null],
      audience: [null],
      user: [null],
      password: [null],
      isAuthActive:[false],
      isGoogleCloudActive:[false],
      isNtlmAuthActive:[false],
      objectMapValueAuth:[[]],
      endpointValue:[],
      endpointKey:[],

      // policies
      isSecPolicyActive: [false],
      isResSchValidatorActive: [false],
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
      responseSchema: [null],
      // connectivity options
      isRestToSoapActive:[false],
      isHttpClientSettingActive:[false],
      isRestToGraphqlActive:[false],
      isAMQPconsumerActive:[false],
      isAWSlambdaActive:[false],
      isrestToGRPCActive:[false],
      isPublicSubscriberActive:[false],
      isPublicPublisherActive:[false],
      isAMQPproducerActive:[false],
    
      bodyEditorConnect:['bodyeditor'],
      templateConnect:[''],
      contentTypeConnect:[''],
      debugConnect:[false],
      pathConnect:[''],

      connectvWebProxyForm: [null],
      donotFollowRedirectsForm: [false],
   
      objectMapValueConnect: [[]],
      objectMapValueConnect1: [[]],

      restTogrpcReqNamingConventionForm: [null],
      restTogrpcResNamingConventionForm: [null],
      restTogrpcUseReqBodyForm: [false],
      restTogrpcAllowInsecureConForm: [null],
      restTogrpcRemoveUnsetValForm: [false],
      restTogrpcEnumsAsStrgsForm: [false],
      restTogrpcTimestmpAsStrgsForm: [false],
      restTogrpcDurationAsStrgsForm: [false],
      restTogrpcDisableQueryParamForm: [null],
      restTogprcInputMappingFieldForm: [null],
      restTogprcInputMappingMapAsForm: [null],
      restTographQLOpTypeForm:[null],
      restTographQLInlineQueryForm:[],
      restToGraphqlOpNameForm: [],
      restTographQLQueryPathForm:[],
      restTographQLVariable: [],
      restTographQLValue: [],
      amqpConsumerQueueNameForm: [null],
      amqpConsumerExchangeForm: [null],
      amqpConsumerBackOffStratgyForm: [null],
      amqpConsumerRoutingKeysForm: [],
      amqpConsumerRoutingKeysFormArray: [[]],
      amqpConsumerPrefetchCntForm: [null],
      amqpConsumerDurableForm: [null],
      amqpConsumerNoLocalForm: [null],
      amqpRoutingKeysArray:[false], 
      awsLambdaFunctionNameForm: [null],
      awsLambdaFunctionParamNameForm: [null],
      awsLambdaRegionForm: [null],
      awsLambdaMaxRetriesForm: [null],
      awsLambdaEndpointForm: [null],
      publicSubSubscriptionTypeForm: [null],
      publicSubSubscriptionURLForm: [null],
      publicPubSubscriptionTypeForm: [null],
      publicPubTopicURLForm: [null],
      amqpProducerQueueNameForm: [null],
      amqpProducerExchangeForm: [null],
      amqpProducerBackoffStrategyForm: [null],
      amqpProducerDurableForm: [null]
    });
    this.formArray.push(newGroup);
    this.applyDynamicLogic(this.formArray.length - 1);
  }
  
  saveBackend(index: number) {
    const formGroup = this.getFormGroup(index);
    const data = formGroup.value;
console.log(data);
const renamingObj = data?.objectMapValue?.reduce((acc:any, [key, value]:any) => {
  acc[key] = value;
  return acc;
}, {});
const inputMapObj = data?.objectMapValue?.reduce((acc:any, [key, value]:any) => {
  acc[key] = value;
  return acc;
}, {});
const backendBody=
    {
      "id": null,
      "host": data?.hostArrayValue,
      "url_pattern": data?.endpointUrl,
      "allow": data?.allowedAttributesArrValue,
      ...(data?.objectMapValue &&{"mapping": renamingObj}),
      "group": data?.wrappingGroup,
      "is_collection": data?.isCollection,
      "encoding": data?.decodeAs,
      "extra_config": {
        "id":null,
        ...(data?.isCircuitBreakerActive &&{"qos/circuit-breaker": {
          ...(data?.interval && {"interval": data?.interval}),
          ...(data?.circuitBreakerName && {"name": data?.circuitBreakerName}),
          ...(data?.timeout && {"timeout":  data?.timeout}),
          ...(data?.maxError && {"max_errors": data?.maxError}),
          ...(data?.logStatusChange && {"log_status_change": data?.logStatusChange})
        }}),
        ...((data.regexConReplacerActive ||data?.isResSchValidatorActive) &&{"plugin/req-resp-modifier": {
          "name": [
            data.regexConReplacerActive && 'content-replacer',
            data?.isResSchValidatorActive && 'response-schema-validator'
          ].filter(Boolean),
          ...(data.regexConReplacerActive &&{"content-replacer": data.contentReplacer}),
          ...(data?.isResSchValidatorActive &&{"response-schema-validator": {
        "schema": data?.responseSchema,
        "error": {
          "status": data?.resSchemaValErrorStCode,
          "body": data?.resSchemaValErrorMsg
        }
      }})
        }}),
       ...(data?.isProxyRateLimitActive &&{"qos/ratelimit/proxy": {
          "max_rate": data?.maxRateLimit,
          "capacity": data?.capacity,
          "every": data?.every
        }}),
        ...(data.isCachingActive &&{"qos/http-cache": {
          "shared": data.isSharedCacheActive
        }}),
        ...(data?.isAuthActive &&{"auth/client-credentials": {
      "endpoint_params": {
        "5t": "ji"
      },
      ...(data?.clientId &&{"client_id": data?.clientId}),
      ...(data?.clientSecret &&{"client_secret": data?.clientSecret}),
      ...(data?.tokenUrl &&{"token_url": data?.tokenUrl}),
      ...(data?.scopes &&{"scopes": data?.scopes})
    }}),
    ...(data?.isGoogleCloudActive &&{"auth/gcp": {
      ...(data?.audience &&{"audience": data?.audience})
    }}),
    ...(data?.isNtlmAuthActive &&{"auth/ntlm": {
      "user": "g",
      "password": "yu"
    }}),
    ...(data?.isSecPolicyActive &&{"security/policies": {
      "req": { 
        "policies": data?.secReqPolicyArrayValue,
        "error": {
          "status": data?.secReqErrorStCode,
          "body": data?.secReqErrorBody,
          "content_type": data?.secReqErrorContentType
        }
      },
      "resp": {
        "policies": data?.secResPolicyArrayValue,
        "error": {
          "status": data?.secResErrorStCode,
          "body": data?.secResErrorBody,
          "content_type": data?.secResErrorContentType
        }
      },
      "jwt": {
        "policies": data?.jwtReqPolicyArrayValue
      },
      "debug": data?.enableDebug,
      "auto_join_policies": data?.autoJoinPolicies,
      "disable_macros": data?.disableMacros
    }}),
        ...(data?.isRestToGraphqlActive &&{"backend/graphql": {
          ...(data?.restTographQLOpTypeForm &&{"type": data?.restTographQLOpTypeForm}),
          ...(data?.restTographQLInlineQueryForm &&{"query": data?.restTographQLInlineQueryForm}),
          "variables": {},
      ...(data?.restToGraphqlOpNameForm &&{"operationName": data?.restToGraphqlOpNameForm}),
      ...(data?.restTographQLQueryPathForm &&{"query_path": data?.restTographQLQueryPathForm}),
        }}),
        ...(data?.isRestToSoapActive &&{"backend/soap": {
          "@comment": null,
          "template": "",
      "content_type": data?.contentTypeRestToSoap,
      "debug": data?.enableDebugRestToSoap,
          "path": data?.pathRestToSoapForm
        }}),
        ...(data?.isrestToGRPCActive &&{"backend/grpc": {
          ...(data?.objectMapValue &&{"input_mapping": inputMapObj}),
          ...(data?.restTogrpcResNamingConventionForm &&{"response_naming_convention": data?.restTogrpcResNamingConventionForm}),
          ...(data?.restTogrpcEnumsAsStrgsForm &&{"output_enum_as_string": data?.restTogrpcEnumsAsStrgsForm}),
          ...(data?.restTogrpcTimestmpAsStrgsForm &&{"output_timestamp_as_string": data?.restTogrpcTimestmpAsStrgsForm}),
          ...(data?.restTogrpcDurationAsStrgsForm &&{"output_duration_as_string": data?.restTogrpcDurationAsStrgsForm}),
          // "client_tls": {
          //   "allow_insecure_connections": true
          // },
          ...(data?.restTogrpcRemoveUnsetValForm &&{"output_remove_unset_values": data?.restTogrpcRemoveUnsetValForm}),
          ...(data?.restTogrpcUseReqBodyForm &&{"use_request_body": data?.restTogrpcUseReqBodyForm})
        }}),
        ...(data?.isHttpClientSettingActive &&{"backend/http/client": {
      ...(data?.connectvWebProxyForm &&{"proxy_address": data?.connectvWebProxyForm}),
      "no_redirect": data?.donotFollowRedirectsForm
    }}),
        ...(data?.isStaticServerActive &&{"backend/static-filesystem": {
          "directory_listing": data?.directory_Listing,
          ...(data?.staticUrl &&{"path": data?.staticUrl})
        }}),
        ...(data?.isBodymanipulationActive &&{"modifier/body-generator": {
      ...(data?.bodyEditor &&{"template": data?.template}),
      ...(data?.contentType &&{"content_type": data?.contentType}),
      ...(data?.debug &&{"debug": data?.debug}),
      ...(data?.path &&{"path": data?.path})
    }}),
    ...( data?.isMartianActive &&{"modifier/martian": data?.martianDslTextarea}),
    ...(data.AdvResManipulationActive &&{"modifier/jmespath": {
      "expr": data.expression
    }}),
    ...(data.resManiWithGoTemplActive &&{"modifier/response-body-generator": {
      ...(data.contentType &&{"content_type": data.contentTypeResponse}),
      ...(data.debug &&{"debug": data.debugResponse}),
      ...(data.path &&{"path": data.pathResponse}),
      ...(data.template &&{"template": data.templateResponse})
    }}),
    ...(data.isPublicSubscriberActive &&{"backend/pubsub/susbcriber": {
              "subscription_url": data.publicSubSubscriptionURLForm
            }}),
            ...(data.isPublicPublisherActive &&{"backend/pubsub/publisher": {
              "topic_url": data.publicPubTopicURLForm
            }}),
            ...(data.isAMQPproducerActive &&{"backend/amqp/producer": {
              "exchange": data.amqpProducerExchangeForm,
              "backoff_strategy":data.amqpProducerBackoffStrategyForm,
              "durable": data.amqpProducerDurableForm,
              // "mandatory": true,
              // "immediate": false,
              "name": data.amqpProducerQueueNameForm
            }})
      },
      "target": null,
      "method": data?.method,
      "deny": data?.deniedAttributesArrValue,
      "@comment": null,
      "@test_with": null,
      "disable_host_sanitize": true
    
  
}
console.log(backendBody);
this.mainSer.addBackend(this.endpointId,backendBody).subscribe({
  next:(res:any)=>{
    console.log(res);
    this.fetchItemsFromBackend();
  },
  error:(err:any)=>{
    console.log(err);
    
  }
})

    // this.http.post('https://api.example.com/items', data).subscribe((response: any) => {
    //   this.items[index] = { ...data, id: response.id, isNew: false }; // Update item with ID and mark as not new
    //   alert('Panel saved successfully!');
    // });
  }

  updateBackend(index: number,backendId:number) {
    const formGroup = this.getFormGroup(index);
    const data = formGroup.value;
console.log(data);
const renamingObj = data?.objectMapValue?.reduce((acc:any, [key, value]:any) => {
  acc[key] = value;
  return acc;
}, {});
const inputMapObj = data?.objectMapValue?.reduce((acc:any, [key, value]:any) => {
  acc[key] = value;
  return acc;
}, {});
const backendBody={
  "id": data?.id,
  ...(data?.hostArrayValue?.length>0 &&{"host": data?.hostArrayValue}),
  "url_pattern": data?.endpointUrl,
  ...(data?.allowedAttributesArrValue?.length>0 &&{"allow": data?.allowedAttributesArrValue}),
  ...(data?.objectMapValue &&{"mapping": renamingObj}),
  "group": data?.wrappingGroup,
  "is_collection": data?.isCollection,
  "encoding": data?.decodeAs,
  "extra_config": {
    "id": data?.extraConfigId,
    ...(data?.isCircuitBreakerActive &&{"qos/circuit-breaker": {
      ...(data?.interval && {"interval": data?.interval}),
      ...(data?.circuitBreakerName && {"name": data?.circuitBreakerName}),
      ...(data?.timeout && {"timeout":  data?.timeout}),
      ...(data?.maxError && {"max_errors": data?.maxError}),
      ...(data?.logStatusChange && {"log_status_change": data?.logStatusChange})
    }}),
    ...((data.regexConReplacerActive ||data?.isResSchValidatorActive) &&{"plugin/req-resp-modifier": {
      "name": [
        data.regexConReplacerActive && 'content-replacer',
        data?.isResSchValidatorActive && 'response-schema-validator'
      ].filter(Boolean),
      ...(data.regexConReplacerActive &&{"content-replacer": data.contentReplacer}),
      ...(data?.isResSchValidatorActive &&{"response-schema-validator": {
    "schema": data?.responseSchema,
    "error": {
      "status": data?.resSchemaValErrorStCode,
      "body": data?.resSchemaValErrorMsg
    }
  }})
    }}),
   ...(data?.isProxyRateLimitActive &&{"qos/ratelimit/proxy": {
      "max_rate": data?.maxRateLimit,
      "capacity": data?.capacity,
      ...(data?.every &&{"every": data?.every})
    }}),
    ...(data.isCachingActive &&{"qos/http-cache": {
      "shared": data.isSharedCacheActive
    }}),
    ...(data?.isAuthActive &&{"auth/client-credentials": {
  "endpoint_params": {
    "5t": "ji"
  },
  ...(data?.clientId &&{"client_id": data?.clientId}),
  ...(data?.clientSecret &&{"client_secret": data?.clientSecret}),
  ...(data?.tokenUrl &&{"token_url": data?.tokenUrl}),
  ...(data?.scopes &&{"scopes": data?.scopes})
}}),
...(data?.isGoogleCloudActive &&{"auth/gcp": {
  ...(data?.audience &&{"audience": data?.audience})
}}),
...(data?.isNtlmAuthActive &&{"auth/ntlm": {
  "user": "g",
  "password": "yu"
}}),
...(data?.isSecPolicyActive &&{"security/policies": {
  "req": { 
    "policies": data?.secReqPolicyArrayValue,
    "error": {
      "status": data?.secReqErrorStCode,
      "body": data?.secReqErrorBody,
      "content_type": data?.secReqErrorContentType
    }
  },
  "resp": {
    "policies": data?.secResPolicyArrayValue,
    "error": {
      "status": data?.secResErrorStCode,
      "body": data?.secResErrorBody,
      "content_type": data?.secResErrorContentType
    }
  },
  "jwt": {
    "policies": data?.jwtReqPolicyArrayValue
  },
  "debug": data?.enableDebug,
  "auto_join_policies": data?.autoJoinPolicies,
  "disable_macros": data?.disableMacros
}}),
    ...(data?.isRestToGraphqlActive &&{"backend/graphql": {
      ...(data?.restTographQLOpTypeForm &&{"type": data?.restTographQLOpTypeForm}),
      ...(data?.restTographQLInlineQueryForm &&{"query": data?.restTographQLInlineQueryForm}),
      "variables": {},
  ...(data?.restToGraphqlOpNameForm &&{"operationName": data?.restToGraphqlOpNameForm}),
  ...(data?.restTographQLQueryPathForm &&{"query_path": data?.restTographQLQueryPathForm}),
    }}),
    ...(data?.isRestToSoapActive &&{"backend/soap": {
      "@comment": null,
      "template": "",
  "content_type": data?.contentTypeRestToSoap,
  "debug": data?.enableDebugRestToSoap,
      "path": data?.pathRestToSoapForm
    }}),
    ...(data?.isrestToGRPCActive &&{"backend/grpc": {
      ...(data?.objectMapValue &&{"input_mapping": inputMapObj}),
      ...(data?.restTogrpcResNamingConventionForm &&{"response_naming_convention": data?.restTogrpcResNamingConventionForm}),
      ...(data?.restTogrpcEnumsAsStrgsForm &&{"output_enum_as_string": data?.restTogrpcEnumsAsStrgsForm}),
      ...(data?.restTogrpcTimestmpAsStrgsForm &&{"output_timestamp_as_string": data?.restTogrpcTimestmpAsStrgsForm}),
      ...(data?.restTogrpcDurationAsStrgsForm &&{"output_duration_as_string": data?.restTogrpcDurationAsStrgsForm}),
      // "client_tls": {
      //   "allow_insecure_connections": true
      // },
      ...(data?.restTogrpcRemoveUnsetValForm &&{"output_remove_unset_values": data?.restTogrpcRemoveUnsetValForm}),
      ...(data?.restTogrpcUseReqBodyForm &&{"use_request_body": data?.restTogrpcUseReqBodyForm})
    }}), 
    ...(data?.isHttpClientSettingActive &&{"backend/http/client": {
  ...(data?.connectvWebProxyForm &&{"proxy_address": data?.connectvWebProxyForm}),
  "no_redirect": data?.donotFollowRedirectsForm
}}),
    ...(data?.isStaticServerActive &&{"backend/static-filesystem": {
      "directory_listing": data?.directory_Listing,
      ...(data?.staticUrl &&{"path": data?.staticUrl})
    }}),
    ...(data?.isBodymanipulationActive &&{"modifier/body-generator": {
  ...(data?.bodyEditor &&{"template": data?.bodyEditor}),
  ...(data?.contentType &&{"content_type": data?.contentType}),
  ...(data?.debug &&{"debug": data?.debug}),
  ...(data?.path &&{"path": data?.path})
}}),
...( data?.isMartianActive &&{"modifier/martian": data?.martianDslTextarea}),
...(data.AdvResManipulationActive &&{"modifier/jmespath": {
  "expr": data.expression
}}),
...(data.resManiWithGoTemplActive &&{"modifier/response-body-generator": {
  ...(data.contentType &&{"content_type": data.contentTypeResponse}),
  ...(data.debug &&{"debug": data.debugResponse}),
  ...(data.path &&{"path": data.pathResponse}),
  ...(data.template &&{"template": data.templateResponse})
}})
  },
  // "target": null,
  "method": data?.method,
  ...(data?.deniedAttributesArrValue?.length>0 &&{"deny": data?.deniedAttributesArrValue}),
  // "@comment": null,
  // "@test_with": null,
  "disable_host_sanitize": true


}
this.mainSer.updateBackend(backendId,backendBody).subscribe({
  next:(res:any)=>{
    console.log(res);
    this.fetchItemsFromBackend();
  },
  error:(err:any)=>{
    console.log(err);
    
  }
})

    // this.http.put(`https://api.example.com/items/${data.id}`, data).subscribe(() => {
    //   alert('Panel updated successfully!');
    // });
  }

  getFormGroup(index: number): FormGroup {
    return this.formArray.at(index) as FormGroup;
  }

  
  // constructor(private formBuilder:FormBuilder){
  //   this.formGroupUpstreamRequest=this.formBuilder.group({

  //     isStaticServerActive:[false],
  //     isBodymanipulationActive:[false],
  //     isMartianActive:[false],
  //     sanitization:[false],
  //     method:[null],
  //     endpointUrl:[null],
  //     decodeAs:[null],
  //     staticUrl:[null],
  //     directory_Listing:[false],
  //     bodyEditor:['bodyeditor'],
  //     template:[''],
  //     contentType:[''],
  //     debug:[false],
  //     path:[''],
  //     martianDslTextarea:[null],
  //     host:[null],
  //     hostArrayValue:[[]]
  //   })
  // }
  hostArray:any=[];
  parameterHeaderArray:any=[];
  updateParametersArrayRequest(index:any) {
    this.getFormGroup(index).get('hostArrayValue')?.setValue([...this.hostArray]);
  }
  addParameterRequest(formIndex:number) {
    const queryParamsValue = this.getFormGroup(formIndex).get('host')?.value;
    
    if (queryParamsValue) {
      this.hostArray.push(queryParamsValue);
      this.updateParametersArrayRequest(formIndex);
      this.getFormGroup(formIndex).get('host')?.reset();
    }
  }
  removeParameterRequest(formIndex:number,index: number) {
    this.hostArray.splice(index, 1);
    this.updateParametersArrayRequest(formIndex);
  }

  // response manipulation

  updateMapControl(formGroupIndex:any) {
    // Convert Map to array of key-value pairs
    const mapArray = Array.from(this.objectMap.entries());
    this.getFormGroup(formGroupIndex).get('objectMapValue')?.setValue(mapArray);
  }
  
  addToMap(formGroupIndex:number,key: string, value: string) {
    this.objectMap.set(key, value);
    this.updateMapControl(formGroupIndex);  // Sync form control with updated Map
  }
  
  removeFromMap(formGroupIndex:number,key: string) {
    this.objectMap.delete(key);
    this.updateMapControl(formGroupIndex);  // Sync form control with updated Map
  }

  getMapFromControl(index:any): Map<string, string> {
    const mapArray = this.getFormGroup(index).get('objectMapValue')?.value || [];
    return new Map(mapArray);
  }

  addParameter(formGroupIndex:number,fieldName: 'deniedAttr' | 'allowedAttr'|'renaming'| 'flatMap') {
    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

    if (fieldName) {
      if(fieldName === 'deniedAttr'){
        this.deniedAttributesArr.push(fieldValue);
        this.getFormGroup(formGroupIndex).get('deniedAttributesArrValue')?.setValue([...this.deniedAttributesArr]);
      }
      else if(fieldName ==='allowedAttr'){
        this.allowedAttributesArr.push(fieldValue);
        this.getFormGroup(formGroupIndex).get('allowedAttributesArrValue')?.setValue([...this.allowedAttributesArr]);
      }else if(fieldName === 'renaming'){
        const originalObject = this.getFormGroup(formGroupIndex).get('originalObj')?.value;
        const renamedObject = this.getFormGroup(formGroupIndex).get('renamedObj')?.value;

        if (originalObject && renamedObject) {
          this.addToMap(formGroupIndex,originalObject, renamedObject)
        }
      }else if(fieldName === 'flatMap'){
        const obj = {
          "type": this.getFormGroup(formGroupIndex).get('operationType')?.value,
          "args": [
            this.getFormGroup(formGroupIndex).get('flatmapOriginalObj')?.value,
            this.getFormGroup(formGroupIndex).get('flatmapTargetObj')?.value || undefined
          ].filter(value => value !== undefined) // Filter out undefined values
        };
        
      this.faltMapArr.push(obj);

      this.getFormGroup(formGroupIndex).get('flatmapFilterArr')?.setValue([...this.faltMapArr])
      console.log(this.faltMapArr);
      this.getFormGroup(formGroupIndex).get('operationType')?.reset()
      this.getFormGroup(formGroupIndex).get('flatmapOriginalObj')?.reset()
      this.getFormGroup(formGroupIndex).get('flatmapTargetObj')?.reset()
      
      }
      this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
    }
  }

  removeParameter(formGroupIndex:number,index: any, fieldName:'deniedAttr' | 'allowedAttr' | 'renaming'| 'flatMap') {
    if(fieldName === "deniedAttr"){
      this.deniedAttributesArr.splice(index,1);
      this.getFormGroup(formGroupIndex).get('deniedAttributesArrValue')?.setValue([...this.deniedAttributesArr]);
    }else if(fieldName === 'allowedAttr'){
      this.allowedAttributesArr.splice(index,1);
      this.getFormGroup(formGroupIndex).get('allowedAttributesArrValue')?.setValue([...this.allowedAttributesArr]);
    }
    else if(fieldName === 'renaming'){
     this.removeFromMap(formGroupIndex,index);
    }
    else if(fieldName ==='flatMap'){
      this.faltMapArr.splice(index,1)
      this.getFormGroup(formGroupIndex).get('flatmapFilterArr')?.setValue([...this.faltMapArr])
    }
    
  }

  createContentReplacerKey(formGroupIndex:any) {
    if (this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value) {
      const contentReplacerGroup = this.getFormGroup(formGroupIndex).get('contentReplacer') as FormGroup;

      // Create a new FormGroup with find, replace, and regexp
      const nestedFormGroup = this.fb.group({
        find: [''],    // Default empty value for find
        replace: [''], // Default empty value for replace
        regexp: [false] // Default checkbox unchecked
      });

      // Add the new group to contentReplacer with the entered key
      contentReplacerGroup.addControl(this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value, nestedFormGroup);

      // Reset the key input and set flag to show nested controls
      this.isKeyCreated = true;
    }
  }

  resetFields(formGroupIndex:any) {
    const key = this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.value;
    if (key) {
      const contentReplacerGroup = this.getFormGroup(formGroupIndex).get('contentReplacer') as FormGroup;
      contentReplacerGroup.removeControl(key);
      this.getFormGroup(formGroupIndex).get('contentReplacerKey')?.reset();
      this.isKeyCreated = false;
    }
  }

  // authentication 

  addParameterAuth(formGroupIndex:number,fieldName:'endpoint_params') {
    const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

    if (fieldName) {
   
     if(fieldName === 'endpoint_params'){
        const endpointKey = this.getFormGroup(formGroupIndex).get('endpointKey')?.value;
        const endpointValue = this.getFormGroup(formGroupIndex).get('endpointValue')?.value;

        if (endpointKey && endpointValue) {
          this.addToMapAuth(formGroupIndex,endpointKey, endpointValue)
        }
      }
  }
}

removeParameterAuth(formGroupIndex:number,index: any, fieldName:'endpoint_params') {

  if(fieldName === 'endpoint_params'){
   this.removeFromMapAuth(formGroupIndex,index);
  }

}

updateMapControlAuth(formGroupIndex:number) {
  // Convert Map to array of key-value pairs
  const mapArray = Array.from(this.objectMapAuth.entries());
  this.getFormGroup(formGroupIndex).get('objectMapValueAuth')?.setValue(mapArray);
}

addToMapAuth(formGroupIndex:number,key: string, value: string) {
  this.objectMapAuth.set(key, value);
  this.updateMapControlAuth(formGroupIndex);  // Sync form control with updated Map
}

removeFromMapAuth(formGroupIndex:number,key: string) {
  this.objectMapAuth.delete(key);
  this.updateMapControlAuth(formGroupIndex);  // Sync form control with updated Map
}

getMapFromControlAuth(formGroupIndex:number): Map<string, string> {
  const mapArray = this.getFormGroup(formGroupIndex).get('objectMapValueAuth')?.value || [];
  return new Map(mapArray);
}

// policies
addParameterPolicies(formGroupIndex:number,fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
  const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;
  if (fieldName) {
    if (fieldName === 'securityReqPolicy') {
      this.parameterArraySecReqPolicy.push(fieldValue);
      this.getFormGroup(formGroupIndex).get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
    }
    else if (fieldName === 'securityResPolicy') {
      this.parameterArraySecResPolicy.push(fieldValue);
      this.getFormGroup(formGroupIndex).get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
    }
    else if (fieldName === 'jwtReqPolicy') {
      this.parameterArrayJwtValReqPolicy.push(fieldValue);
      this.getFormGroup(formGroupIndex).get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
    }
    this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
  }

}

removeParameterPolicies(formGroupIndex:number,index: number, fieldName: 'securityReqPolicy' | 'securityResPolicy' | 'jwtReqPolicy') {
  if (fieldName === 'securityReqPolicy') {
    this.parameterArraySecReqPolicy.splice(index, 1);
    this.getFormGroup(formGroupIndex).get('secReqPolicyArrayValue')?.setValue([...this.parameterArraySecReqPolicy]);
  }
  else if (fieldName === 'securityResPolicy') {
    this.parameterArraySecResPolicy.splice(index, 1);
    this.getFormGroup(formGroupIndex).get('secResPolicyArrayValue')?.setValue([...this.parameterArraySecResPolicy]);
  }
  else if (fieldName === 'jwtReqPolicy') {
    this.parameterArrayJwtValReqPolicy.splice(index, 1);
    this.getFormGroup(formGroupIndex).get('jwtReqPolicyArrayValue')?.setValue([...this.parameterArrayJwtValReqPolicy]);
  }
}
  
// connectivity options

updateMapControlConnect(formGroupIndex:number) {
  // Convert Map to array of key-value pairs
  const mapArray = Array.from(this.objectMapConnect.entries());
  this.getFormGroup(formGroupIndex).get('objectMapValueConnect')?.setValue(mapArray);
}
updateMapControlConnect1(formGroupIndex:number) {
  // Convert Map to array of key-value pairs
  const mapArray = Array.from(this.objectMapConnect1.entries());
  this.getFormGroup(formGroupIndex).get('objectMapValueConnect1')?.setValue(mapArray);
}

addToMapConnect(formGroupIndex:number,key: string, value: string) {
  this.objectMapConnect.set(key, value);
  this.updateMapControlConnect(formGroupIndex);  // Sync form control with updated Map
}

addToMapConnect1(formGroupIndex:number,key: string, value: string) {
  this.objectMapConnect1.set(key, value);
  this.updateMapControlConnect1(formGroupIndex);  // Sync form control with updated Map
}

removeFromMapConnect(formGroupIndex:number,key: string) {
  this.objectMapConnect.delete(key);
  this.updateMapControlConnect(formGroupIndex);  // Sync form control with updated Map
}

removeFromMapConnect1(formGroupIndex:number,key: string) {
  this.objectMapConnect1.delete(key);
  this.updateMapControlConnect1(formGroupIndex);  // Sync form control with updated Map
}



addParameterConnect(formGroupIndex:number,fieldName: 'amqpConsumerRoutingKeysForm' | 'restToGraphQLMap' | 'inputMappingFieldAndMapAs' ) {


  const fieldValue = this.getFormGroup(formGroupIndex).get(fieldName)?.value;

  if (fieldName) {
    if (fieldName === 'amqpConsumerRoutingKeysForm') {
      this.amqpRoutingKeysArray.push(fieldValue);
      this.getFormGroup(formGroupIndex).get('amqpConsumerRoutingKeysFormArray')?.setValue([...this.amqpRoutingKeysArray]);
    }
    else if (fieldName === 'restToGraphQLMap') {
    
      const originalObject = this.getFormGroup(formGroupIndex).get('restTographQLVariable')?.value;
      const renamedObject = this.getFormGroup(formGroupIndex).get('restTographQLValue')?.value;

      if (originalObject && renamedObject) {
        this.addToMapConnect1(formGroupIndex,originalObject, renamedObject)
        console.log(this.objectMapConnect);

      }
    } else if (fieldName === 'inputMappingFieldAndMapAs') {

      const originalObject = this.getFormGroup(formGroupIndex).get('restTogprcInputMappingFieldForm')?.value;
      const renamedObject = this.getFormGroup(formGroupIndex).get('restTogprcInputMappingMapAsForm')?.value;

      if (originalObject && renamedObject) {
        this.addToMapConnect(formGroupIndex,originalObject, renamedObject)
        console.log(this.objectMapConnect);

      }
    }
  }
  this.getFormGroup(formGroupIndex).get(fieldName)?.reset();
}

removeParameterConnect(formGroupIndex:number,index: any, fieldName: 'amqpConsumerRoutingKeysForm' | 'restToGraphQLMap' | 'inputMappingFieldAndMapAs') {
  if (fieldName === "amqpConsumerRoutingKeysForm") {
    this.amqpRoutingKeysArray.splice(index, 1);
    this.getFormGroup(formGroupIndex).get('amqpConsumerRoutingKeysFormArray')?.setValue([...this.amqpRoutingKeysArray]);
  } else if (fieldName == "restToGraphQLMap") {
    this.removeFromMapConnect1(formGroupIndex,index);
  } else if (fieldName === "inputMappingFieldAndMapAs") {
    this.removeFromMapConnect(formGroupIndex,index);
  }
}
}
