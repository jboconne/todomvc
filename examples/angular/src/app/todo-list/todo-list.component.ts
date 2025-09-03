import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Todo, TodosService } from '../todos.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';

@Component({
    selector: 'app-todo-list',
    standalone: true,
    imports: [TodoItemComponent],
    templateUrl: './todo-list.component.html',
})
export class TodoListComponent {
  private location = inject(Location);
  private todosService = inject(TodosService);

  // Gets todos filtered by the current route path ('all', 'active', 'completed', 'high-priority', etc.)
  get todos(): Todo[] {
    const filter = this.location.path().split('/')[1] || 'all';
    return this.todosService.getItems(filter);
  }

  // Gets only active (non-completed) todos
  get activeTodos(): Todo[] {
    return this.todosService.getItems('active');
  }

  // Removes a specific todo item from the list
  removeTodo(todo: Todo): void {
    this.todosService.removeItem(todo);
  }

  // Toggles completion state of all todos based on checkbox state
  toggleAll(e: Event) {
    const input = e.target as HTMLInputElement;
    this.todosService.toggleAll(input.checked);
  }
}
