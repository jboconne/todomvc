import { Injectable } from '@angular/core';

export interface Todo {
  title: string;
  completed: boolean;
  highPriority: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
    todos: Todo[] = [];

    addItem(title: string, highPriority: boolean = false): void {
      const todo: Todo = {
        title,
        completed: false,
        highPriority,
      };
      this.todos.push(todo);
    }

    removeItem(todo: Todo): void {
      const index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
    }

    clearCompleted(): void {
      this.todos = this.todos.filter((todo) => !todo.completed);
    }

    toggleAll(completed: boolean): void {
      this.todos = this.todos.map((todo) => ({ ...todo, completed }));
    }

    togglePriority(todo: Todo): void {
      todo.highPriority = !todo.highPriority;
    }

    getItems(type = 'all'): Todo[] {
      switch (type) {
        case 'active':
          return this.todos.filter((todo) => !todo.completed);
        case 'completed':
          return this.todos.filter((todo) => todo.completed);
        case 'high-priority':
          return this.todos.filter((todo) => todo.highPriority);
        case 'active-high-priority':
          return this.todos.filter((todo) => !todo.completed && todo.highPriority);
        case 'completed-high-priority':
          return this.todos.filter((todo) => todo.completed && todo.highPriority);
      }

      return this.todos;
    }
}
