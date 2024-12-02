import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApicardsComponent } from './apicards.component';

describe('ApicardsComponent', () => {
  let component: ApicardsComponent;
  let fixture: ComponentFixture<ApicardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApicardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApicardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
