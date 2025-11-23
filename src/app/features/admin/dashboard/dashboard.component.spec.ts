import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import it from '@angular/common/locales/it';
import { beforeEach, describe } from 'node:test';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
E
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

function expect(component: DashboardComponent) {
  throw new Error('Function not implemented.');
}
