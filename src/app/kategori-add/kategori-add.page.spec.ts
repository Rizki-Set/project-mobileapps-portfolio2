import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KategoriAddPage } from './kategori-add.page';

describe('KategoriAddPage', () => {
  let component: KategoriAddPage;
  let fixture: ComponentFixture<KategoriAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KategoriAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
