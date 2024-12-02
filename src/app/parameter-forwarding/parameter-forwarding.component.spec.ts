import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterForwardingComponent } from './parameter-forwarding.component';

describe('ParameterForwardingComponent', () => {
  let component: ParameterForwardingComponent;
  let fixture: ComponentFixture<ParameterForwardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterForwardingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParameterForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
