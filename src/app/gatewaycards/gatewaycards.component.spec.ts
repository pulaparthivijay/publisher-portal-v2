import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaycardsComponent } from './gatewaycards.component';

describe('GatewaycardsComponent', () => {
  let component: GatewaycardsComponent;
  let fixture: ComponentFixture<GatewaycardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GatewaycardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GatewaycardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
