import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideothumbnailComponent } from './videothumbnail.component';

describe('VideothumbnailComponent', () => {
  let component: VideothumbnailComponent;
  let fixture: ComponentFixture<VideothumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideothumbnailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideothumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
