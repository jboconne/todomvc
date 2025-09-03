import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    TodoListComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {}
