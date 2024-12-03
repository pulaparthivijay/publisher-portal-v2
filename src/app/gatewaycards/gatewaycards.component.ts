import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-gatewaycards',
  templateUrl: './gatewaycards.component.html',
  styleUrl: './gatewaycards.component.css'
})
export class GatewaycardsComponent {

  constructor(private router: Router, private route: ActivatedRoute, private mainSer: MainService) {

    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log(this.router.url);

        if (this.router.url === '/gateways') {
          this.isShowParent = true;


        } else if (this.router.url === '/gateways/creategateway') {
          this.isShowParent = false;
        }
      }
    });
  }
  gatewaysCards:any;
  ngOnInit() {
    this.mainSer.getCards().subscribe({
      next: ((res: any) => {
        console.log(res);
        this.gatewaysCards = res.cards
      }),
      error: (err => {

      })
    })
  }

  isShowParent: boolean = true;
  isShowNoGatewayCard = false;

  goToCreateGateway() {
    this.isShowParent = false;
    this.router.navigate(['creategateway'], { relativeTo: this.route })
  }
  goToGatewayViewPage(id: string) {
    this.isShowParent = false;
    this.router.navigate([`viewapi/${id}/overview`], { relativeTo: this.route })
  }
}

