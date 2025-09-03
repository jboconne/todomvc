import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FooterComponent } from './footer/footer.component';
import { TodosService } from './todos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    HeaderComponent,
    TodoListComponent,
    FooterComponent,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  private todosService = inject(TodosService);
  
  error$ = this.todosService.error$;
}
