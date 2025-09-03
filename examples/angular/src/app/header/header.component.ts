import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../todos.service';

@Component({
  standalone: true,
  selector: 'app-todo-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private todosService = inject(TodosService);

  title = '';
  highPriority = false;

  async addTodo() {
    if (this.title.trim()) {
      await this.todosService.addItem(this.title.trim(), this.highPriority);

      // Reset title and priority to clear input field.
      this.title = '';
      this.highPriority = false;
    }
  }

  togglePriority() {
    this.highPriority = !this.highPriority;
  }
}
