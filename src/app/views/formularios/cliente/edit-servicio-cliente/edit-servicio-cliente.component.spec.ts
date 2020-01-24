import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServicioClienteComponent } from './edit-servicio-cliente.component';

describe('EditServicioClienteComponent', () => {
  let component: EditServicioClienteComponent;
  let fixture: ComponentFixture<EditServicioClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditServicioClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditServicioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
