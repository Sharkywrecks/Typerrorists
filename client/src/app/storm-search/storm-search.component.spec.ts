import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StormComponent } from './storm.component';

describe('StormComponent', () => {
  let component: StormComponent;
  let fixture: ComponentFixture<StormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
