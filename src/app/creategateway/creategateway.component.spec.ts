import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreategatewayComponent } from './creategateway.component';

describe('CreategatewayComponent', () => {
  let component: CreategatewayComponent;
  let fixture: ComponentFixture<CreategatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreategatewayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreategatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
