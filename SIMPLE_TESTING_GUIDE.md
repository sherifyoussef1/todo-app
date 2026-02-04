# Simple Unit Testing Guide - Angular 21 Todo App

## 📋 What is Unit Testing?

Unit testing is testing individual pieces of your code (units) to make sure they work correctly. Think of it like testing each ingredient before baking a cake.

---

## 🛠 Tools We Use

### Jasmine

A testing framework that provides:

- `describe()` - Groups tests together
- `it()` - Defines a single test
- `expect()` - Checks if something is true

### Karma

A test runner that:

- Runs tests in a real browser
- Shows pass/fail results
- Watches for file changes

---

## 🚀 How to Run Tests

```bash
# Run all tests (watch mode - runs when files change)
ng test

# Run tests once and exit
ng test --watch=false

# Run with code coverage
ng test --code-coverage
```

---

### Example Setup

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],  // Import standalone component
    providers: [
      MyService,
      provideHttpClient(),        // For HTTP
      provideHttpClientTesting(), // For HTTP testing
      provideRouter([])           // For routing
    ]
  }).compileComponents();
});
```

---

## 📁 Test Files

We have 4 test files with 5 simple tests each:

### 1. **todo.service.spec.ts** - Tests TodoService

```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Test 1: Check if service is created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 2: Check if we can fetch todos
  it('should fetch todos from API', () => {
    const mockTodos = [{ id: 1, title: 'Test', completed: false, userId: 1 }];

    service.getTodos().subscribe(todos => {
      expect(todos.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);  // Send mock data
  });

  // Tests 3-5 follow similar pattern
});
```

**Key Points:**

- ✓ Use `provideHttpClient()` and `provideHttpClientTesting()`
- ✓ Both go in `providers` array
- ✓ Declare `httpMock` variable at the top
- ✓ No `done` callback needed - tests are synchronous

---

### 2. **todo-list.component.spec.ts** - Tests TodoListComponent

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['getTodos', 'deleteTodo']);

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],  // Import standalone component
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        provideRouter([])  // New way for Angular 21
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  // Tests here
});
```

**Key Points:**

- ✓ Use `provideRouter([])` instead of `RouterTestingModule`
- ✓ Import component in `imports` array (standalone)
- ✓ Create spy objects for mocking services

---

### 3. **todo-form.component.spec.ts** - Tests TodoFormComponent

```typescript
describe('TodoFormComponent', () => {
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockTodoService = jasmine.createSpyObj('TodoService', ['getTodoById', 'addTodo', 'updateTodo']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    mockActivatedRoute = {
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      imports: [TodoFormComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideRouter([])
      ]
    }).compileComponents();
  });

  // Tests here
});
```

**Key Points:**

- ✓ Mock `ActivatedRoute` for route parameters
- ✓ Mock `Router` for navigation testing
- ✓ Use spy objects to track method calls

---

### 4. **filter.pipe.spec.ts** - Tests FilterPipe

```typescript
describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();  // Simple instantiation
  });

  it('should filter completed todos', () => {
    const result = pipe.transform(mockTodos, 'completed', true);
    expect(result.length).toBe(1);
  });
});
```

**Key Points:**

- ✓ Pipes are simple - just create a new instance
- ✓ No TestBed needed for pure pipes
- ✓ Test input → output directly

---

## 🧩 Understanding Test Structure

Every test follows this pattern:

```typescript
describe('What we are testing', () => {
  // Setup code here
  
  it('should do something specific', () => {
    // 1. ARRANGE - Set up test data
    const todo = { title: 'Test', completed: false };
    
    // 2. ACT - Do the action
    component.addTodo(todo);
    
    // 3. ASSERT - Check the result
    expect(component.todos.length).toBe(1);
  });
});
```

---

## 📖 Common Jasmine Matchers

```typescript
// Check if value is true/exists
expect(value).toBeTruthy();

// Check if values are equal
expect(value).toBe(5);
expect(value).toEqual({ name: 'Test' });

// Check if greater/less than
expect(value).toBeGreaterThan(0);
expect(value).toBeLessThan(10);

// Check if array contains item
expect(array).toContain('item');

// Check if function was called
expect(mockFunction).toHaveBeenCalled();
expect(mockFunction).toHaveBeenCalledWith(arg1, arg2);
```

---

## 🔧 Common Fixes for Angular 21

### Fix 1: HttpClient Setup

```typescript
// ❌ Old way (deprecated)
imports: [HttpClientTestingModule]

// ✅ New way (Angular 14+)
providers: [
  provideHttpClient(),
  provideHttpClientTesting()
]
```

### Fix 2: Router Setup

```typescript
// ❌ Old way
imports: [RouterTestingModule]

// ✅ New way
providers: [provideRouter([])]
```

### Fix 3: Done Callback

```typescript
// ❌ Old way (TypeScript errors)
it('should work', (done) => {
  service.getData().subscribe(() => {
    expect(data).toBeTruthy();
    done();
  });
});

// ✅ New way (synchronous)
it('should work', () => {
  service.getData().subscribe(data => {
    expect(data).toBeTruthy();
  });
  // No done needed for synchronous tests
});
```

### Fix 4: Standalone Components

```typescript
// ❌ Old way
declarations: [MyComponent]

// ✅ New way
imports: [MyComponent]
```

---

## 📊 Reading Test Results

When you run `ng test`, you'll see:

```
TodoService
  ✓ should be created
  ✓ should fetch todos from API
  ✓ should add a new todo
  ✓ should update a todo
  ✓ should delete a todo

TodoListComponent
  ✓ should create
  ✓ should load todos on init
  ✓ should set loading to false after fetching
  ✓ should delete a todo
  ✓ should show error message on fetch failure

TodoFormComponent
  ✓ should create
  ✓ should be in add mode by default
  ✓ should show error for empty title
  ✓ should add a new todo
  ✓ should load todo for editing

FilterPipe
  ✓ should create an instance
  ✓ should filter completed todos
  ✓ should filter pending todos
  ✓ should filter by userId
  ✓ should return empty array for no matches

TOTAL: 20 specs, 0 failures ✓
```

- **Green ✓** = Test passed
- **Red ✗** = Test failed
- **Yellow** = Test skipped

---

## 🎯 What Gets Tested

### ✅ DO Test

- Functions work correctly
- Data is saved/loaded properly
- Errors are handled
- User actions do what they should
- Validation works

### ❌ DON'T Test

- Angular framework itself
- Third-party libraries
- CSS styling (usually)

---

## 📝 Quick Reference Checklist

Before your tests work, make sure:

- [ ] All variables are declared (`let httpMock: HttpTestingController`)
- [ ] Using `provideHttpClient()` instead of `HttpClientModule`
- [ ] Using `provideRouter([])` instead of `RouterTestingModule`
- [ ] Standalone components in `imports` array

---

## ✅ Summary

You now have **20 simple tests** (5 for each file) that:

- Use Angular 21's latest testing practices
- Work without TypeScript errors
- Follow best practices
- Are easy to understand and maintain

### File Locations

```
src/app/
├── Services/
│   └── todo.service.spec.ts
├── Pipes/
│   └── filter.pipe.spec.ts
├── todo-list/
│   └── todo-list.component.spec.ts
└── todo-form/
    └── todo-form.component.spec.ts
```

Run `ng test` and watch them all pass! 🎉

---

*Happy Testing!* 🚀
