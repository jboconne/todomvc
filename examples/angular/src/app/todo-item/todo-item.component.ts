import {
  Component,
  Input,
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

  @ViewChild('todoInputRef') inputRef?: ElementRef;

  private todosService = inject(TodosService);

  title = '';

  isEditing = false;

  async toggleTodo(): Promise<void> {
    const updatedTodo = { ...this.todo, completed: !this.todo.completed };
    await this.todosService.updateItem(updatedTodo);
  }
  
  async removeTodo(): Promise<void> {
    await this.todosService.removeItem(this.todo);
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

  async updateTodo() {
    if (!this.title.trim()) {
      await this.removeTodo();
    } else {
      const updatedTodo = { ...this.todo, title: this.title.trim() };
      await this.todosService.updateItem(updatedTodo);
    }

    this.isEditing = false;
  }

  async togglePriority() {
    await this.todosService.togglePriority(this.todo);
  }

  ngAfterViewChecked(): void {
    if (this.isEditing) {
      this.inputRef?.nativeElement.focus();
    }
  }
}
