import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-deployment',
  templateUrl: './deployment.component.html',
  styleUrl: './deployment.component.css'
})
export class DeploymentComponent {

  constructor(private route:ActivatedRoute,public dialog: MatDialog){}
endpointId:any;
  ngOnInit(): void {
    // Retrieve the 'id' from the parent route
    this.route.parent?.paramMap.subscribe(params => {
      this.endpointId = params.get('id');
      console.log('Parent ID:', this.endpointId);
    });
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(GatewayDialog, {
      // data: {},
      
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}

export interface DialogData {
 
}
@Component({
  selector: 'gateway-link',
  templateUrl: 'gateway-link.html',
  styleUrls: ['./gateway-link.css']
})
export class GatewayDialog {
  constructor(
    public dialogRef: MatDialogRef<GatewayDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private mainSer:MainService
  ) {}
  gatewayCards:any;
  getGatewayCards(){
    this.mainSer.getCards().subscribe({
      next:(res:any)=>{
        console.log(res);
        this.gatewayCards=res.cards;
      }
    })
  }
  ngOnInit(){
    this.getGatewayCards()
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
