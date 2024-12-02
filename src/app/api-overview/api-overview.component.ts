import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-api-overview',
  templateUrl: './api-overview.component.html',
  styleUrl: './api-overview.component.css'
})
export class ApiOverviewComponent {

  constructor(private route:ActivatedRoute){}
  paramId:any;
  // ngOnInit(){
  //   this.route.paramMap.subscribe((params) => {
  //     this.paramId = params.get('id');
  //     console.log(this.paramId);
      
  //   });

  // }
  ngOnInit(): void {
    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.paramId = params.get('id');
      console.log('Parent ID:', this.paramId); // Should log the ID (e.g., '854')
    });
  }
  
}
