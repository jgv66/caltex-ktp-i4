import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabmicarritoPage } from './tabmicarrito.page';

describe('TabmicarritoPage', () => {
  let component: TabmicarritoPage;
  let fixture: ComponentFixture<TabmicarritoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabmicarritoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabmicarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
