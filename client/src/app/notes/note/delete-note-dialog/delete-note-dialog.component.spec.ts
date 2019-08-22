import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNoteDialogComponent } from './delete-note-dialog.component';

describe('DeleteNoteDialogComponent', () => {
  let component: DeleteNoteDialogComponent;
  let fixture: ComponentFixture<DeleteNoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteNoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteNoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
