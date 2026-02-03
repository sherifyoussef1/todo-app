# Angular To-Do Application - Complete Project Guide

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Core Concepts Explained](#core-concepts-explained)
5. [Component Breakdown](#component-breakdown)
6. [How the Application Works](#how-the-application-works)

---

## 📖 Project Overview

This is a **To-Do List Application** built with **Angular 21** (the latest version). The application allows users to:

- View a list of to-do items
- Add new to-do items
- Edit existing to-do items
- Delete to-do items
- Mark items as completed or pending

The app uses an **in-memory data storage** approach, meaning:

- Data is fetched from a public API on first load
- All changes (add/edit/delete) are stored in memory
- Data persists during your session
- Data resets when you refresh the page

---

## 🛠 Technologies Used

### 1. **Angular 21** (Framework)

Angular is a TypeScript-based web application framework developed by Google. It follows the **Component-Based Architecture** pattern.

**Key Features Used:**

- **Standalone Components** (new in Angular 14+, default in Angular 21)
- **Reactive Programming** with RxJS
- **Routing** for navigation
- **Two-way Data Binding** with ngModel
- **Dependency Injection** for services
- **Template Syntax** (@if, @for - new control flow syntax)

### 2. **TypeScript**

A superset of JavaScript that adds static typing. All Angular code is written in TypeScript.

### 3. **RxJS (Reactive Extensions for JavaScript)**

Used for handling asynchronous operations and data streams through Observables.

### 4. **HTML5 & CSS3**

For structure and styling of the user interface.

### 5. **HTTP Client**

Angular's built-in HTTP client for making API requests.

### 6. **JSONPlaceholder API**

A free fake REST API for testing: `https://jsonplaceholder.typicode.com/todos`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── Models/
│   │   └── ITodo.ts                    # Interface/Type definition for Todo
│   ├── Services/
│   │   └── todo.service.ts             # Business logic and data management
│   ├── Pipes/
│   │   └── filter.pipe.ts              # Custom pipe for filtering todos
│   ├── todo-list/
│   │   ├── todo-list.component.ts      # List component logic
│   │   ├── todo-list.component.html    # List component template
│   │   └── todo-list.component.css     # List component styles
│   ├── todo-form/
│   │   ├── todo-form.component.ts      # Form component logic
│   │   ├── todo-form.component.html    # Form component template
│   │   └── todo-form.component.css     # Form component styles
│   ├── app.component.ts                # Root component
│   ├── app.html                        # Root template
│   ├── app.scss                        # Global styles
│   ├── app.routes.ts                   # Routing configuration
│   └── app.config.ts                   # App configuration (not shown but exists)
├── index.html                          # Entry HTML file
└── main.ts                             # Application entry point
```

---

## 🧠 Core Concepts Explained

### 1. **Component**

A component is a building block of Angular applications. It consists of:

- **TypeScript Class** (.ts file) - Contains logic and data
- **HTML Template** (.html file) - Defines the view
- **CSS Styles** (.css file) - Defines the appearance

```typescript
@Component({
  selector: 'app-todo-list',      // HTML tag to use this component
  imports: [CommonModule],         // Dependencies needed
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent { }
```

### 2. **Service**

A service is a class that contains business logic and can be shared across components. Services are **injectable** using Angular's Dependency Injection system.

```typescript
@Injectable({
  providedIn: 'root',  // Makes it available app-wide
})
export class TodoService { }
```

### 3. **Observable**

An Observable is a stream of data that can be subscribed to. It's part of RxJS and used for asynchronous operations.

```typescript
getTodos(): Observable<ITodo[]> {
  return this.http.get<ITodo[]>(this.apiUrl);
}

// Subscribe to get the data
this.todoService.getTodos().subscribe({
  next: (data) => { /* handle success */ },
  error: (err) => { /* handle error */ }
});
```

### 4. **Routing**

Routing allows navigation between different views/components without page reload.

```typescript
export const routes: Routes = [
  { path: '', component: TodoListComponent },      // Home page
  { path: 'add', component: TodoFormComponent },   // Add page
  { path: 'edit/:id', component: TodoFormComponent } // Edit page with ID
];
```

### 5. **Two-Way Data Binding**

Synchronizes data between the component and the view automatically.

```html
<input [(ngModel)]="todo.title" />
```

When you type in the input, `todo.title` updates automatically, and vice versa.

### 6. **Dependency Injection**

Angular automatically provides instances of services to components through the constructor.

```typescript
constructor(private todoService: TodoService) { }
// Angular automatically creates and injects TodoService
```

---

## 🔍 Component Breakdown

### **1. ITodo Interface (Model)**

```typescript
export interface ITodo {
  id?: number;        // Optional, generated for new items
  title: string;      // Required, the todo text
  completed: boolean; // Status of the todo
  userId?: number;    // Optional, user who owns the todo
}
```

**Purpose:** Defines the structure/shape of a todo object. TypeScript uses this for type checking.

---

### **2. TodoService**

**Location:** `src/app/Services/todo.service.ts`

**Purpose:** Manages all data operations (CRUD - Create, Read, Update, Delete)

**Key Properties:**

```typescript
private apiUrl = 'https://jsonplaceholder.typicode.com/todos';
private todos: ITodo[] = [];           // In-memory storage
private isInitialized = false;         // Track if data loaded
```

**Key Methods:**

1. **getTodos()** - Fetches todos from API or returns from memory

```typescript
getTodos(): Observable<ITodo[]> {
  if (this.isInitialized) {
    return of(this.todos);  // Return from memory
  }
  // Fetch from API and store in memory
  return this.http.get<ITodo[]>(this.apiUrl).pipe(
    map(todos => todos.slice(0, 20)),  // Take first 20
    tap(todos => {
      this.todos = todos;
      this.isInitialized = true;
    })
  );
}
```

1. **getTodoById(id)** - Finds a specific todo

```typescript
getTodoById(id: number): Observable<ITodo | undefined> {
  const todo = this.todos.find(t => t.id === id);
  return of(todo);
}
```

1. **addTodo(todo)** - Adds new todo to memory

```typescript
addTodo(todo: ITodo): Observable<ITodo> {
  const maxId = Math.max(...this.todos.map(t => t.id || 0));
  const newTodo = { ...todo, id: maxId + 1, userId: 1 };
  this.todos.unshift(newTodo);  // Add to beginning
  return of(newTodo);
}
```

1. **updateTodo(todo)** - Updates existing todo

```typescript
updateTodo(todo: ITodo): Observable<ITodo> {
  const index = this.todos.findIndex(t => t.id === todo.id);
  if (index !== -1) {
    this.todos[index] = { ...todo };
  }
  return of(todo);
}
```

1. **deleteTodo(id)** - Removes todo from memory

```typescript
deleteTodo(id: number): Observable<boolean> {
  this.todos = this.todos.filter(t => t.id !== id);
  return of(true);
}
```

**RxJS Operators Used:**

- `of()` - Creates an Observable from a value
- `map()` - Transforms the data
- `tap()` - Performs side effects without changing data
- `pipe()` - Chains multiple operators together

---

### **3. TodoListComponent**

**Location:** `src/app/todo-list/`

**Purpose:** Displays the list of todos and handles delete operations

**Key Properties:**

```typescript
todos: ITodo[] = [];           // Array to hold todos
loading = false;               // Loading state
errorMessage = '';             // Error message to display
```

**Lifecycle Hook:**

```typescript
ngOnInit() {
  this.fetchTodos();  // Called when component initializes
}
```

**Key Methods:**

1. **fetchTodos()** - Loads todos from service

```typescript
fetchTodos() {
  this.loading = true;
  this.errorMessage = '';
  
  this.todoService.getTodos().subscribe({
    next: (data) => {
      this.todos = data;
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = 'Failed to load todos. Please try again.';
    },
  });
}
```

1. **deleteTodo(id, title)** - Deletes a todo with confirmation

```typescript
deleteTodo(id: number, title: string) {
  if (confirm(`Are you sure you want to delete "${title}"?`)) {
    this.todoService.deleteTodo(id).subscribe({
      next: (success) => {
        if (success) {
          this.todos = this.todos.filter((todo) => todo.id !== id);
        }
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while deleting the todo.';
      },
    });
  }
}
```

**Template Features:**

```html
<!-- Control Flow: @if directive (Angular 17+) -->
@if (loading) {
  <div class="loading">Loading todos...</div>
}

@if (errorMessage) {
  <div class="error">{{ errorMessage }}</div>
}

<!-- Control Flow: @for directive -->
@for (todo of todos; track todo.id) {
  <li class="todo-item">
    <span [class.completed]="todo.completed">{{ todo.title }}</span>
    <button (click)="deleteTodo(todo.id!, todo.title)">Delete</button>
  </li>
}

<!-- Property Binding -->
<span [class.completed]="todo.completed">

<!-- Event Binding -->
<button (click)="deleteTodo(todo.id!, todo.title)">

<!-- Interpolation -->
{{ todo.title }}
```

---

### **4. TodoFormComponent**

**Location:** `src/app/todo-form/`

**Purpose:** Handles adding new todos and editing existing ones

**Key Properties:**

```typescript
todo: ITodo = { title: '', completed: false };  // Form data
isEditMode = false;                             // Add or Edit mode
errorMessage = '';                              // Validation errors
loading = false;                                // Loading state
todoId: number | null = null;                   // ID when editing
```

**How It Determines Add vs Edit:**

```typescript
ngOnInit() {
  const id = this.route.snapshot.params['id'];  // Get ID from URL
  if (id) {
    this.isEditMode = true;   // If ID exists, it's edit mode
    this.todoId = +id;        // Convert string to number
    this.loadTodo(this.todoId);
  }
  // If no ID, it's add mode (default)
}
```

**Key Methods:**

1. **loadTodo(id)** - Loads todo data for editing

```typescript
loadTodo(id: number) {
  this.loading = true;
  this.todoService.getTodoById(id).subscribe({
    next: (todo) => {
      if (todo) {
        this.todo = { ...todo };  // Copy to form
        this.loading = false;
      }
    },
    error: (err) => {
      this.errorMessage = 'Failed to load todo.';
      this.loading = false;
    },
  });
}
```

1. **submit()** - Handles form submission

```typescript
submit() {
  // Validation
  if (!this.todo.title || !this.todo.title.trim()) {
    this.errorMessage = 'Title is required and cannot be empty.';
    return;
  }

  if (this.todo.title.trim().length < 3) {
    this.errorMessage = 'Title must be at least 3 characters long.';
    return;
  }

  // Call appropriate method
  if (this.isEditMode) {
    this.updateTodo();
  } else {
    this.addTodo();
  }
}
```

1. **addTodo()** - Adds new todo

```typescript
addTodo() {
  this.todoService.addTodo(this.todo).subscribe({
    next: (newTodo) => {
      this.router.navigate(['/']);  // Navigate to list
    },
    error: (err) => {
      this.errorMessage = 'Failed to add todo.';
    },
  });
}
```

1. **updateTodo()** - Updates existing todo

```typescript
updateTodo() {
  this.todoService.updateTodo(this.todo).subscribe({
    next: (updatedTodo) => {
      this.router.navigate(['/']);  // Navigate to list
    },
    error: (err) => {
      this.errorMessage = 'Failed to update todo.';
    },
  });
}
```

**Template Features:**

```html
<!-- Two-Way Data Binding with ngModel -->
<input 
  type="text" 
  [(ngModel)]="todo.title"  
  name="title"
  required
  minlength="3"
/>

<!-- Template Reference Variable -->
<input #titleInput="ngModel" />

<!-- Conditional Display of Validation Errors -->
@if (titleInput.invalid && titleInput.touched) {
  <div class="field-error">
    @if (titleInput.errors?.['required']) {
      <small>Title is required</small>
    }
  </div>
}

<!-- Form Submission -->
<form (ngSubmit)="submit()">

<!-- Conditional Button Text -->
<button type="submit">
  @if (isEditMode) {
    💾 Update Todo
  } @else {
    ✓ Add Todo
  }
</button>
```

---

### **5. FilterPipe**

**Location:** `src/app/Pipes/filter.pipe.ts`

**Purpose:** Custom pipe to filter todos by a property (used for counting)

```typescript
@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: ITodo[], field: string, value: any): ITodo[] {
    if (!items || !field) {
      return items;
    }
    return items.filter(item => item[field as keyof ITodo] === value);
  }
}
```

**Usage in Template:**

```html
Completed: {{ (todos | filter:'completed':true).length }}
Pending: {{ (todos | filter:'completed':false).length }}
```

---

### **6. App Routes**

**Location:** `src/app/app.routes.ts`

```typescript
export const routes: Routes = [
  { path: '', component: TodoListComponent },           // localhost:4200/
  { path: 'add', component: TodoFormComponent },        // localhost:4200/add
  { path: 'edit/:id', component: TodoFormComponent },   // localhost:4200/edit/5
];
```

**Route Parameters:**

- `:id` is a route parameter (dynamic)
- Accessed in component: `this.route.snapshot.params['id']`

---

## 🔄 How the Application Works

### **Complete Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                        USER OPENS APP                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  main.ts bootstraps App component                           │
│  App component renders <router-outlet>                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Router loads TodoListComponent (default route: '/')        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  TodoListComponent.ngOnInit() calls fetchTodos()            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  TodoService.getTodos() checks if initialized               │
│  → Not initialized: Fetch from API                          │
│  → Already initialized: Return from memory                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  HTTP Request to: jsonplaceholder.typicode.com/todos        │
│  Returns 200 todos (we take first 20)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Service stores todos in memory: this.todos = data          │
│  Service returns Observable<ITodo[]>                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Component subscribes and receives data                     │
│  Component updates: this.todos = data                       │
│  Template automatically re-renders with new data            │
└─────────────────────────────────────────────────────────────┘
```

### **User Action Flows**

#### **Flow 1: Adding a New Todo**

```
1. User clicks "Add New To-Do" button
2. Router navigates to '/add'
3. TodoFormComponent loads
4. isEditMode = false (no ID in URL)
5. User fills form and clicks submit
6. Form validation runs
7. If valid: addTodo() is called
8. TodoService.addTodo():
   - Generates new ID
   - Adds to beginning of todos array
   - Returns Observable
9. Component subscribes and navigates to '/'
10. TodoListComponent re-renders with new todo
```

#### **Flow 2: Editing a Todo**

```
1. User clicks "Edit" button on a todo
2. Router navigates to '/edit/5' (example ID)
3. TodoFormComponent loads
4. ngOnInit() detects ID in URL
5. isEditMode = true
6. loadTodo(5) is called
7. TodoService.getTodoById(5):
   - Finds todo in memory array
   - Returns Observable with todo
8. Component receives todo and populates form
9. User modifies and clicks Update
10. updateTodo() is called
11. TodoService.updateTodo():
    - Finds index in array
    - Replaces with updated todo
    - Returns Observable
12. Component navigates to '/'
13. TodoListComponent shows updated todo
```

#### **Flow 3: Deleting a Todo**

```
1. User clicks "Delete" button
2. Browser shows confirmation dialog
3. If confirmed:
   - deleteTodo(id, title) is called
   - TodoService.deleteTodo(id):
     - Filters out todo with matching ID
     - Returns Observable<boolean>
   - Component receives success
   - Updates local array: this.todos = this.todos.filter(...)
   - Template re-renders without deleted todo
```

---

*Last Updated: February 2026*
*Angular Version: 21*
*Author: Sherif Youssef*
