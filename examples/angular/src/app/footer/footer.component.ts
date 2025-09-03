import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Todo, TodosService } from '../todos.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private location = inject(Location);
  private todosService = inject(TodosService);

  get todos(): Todo[] {
    return this.todosService.getItems();
  }

  get activeTodos(): Todo[] {
    return this.todosService.getItems('active');
  }

  get completedTodos(): Todo[] {
    return this.todosService.getItems('completed');
  }

  get highPriorityTodos(): Todo[] {
    return this.todosService.getItems('high-priority');
  }

  get activeHighPriorityTodos(): Todo[] {
    return this.todosService.getItems('active-high-priority');
  }

  get completedHighPriorityTodos(): Todo[] {
    return this.todosService.getItems('completed-high-priority');
  }

  get filter(): string {
    return this.location.path().split('/')[1] || 'all';
  }

  get filteredTodos(): Todo[] {
    return this.todosService.getItems(this.filter);
  }

  clearCompleted() {
    this.todosService.clearCompleted();
  }
}
