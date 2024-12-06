import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThrottlingComponent } from './throttling.component';

describe('ThrottlingComponent', () => {
  let component: ThrottlingComponent;
  let fixture: ComponentFixture<ThrottlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThrottlingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThrottlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
