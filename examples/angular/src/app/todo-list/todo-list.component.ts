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

  // Toggles completion state of all todos based on checkbox state
  async toggleAll(e: Event) {
    const input = e.target as HTMLInputElement;
    await this.todosService.toggleAll(input.checked);
  }
}
