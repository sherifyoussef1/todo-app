import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../Services/todo.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ITodo } from '../Models/ITodo';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: any;

  const mockTodos: ITodo[] = [
    { id: 1, title: 'Test Todo 1', completed: false, userId: 1 },
    { id: 2, title: 'Test Todo 2', completed: true, userId: 1 },
  ];

  beforeEach(async () => {
    // Create mock service manually
    mockTodoService = {
      getTodos: () => of(mockTodos),
      deleteTodo: (id: number) => of(true),
    };

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: mockTodoService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  // Test 1: Component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Should load todos on initialization
  it('should load todos on init', () => {
    component.ngOnInit();

    expect(component.todos.length).toBe(2);
  });

  // Test 3: Should set loading to false after fetching todos
  it('should set loading to false after fetching', () => {
    component.fetchTodos();

    expect(component.loading).toBe(false);
  });

  // Test 4: Should delete a todo
  it('should delete a todo', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    component.todos = [...mockTodos];
    component.deleteTodo(1, 'Test Todo 1');

    expect(component.todos.length).toBe(1);

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  // Test 5: Should handle errors when fetching todos
  it('should show error message on fetch failure', () => {
    const errorResponse = new Error('Failed to load');
    mockTodoService.getTodos = () => throwError(() => errorResponse);

    component.fetchTodos();

    expect(component.errorMessage).toBe('Failed to load todos. Please try again.');
    expect(component.loading).toBe(false);
  });
});
