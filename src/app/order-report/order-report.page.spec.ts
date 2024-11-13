import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderReportPage } from './order-report.page';

describe('OrderReportPage', () => {
  let component: OrderReportPage;
  let fixture: ComponentFixture<OrderReportPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
