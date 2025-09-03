import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodosService } from '../todos.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements AfterViewChecked {
  @Input({ required: true }) todo!: Todo;

  @Output() remove = new EventEmitter<Todo>();

  @ViewChild('todoInputRef') inputRef?: ElementRef;

  private todosService = inject(TodosService);

  title = '';

  isEditing = false;

  toggleTodo(): void {
    this.todo.completed = !this.todo.completed;
  }
  
  removeTodo(): void {
    this.remove.emit(this.todo);
  }

  startEdit() {
    this.isEditing = true;
  }

  handleBlur(e: Event) {
    this.isEditing = false;
  }

  handleFocus(e: Event) {
    this.title = this.todo.title;
  }

  updateTodo() {
    if (!this.title) {
      this.remove.emit(this.todo);
    } else {
      this.todo.title = this.title;
    }

    this.isEditing = false;
  }

  togglePriority() {
    this.todosService.togglePriority(this.todo);
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }
}
