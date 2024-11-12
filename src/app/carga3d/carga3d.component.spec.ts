import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carga3dComponent } from './carga3d.component';

describe('Carga3dComponent', () => {
  let component: Carga3dComponent;
  let fixture: ComponentFixture<Carga3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Carga3dComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carga3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
