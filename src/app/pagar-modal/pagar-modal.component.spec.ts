import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarModalComponent } from './pagar-modal.component';

describe('PagarModalComponent', () => {
  let component: PagarModalComponent;
  let fixture: ComponentFixture<PagarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
