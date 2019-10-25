import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaUpdateDialogComponent } from './area-update-dialog.component';

describe('AreaUpdateDialogComponent', () => {
  let component: AreaUpdateDialogComponent;
  let fixture: ComponentFixture<AreaUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
