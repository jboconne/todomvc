import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../todos.service';

@Component({
  standalone: true,
  selector: 'app-todo-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderComponent {
  private todosService = inject(TodosService);

  title = '';
  highPriority = false;

  addTodo() {
    if (this.title) {
      this.todosService.addItem(this.title, this.highPriority);

      // Reset title and priority to clear input field.
      this.title = '';
      this.highPriority = false;
    }
  }

  togglePriority() {
    this.highPriority = !this.highPriority;
  }
}
