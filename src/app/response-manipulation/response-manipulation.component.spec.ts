import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseManipulationComponent } from './response-manipulation.component';

describe('ResponseManipulationComponent', () => {
  let component: ResponseManipulationComponent;
  let fixture: ComponentFixture<ResponseManipulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResponseManipulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponseManipulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
