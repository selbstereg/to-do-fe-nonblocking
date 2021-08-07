import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToDoListSelectionComponent } from './to-do-list-selection/to-do-list-selection.component';
import { ItemAdderComponent } from './common/item-adder/item-adder.component';
import { StopClickPropagation } from './common/stop-click-propagation';
import { DeleteButtonComponent } from './common/delete-button/delete-button.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSpinner, MatDialogModule } from '@angular/material';
import { Synchronizer } from './common/state/synchronizer.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorHandler } from './common/error/error-handler.service';
import {LoggingPageComponent} from './logging-page/logging-page.component';
import {LoggingService} from './common/logging/logging.service';
import {GlobState} from './common/state/glob-state';
import {OperationFiFo} from './common/state/fifo';
import {SyncBarComponent} from './sync-bar/sync-bar.component';
import {ToDoUiComponent} from './to-do-list-page/drag-drop-list/to-do-ui/to-do-ui.component';
import {DragDropListComponent} from './to-do-list-page/drag-drop-list/drag-drop-list.component';
import {ToDoListPageComponent} from './to-do-list-page/to-do-list-page.component';
import { ToDoEditorComponent } from './to-do-list-page/drag-drop-list/to-do-ui/edit-modal/to-do-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ToDoListSelectionComponent,
    ItemAdderComponent,
    StopClickPropagation,
    DeleteButtonComponent,
    ConfirmationDialogComponent,
    LoggingPageComponent,
    SyncBarComponent,
    ToDoListPageComponent,
    DragDropListComponent,
    ToDoUiComponent,
    ToDoEditorComponent
  ],
  imports: [
    DragDropModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    OverlayModule,
    MatSnackBarModule
  ],
  providers: [
    Synchronizer,
    ErrorHandler,
    LoggingService,
    GlobState,
    OperationFiFo
  ],
  bootstrap: [
    AppComponent,
    MatSpinner,
    // FavouriteEinkaufItems,
    ConfirmationDialogComponent,
    ToDoEditorComponent
  ]
})
export class AppModule { }
