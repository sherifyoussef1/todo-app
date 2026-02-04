import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoFormComponent } from './todo-form.component';
import { TodoService } from '../Services/todo.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ITodo } from '../Models/ITodo';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;
  let mockTodoService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  const mockTodo: ITodo = { id: 1, title: 'Test Todo', completed: false, userId: 1 };

  beforeEach(async () => {
    // Create mock objects manually
    mockTodoService = {
      getTodoById: (id: number) => of(mockTodo),
      addTodo: (todo: ITodo) => of(mockTodo),
      updateTodo: (todo: ITodo) => of(mockTodo),
    };

    mockRouter = {
      navigate: (commands: any[]) => Promise.resolve(true),
    };

    mockActivatedRoute = {
      snapshot: { params: {} },
    };

    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
  });

  // Test 1: Component should be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 2: Should initialize in add mode by default
  it('should be in add mode by default', () => {
    component.ngOnInit();

    expect(component.isEditMode).toBe(false);
  });

  // Test 3: Should show error for empty title
  it('should show error for empty title', () => {
    component.todo.title = '';

    component.submit();

    expect(component.errorMessage).toBe('Title is required and cannot be empty.');
  });

  // Test 4: Should add a new todo
  it('should add a new todo', () => {
    component.todo.title = 'New Todo';
    component.isEditMode = false;

    component.submit();

    expect(component.todo.title).toBe('New Todo');
  });

  // Test 5: Should load todo in edit mode
  it('should load todo for editing', () => {
    component.loadTodo(1);

    expect(component.todo.title).toBe('Test Todo');
    expect(component.loading).toBe(false);
  });
});
