import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewgatewayComponent } from './viewgateway.component';

describe('ViewgatewayComponent', () => {
  let component: ViewgatewayComponent;
  let fixture: ComponentFixture<ViewgatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewgatewayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewgatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
