import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITodo } from '../Models/ITodo';
import { Observable, of, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
  private todos: ITodo[] = [];
  private isInitialized = false;

  constructor(private http: HttpClient) {}

  // Fetch todos from API and store in memory
  getTodos(): Observable<ITodo[]> {
    if (this.isInitialized) {
      // Return from memory if already loaded
      return of(this.todos);
    }

    // Fetch from API first time only
    return this.http.get<ITodo[]>(this.apiUrl).pipe(
      map((todos) => todos.slice(0, 20)), // Get first 20 for easier viewing
      tap((todos) => {
        this.todos = todos;
        this.isInitialized = true;
      }),
    );
  }

  // Get a single todo by ID from memory
  getTodoById(id: number): Observable<ITodo | undefined> {
    const todo = this.todos.find((t) => t.id === id);
    return of(todo);
  }

  // Add new todo to memory
  addTodo(todo: ITodo): Observable<ITodo> {
    // Generate new ID
    const maxId = this.todos.length > 0 ? Math.max(...this.todos.map((t) => t.id || 0)) : 0;

    const newTodo: ITodo = {
      ...todo,
      id: maxId + 1,
      userId: 1,
    };

    // Add to beginning of array
    this.todos.unshift(newTodo);

    return of(newTodo);
  }

  // Update todo in memory
  updateTodo(todo: ITodo): Observable<ITodo> {
    const index = this.todos.findIndex((t) => t.id === todo.id);

    if (index !== -1) {
      this.todos[index] = { ...todo };
    }

    return of(todo);
  }

  // Delete todo from memory
  deleteTodo(id: number): Observable<boolean> {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);

    const wasDeleted = this.todos.length < initialLength;
    return of(wasDeleted);
  }
}
