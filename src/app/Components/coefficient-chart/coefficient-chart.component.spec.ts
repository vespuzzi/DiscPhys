import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoefficientChartComponent } from './coefficient-chart.component';

describe('CoefficientChartComponent', () => {
  let component: CoefficientChartComponent;
  let fixture: ComponentFixture<CoefficientChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoefficientChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoefficientChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
