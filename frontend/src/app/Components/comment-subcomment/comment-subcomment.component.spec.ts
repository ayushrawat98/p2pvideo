import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSubcommentComponent } from './comment-subcomment.component';

describe('CommentSubcommentComponent', () => {
  let component: CommentSubcommentComponent;
  let fixture: ComponentFixture<CommentSubcommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentSubcommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentSubcommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
