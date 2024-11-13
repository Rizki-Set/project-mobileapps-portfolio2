import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KategoriEditPage } from './kategori-edit.page';

describe('KategoriEditPage', () => {
  let component: KategoriEditPage;
  let fixture: ComponentFixture<KategoriEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
