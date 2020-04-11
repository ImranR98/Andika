import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './about/about.component';
import { UserService } from './services/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthInterceptor } from './httpInterceptor';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './notes/note/note.component';
import { NoteDialogComponent } from './notes/note/note-dialog/note-dialog.component';
import { DeleteNoteDialogComponent } from './notes/note/delete-note-dialog/delete-note-dialog.component';
import { LoginComponent } from './login/login.component';
import { ArchivedComponent } from './archived/archived.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    Error404Component,
    AboutComponent,
    DashboardComponent,
    NotesComponent,
    NoteComponent,
    NoteDialogComponent,
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
  entryComponents: [NoteDialogComponent, DeleteNoteDialogComponent]
})
export class AppModule { }