import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewapiComponent } from './viewapi.component';

describe('ViewapiComponent', () => {
  let component: ViewapiComponent;
  let fixture: ComponentFixture<ViewapiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewapiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewapiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
