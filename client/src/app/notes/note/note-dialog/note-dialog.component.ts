import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { INote, IUpdateNote, IAddNote } from 'src/app/models/notes.models';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips'
import { NotesService } from 'src/app/services/notes.service';
import { ErrorService } from 'src/app/services/error.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DeleteNoteDialogComponent } from '../delete-note-dialog/delete-note-dialog.component';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.sass']
})
export class NoteDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NoteDialogComponent>, private noteService: NotesService, private errorService: ErrorService, @Inject(MAT_DIALOG_DATA) public data: { note: INote, imageSrc: string } | null, private dialog: MatDialog) { }

  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  disableForm: boolean = false;

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    note: new FormControl(''),
    tags: new FormControl('')
  });

  tags: string[] = [];

  allowedTypes: string[] = ['jpg', 'jpeg', 'png'];
  allowedTypesString: string = '';
  allowedTypesError: string = '';
  fileSizeLimit: number = 5242880;
  fileSizeLimitString: string = '5MB';
  image: File;

  ngOnInit() {
    this.generateAllowedTypeStringAndError();
    if (this.data) {
      this.noteForm.controls['title'].setValue(this.data.note.title);
      this.noteForm.controls['note'].setValue(this.data.note.note);
      for (let i = 0; i < this.data.note.tags.length; i++) {
        this.tags.push(this.data.note.tags[i]);
      }
    }

  }

  //Generates the error message for allowed file types, based on the array
  generateAllowedTypeStringAndError() {
    this.allowedTypesString = '';
    this.allowedTypesError = 'Only ';
    for (let i = 0; i < this.allowedTypes.length; i++) {
      if (i < this.allowedTypes.length - 2) {
        this.allowedTypesError += this.allowedTypes[i].toUpperCase() + ', ';
        this.allowedTypesString += '.' + this.allowedTypes[i] + ', ';
      } else if (i < this.allowedTypes.length - 1) {
        this.allowedTypesError += this.allowedTypes[i].toUpperCase() + ' and ';
        this.allowedTypesString += '.' + this.allowedTypes[i] + ', ';
      } else {
        this.allowedTypesError +=
          this.allowedTypes[i].toUpperCase() + ' file types are accepted';
        this.allowedTypesString += '.' + this.allowedTypes[i];
      }
    }
  }

  selectImage(e: Event) {
    const fileInput: HTMLInputElement = <HTMLInputElement>e.target;
    let f: File = fileInput.files[0];

    //Type, size and filename checking
    let valid: boolean = false;
    let validType: boolean = false;
    for (let i = 0; i < this.allowedTypes.length; i++) {
      if (f.type.indexOf(this.allowedTypes[i]) != -1) {
        validType = true;
      }
    }
    if (validType) {
      if (f.size <= this.fileSizeLimit) {
        valid = true;
      } else {
        this.errorService.showError(
          'Files cannot exceed ' + this.fileSizeLimitString + ' in size'
        );
      }
    } else {
      this.errorService.showError(this.allowedTypesError);
    }

    if (valid) {
      this.image = f;
      this.errorService.clearError();
    }
  }

  convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        let result: any = reader.result;
        result = result.substring(result.indexOf(';base64,') + 8);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  };

  removeImage() {
    this.image = null;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  deleteNote() {
    if (this.data) {
      this.disableForm = true;
      this.dialog.open(DeleteNoteDialogComponent, {
        width: '250px',
      }).afterClosed().subscribe((val) => {
        if (val) {
          this.noteService.deleteNote(this.data.note.noteId).then(() => {
            this.disableForm = false;
            this.dialogRef.close();
          }).catch((err) => {
            this.errorService.showError(err);
            this.disableForm = false;
          });
        } else {
          this.disableForm = false;
        }
      });
    }
  }

  archiveNote() {
    if (this.data) {
      this.disableForm = true;
      this.noteService.archiveNote(this.data.note.noteId).then(() => {
        this.disableForm = false;
      }).catch((err) => {
        this.errorService.showError(err);
        this.disableForm = false;
      });
    }
  }

  unArchiveNote() {
    if (this.data) {
      this.disableForm = true;
      this.noteService.unArchiveNote(this.data.note.noteId).then(() => {
        this.disableForm = false;
      }).catch((err) => {
        this.errorService.showError(err);
        this.disableForm = false;
      });
    }
  }

  updateNote() {
    if (this.data) {
      let tempNote: IUpdateNote = {
        noteId: this.data.note.noteId,
        title: this.noteForm.controls['title'].value,
        note: this.noteForm.controls['note'].value,
        tags: this.tags,
        imageType: null,
        imageBase64: null
      }
      this.disableForm = true;

      this.convertFileToBase64(this.image).then((fileBase64: string) => {
        if (fileBase64) {
          tempNote.imageType = this.image.type;
          tempNote.imageBase64 = fileBase64;
        } else {
          tempNote.imageType = null;
          tempNote.imageBase64 = null;
        }
        this.noteService.updateNote(tempNote).then(() => {
          this.noteForm.reset();
          this.removeImage();
          this.disableForm = false;
          this.dialogRef.close();
        }).catch((err) => {
          this.errorService.showError(err);
          this.disableForm = false;
        });
      }).catch((err) => {
        this.errorService.showSimpleSnackBar("Error saving file, please retry.")
      })
    }
  }

  addNote() {
    if (this.noteForm.valid) {
      this.disableForm = true;
      let tempNote: IAddNote = {
        title: this.noteForm.controls['title'].value,
        note: this.noteForm.controls['note'].value,
        tags: this.tags,
        archived: false,
        pinned: false,
        imageType: null,
        imageBase64: null
      };

      this.convertFileToBase64(this.image).then((fileBase64: string) => {
        if (fileBase64) {
          tempNote.imageType = this.image.type;
          tempNote.imageBase64 = fileBase64;
        } else {
          tempNote.imageType = null;
          tempNote.imageBase64 = null;
        }
        this.noteService.addNote(tempNote).then(() => {
          this.noteForm.reset();
          this.removeImage();
          this.disableForm = false;
          this.dialogRef.close();
        }).catch((err) => {
          this.errorService.showError(err);
          this.disableForm = false;
        });
      }).catch((err) => {
        this.errorService.showSimpleSnackBar("Error saving file, please retry.")
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

}
