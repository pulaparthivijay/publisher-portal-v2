import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-response-manipulation',
  templateUrl: './response-manipulation.component.html',
  styleUrl: './response-manipulation.component.css'
})
export class ResponseManipulationComponent implements OnInit{

  staticresTooltip="When the backend fails you can still return the static data provided below to the user. The data is merged with any existing partial responses. If you still don't have a backend and want to have this data, add a fake one that cannot be resolved."

  isKeyCreated: boolean = false;

  formGroupResponseManipulation: FormGroup;

  jsonData = {
    "students": [
      { "name": "Bill", "age": 23 },
      { "name": "Mary", "age": 16 },
      { "name": "Jessica", "age": 19 }
    ]
  };

  constructor(private formBuilder: FormBuilder) {
    this.formGroupResponseManipulation = this.formBuilder.group({
      response: [null],
      strategy: [null],
      expression: [null],

      contentReplacerKey: [''],
      contentReplacer: this.formBuilder.group({}),
      regexConReplacerActive: [false],

      isStaticResponseActive: [false],
      isAdvanceResponseActive: [false],

      isAdvanceResponseGoActive: [false],

      bodyEditor: ['bodyeditor'],
      template: [''],
      contentType: [''],
      debug: [false],
      path: [''],
    })
  }


  ngOnInit(): void {
    this.formGroupResponseManipulation.get('bodyEditor')?.valueChanges.subscribe((value) => {
      const bodyEditorControl = this.formGroupResponseManipulation.get('template');
      const pathControl = this.formGroupResponseManipulation.get('path');

      if (value === 'bodyeditor') {
        bodyEditorControl?.enable();
        pathControl?.disable();

      } else if (value === 'external') {
        bodyEditorControl?.disable();
        pathControl?.enable();
      }
    })
  }

  createContentReplacerKey() {
    if (this.formGroupResponseManipulation.get('contentReplacerKey')?.value) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;

      // Create a new FormGroup with find, replace, and regexp
      const nestedFormGroup = this.formBuilder.group({
        find: [''],    // Default empty value for find
        replace: [''], // Default empty value for replace
        regexp: [false] // Default checkbox unchecked
      });

      // Add the new group to contentReplacer with the entered key
      contentReplacerGroup.addControl(this.formGroupResponseManipulation.get('contentReplacerKey')?.value, nestedFormGroup);

      // Reset the key input and set flag to show nested controls
      this.isKeyCreated = true;
    }
  }

  resetFields() {
    const key = this.formGroupResponseManipulation.get('contentReplacerKey')?.value;
    if (key) {
      const contentReplacerGroup = this.formGroupResponseManipulation.get('contentReplacer') as FormGroup;
      contentReplacerGroup.removeControl(key);
      this.formGroupResponseManipulation.get('contentReplacerKey')?.reset();
      this.isKeyCreated = false;
    }
  }

  submit(){
    console.log(this.formGroupResponseManipulation.value);

    const body = {
      "proxy": {
        ...(this.formGroupResponseManipulation.value?.isStaticResponseActive && {
          "static": {
            "data": this.formGroupResponseManipulation.value?.response,
            "strategy": this.formGroupResponseManipulation.value?.strategy
          }
        })
      },

      ...(this.formGroupResponseManipulation.value?.isAdvanceResponseActive && {
        "modifier/jmespath": {
          // "@comment": null,
          "expr": this.formGroupResponseManipulation.value?.expression
        }
      }),

      ...(this.formGroupResponseManipulation.value?.isAdvanceResponseGoActive && {
        "modifier/response-body-generator": {
          "template": this.formGroupResponseManipulation.value?.bodyEditor,
          "content_type": this.formGroupResponseManipulation.value?.contentType,
          "debug": this.formGroupResponseManipulation.value?.debug
        }
      }),

      ...((this.formGroupResponseManipulation.value?.regexConReplacerActive) &&{"plugin/req-resp-modifier": {
        "name": [
          this.formGroupResponseManipulation.value?.regexConReplacerActive && "content-replacer"
        ].filter(Boolean),
        ...(this.formGroupResponseManipulation.value?.regexConReplacerActive &&{"content-replacer": this.formGroupResponseManipulation.value?.contentReplacer}),
      }}),

    }    

    console.log(body);
    
  }

}
