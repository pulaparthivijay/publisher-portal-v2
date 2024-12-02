import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-apicards',
  templateUrl: './apicards.component.html',
  styleUrl: './apicards.component.css'
})
export class ApicardsComponent {

  constructor( private router:Router, private route:ActivatedRoute,private mainSer:MainService){

    this.router.events.subscribe((event) => {
     
      if (event instanceof NavigationEnd) {
        console.log(this.router.url );
        
        if (this.router.url === '/apis') {
          this.isShowParent=true;
          
          
      }else if(this.router.url === '/apis/create'){
          this.isShowParent=false;
      }
    }});
  }
  endpointCards:any;
  ngOnInit(){
this.mainSer.getEndpointCards().subscribe({
  next:((res:any)=>{
    console.log(res);
    this.endpointCards=res.endpointCards
  }),
  error:(err=>{

  })
})
  }
  isShowParent:boolean=true;
  isShowNoApisCard=false;
  items=[
    {id:1,name:"name1"},
    {id:2,name:"name2"},
    {id:3,name:"name3"},
    {id:4,name:"name4"}
  ]
  goToCreateApi(){
    this.isShowParent=false;
this.router.navigate(['createapi'],{relativeTo: this.route})
  }
  goToApiViewPage(id:string){
    this.isShowParent=false;
    this.router.navigate([`viewapi/${id}/overview`],{relativeTo:this.route})
  }
}
