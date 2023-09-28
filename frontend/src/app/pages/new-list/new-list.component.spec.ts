import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlistComponent } from './new-list.component';

describe('NewlistComponent', () => {
  let component: NewlistComponent;
  let fixture: ComponentFixture<NewlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewlistComponent],
    });
    fixture = TestBed.createComponent(NewlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
