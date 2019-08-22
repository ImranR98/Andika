import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';


import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatTableModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatDividerModule,
  MatListModule,
  MatTabsModule,
  MatDialogModule,
  MatChipsModule,
  MatTooltipModule,
  MatExpansionModule,
  MatToolbarModule,
} from '@angular/material';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './about/about.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthInterceptor } from './httpInterceptor';
import { DeleteAccountDialogComponent } from './dashboard/delete-account-dialog/delete-account-dialog.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './notes/note/note.component';
import { NoteDialogComponent } from './notes/note/note-dialog/note-dialog.component';
import { TagComponent } from './tag/tag.component';
import { DeleteNoteDialogComponent } from './notes/note/delete-note-dialog/delete-note-dialog.component';
import { LoginComponent } from './login/login.component';
import { ArchivedComponent } from './archived/archived.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    Error404Component,
    AboutComponent,
    DashboardComponent,
    DeleteAccountDialogComponent,
    NotesComponent,
    NoteComponent,
    NoteDialogComponent,
    TagComponent,
    DeleteNoteDialogComponent,
    LoginComponent,
    ArchivedComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatChipsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatToolbarModule
  ],
  providers: [{ provide: UserService, useClass: UserService },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
    deps: [Injector]
  }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeleteAccountDialogComponent, NoteDialogComponent, DeleteNoteDialogComponent]
})
export class AppModule { }