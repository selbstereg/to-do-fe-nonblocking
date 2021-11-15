import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ToDo} from '../../../common/state/to-do-list-state/glob-state';
import {MatDialog} from '@angular/material';
import {ToDoEditorComponent} from './edit-modal/to-do-editor.component';
import DebounceTimer from '../../../common/utils/debounce-timer';
import {LONG_CLICK_INTERVAL_MS} from '../../../common/constants';


@Component({
  selector: 'to-do-ui',
  templateUrl: './to-do-item.component.html',
  styleUrls: ['./to-do-item.component.css']
})
export class ToDoItemComponent {
  @Input() toDo: ToDo;

  @Output() toDoDeleted = new EventEmitter<void>();

  private isMarked = false;
  private wasClickedRecently = false;
  private doubleClickTimer = new DebounceTimer(LONG_CLICK_INTERVAL_MS);

  constructor(private dialogService: MatDialog) {
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
  }

  onClick() {
    this.isMarked = !this.isMarked;
    if (this.wasClickedRecently) {
      this.onDoubleClick();
    } else {
      this.wasClickedRecently = true;
      this.doubleClickTimer.start(() => this.wasClickedRecently = false);
    }
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

  onDoubleClick() {
    this.openEditModal();
  }

  deleteToDo(): void {
    this.toDoDeleted.emit();
  }
}
