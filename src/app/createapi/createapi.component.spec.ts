import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateapiComponent } from './createapi.component';

describe('CreateapiComponent', () => {
  let component: CreateapiComponent;
  let fixture: ComponentFixture<CreateapiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateapiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
