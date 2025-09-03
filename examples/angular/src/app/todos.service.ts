import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

export interface Todo {
  id?: number;
  title: string;
  completed: boolean;
  highPriority: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class TodosService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'http://localhost:3000/api';
  
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();
  
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.loadTodos();
  }

  private handleError(operation: string) {
    return (error: any): Observable<any> => {
      console.error(`TodosService ${operation} failed:`, error);
      this.errorSubject.next(`Failed to ${operation}. Please ensure the backend server is running.`);
      return of(null);
    };
  }

  private updateLocalTodos(todos: Todo[]): void {
    this.todosSubject.next(todos);
    this.errorSubject.next(null);
  }

  async loadTodos(): Promise<void> {
    try {
      const todos = await this.http.get<Todo[]>(`${this.API_BASE}/todos`)
        .pipe(catchError(this.handleError('load todos')))
        .toPromise();
      
      if (todos) {
        this.updateLocalTodos(todos);
      }
    } catch (error) {
      this.handleError('load todos')(error);
    }
  }

  async addItem(title: string, highPriority: boolean = false): Promise<void> {
    try {
      const newTodo = await this.http.post<Todo>(`${this.API_BASE}/todos`, {
        title,
        completed: false,
        highPriority
      }).pipe(catchError(this.handleError('add todo'))).toPromise();

      if (newTodo) {
        const currentTodos = this.todosSubject.value;
        this.updateLocalTodos([newTodo, ...currentTodos]);
      }
    } catch (error) {
      this.handleError('add todo')(error);
    }
  }

  async removeItem(todo: Todo): Promise<void> {
    if (!todo.id) return;

    try {
      await this.http.delete(`${this.API_BASE}/todos/${todo.id}`)
        .pipe(catchError(this.handleError('delete todo')))
        .toPromise();

      const currentTodos = this.todosSubject.value;
      this.updateLocalTodos(currentTodos.filter(t => t.id !== todo.id));
    } catch (error) {
      this.handleError('delete todo')(error);
    }
  }

  async updateItem(todo: Todo): Promise<void> {
    if (!todo.id) return;

    try {
      const updatedTodo = await this.http.put<Todo>(`${this.API_BASE}/todos/${todo.id}`, todo)
        .pipe(catchError(this.handleError('update todo')))
        .toPromise();

      if (updatedTodo) {
        const currentTodos = this.todosSubject.value;
        const index = currentTodos.findIndex(t => t.id === todo.id);
        if (index >= 0) {
          currentTodos[index] = updatedTodo;
          this.updateLocalTodos([...currentTodos]);
        }
      }
    } catch (error) {
      this.handleError('update todo')(error);
    }
  }

  async clearCompleted(): Promise<void> {
    try {
      await this.http.delete(`${this.API_BASE}/todos/completed`)
        .pipe(catchError(this.handleError('clear completed todos')))
        .toPromise();

      const currentTodos = this.todosSubject.value;
      this.updateLocalTodos(currentTodos.filter(todo => !todo.completed));
    } catch (error) {
      this.handleError('clear completed todos')(error);
    }
  }

  async toggleAll(completed: boolean): Promise<void> {
    try {
      const todos = await this.http.put<Todo[]>(`${this.API_BASE}/todos/toggle-all`, { completed })
        .pipe(catchError(this.handleError('toggle all todos')))
        .toPromise();

      if (todos) {
        this.updateLocalTodos(todos);
      }
    } catch (error) {
      this.handleError('toggle all todos')(error);
    }
  }

  async togglePriority(todo: Todo): Promise<void> {
    const updatedTodo = { ...todo, highPriority: !todo.highPriority };
    await this.updateItem(updatedTodo);
  }

  getItems(type = 'all'): Todo[] {
    const todos = this.todosSubject.value;
    
    switch (type) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      case 'high-priority':
        return todos.filter((todo) => todo.highPriority);
      case 'active-high-priority':
        return todos.filter((todo) => !todo.completed && todo.highPriority);
      case 'completed-high-priority':
        return todos.filter((todo) => todo.completed && todo.highPriority);
    }

    return todos;
  }
}
