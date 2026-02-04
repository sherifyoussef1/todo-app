import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { ITodo } from '../Models/ITodo';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1: Service should be created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 2: Should fetch todos from API
  it('should fetch todos from API', (done) => {
    const mockTodos: ITodo[] = [{ id: 1, title: 'Test Todo', completed: false, userId: 1 }];

    service.getTodos().subscribe({
      next: (todos) => {
        expect(todos.length).toBeGreaterThan(0);
      },
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  // Test 3: Should add a new todo
  it('should add a new todo', (done) => {
    const newTodo: ITodo = { title: 'New Todo', completed: false };

    service.addTodo(newTodo).subscribe({
      next: (todo) => {
        expect(todo.title).toBe('New Todo');
        expect(todo.id).toBeDefined();
      },
    });
  });

  // Test 4: Should update a todo
  it('should update a todo', (done) => {
    const updatedTodo: ITodo = { id: 1, title: 'Updated', completed: true, userId: 1 };

    service.updateTodo(updatedTodo).subscribe({
      next: (todo) => {
        expect(todo.title).toBe('Updated');
        expect(todo.completed).toBe(true);
      },
    });
  });

  // Test 5: Should delete a todo
  it('should delete a todo', (done) => {
    service.deleteTodo(1).subscribe({
      next: (result) => {
        expect(result).toBeTruthy();
      },
    });
  });
});
