import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageStreamFormComponent } from './image-stream-form.component';

describe('ImageStreamFormComponent', () => {
  let component: ImageStreamFormComponent;
  let fixture: ComponentFixture<ImageStreamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageStreamFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageStreamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
