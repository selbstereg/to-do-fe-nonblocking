import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ToDo} from '../../../common/state/glob-state';
import {MatDialog} from '@angular/material';
import {ToDoEditorComponent} from './edit-modal/to-do-editor.component';
import DebounceTimer from '../../../common/utils/debounce-timer';
import {LONG_CLICK_INTERVAL_MS} from '../../../common/constants';
import {LoggingService} from '../../../common/logging/logging.service';


@Component({
  selector: 'to-do-ui',
  templateUrl: './to-do-ui.component.html',
  styleUrls: ['./to-do-ui.component.css']
})
export class ToDoUiComponent { // TODO Paul Bauknecht 07 08 2021: Rename to ToDoItemComponent
  @Input() toDo: ToDo;

  @Output() toDoDeleted = new EventEmitter<void>();

  private isMarked = false;
  private longClickTimer = new DebounceTimer(LONG_CLICK_INTERVAL_MS);
  private isLongClicking = false;

  constructor(private dialogService: MatDialog) {
    this.onLongClick = this.onLongClick.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
  }

  onClick() {
    this.isMarked = !this.isMarked;
  }

  styleMarked() {
    return this.isMarked ? 'marked-to-do' : '';
  }

  openEditModal() {
    this.dialogService.open(ToDoEditorComponent, {
      minWidth: 280,
      data: {
        toDoToEdit: this.toDo
      }
    });
  }

  onLongClick() {
    this.isLongClicking = false;
    this.openEditModal();
  }

  onMouseDown() {
    this.isLongClicking = true;
    this.longClickTimer.start(() => this.onLongClick());
  }

  onMouseMove() {
    this.longClickTimer.stop();
  }

  onMouseUp() {
    this.isLongClicking = false;
    this.longClickTimer.stop();
  }

  deleteToDo(): void {
    this.toDoDeleted.emit();
  }
}
