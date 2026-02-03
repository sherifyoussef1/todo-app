## 📚 Study Guide

### **For Beginners - Step by Step Learning Path**

#### **Week 1: TypeScript Basics**

1. Learn TypeScript syntax
2. Understand interfaces and types
3. Practice with classes
4. Study the ITodo interface in this project

**Resources:**

- TypeScript Official Docs: <https://www.typescriptlang.org/docs/>
- Practice: Modify ITodo to add more fields

#### **Week 2: Angular Fundamentals**

1. Understand what a component is
2. Learn about decorators (@Component, @Injectable)
3. Study component lifecycle (ngOnInit)
4. Practice creating components

**Resources:**

- Angular Official Tutorial: <https://angular.dev/tutorials>
- Exercise: Create a simple counter component

#### **Week 3: Templates and Data Binding**

1. Learn template syntax
2. Understand interpolation {{ }}
3. Study property binding [property]
4. Practice event binding (event)
5. Master two-way binding [(ngModel)]

**Resources:**

- Study todo-list.component.html
- Study todo-form.component.html
- Exercise: Add new bindings to existing templates

#### **Week 4: Services and Dependency Injection**

1. Understand what services are
2. Learn @Injectable decorator
3. Study dependency injection
4. Practice creating services

**Resources:**

- Study todo.service.ts line by line
- Exercise: Add a logging service

#### **Week 5: RxJS and Observables**

1. Understand Observables
2. Learn subscribe() method
3. Study common operators (map, tap, of)
4. Practice async operations

**Resources:**

- RxJS Docs: <https://rxjs.dev/>
- Study all .subscribe() calls in the project
- Exercise: Add error retry logic

#### **Week 6: Routing**

1. Learn Angular Router basics
2. Understand route parameters
3. Study navigation
4. Practice programmatic routing

**Resources:**

- Study app.routes.ts
- Study how edit/:id works
- Exercise: Add a detail view route

---

### **Key Concepts to Master**

#### **1. Component Communication**

```
Parent Component
    ↓ (Input)
Child Component
    ↑ (Output)
Parent Component

Alternative: Through Service
Component A → Service ← Component B
```

In this project:

- Components communicate through the TodoService
- TodoService acts as a shared state manager

#### **2. Observable Pattern**

```
Service creates Observable
     ↓
Component subscribes
     ↓
Service emits data
     ↓
Component receives in next()
Component handles errors in error()
```

#### **3. Angular Change Detection**

Angular automatically detects changes and updates the view when:

- Component properties change
- Events occur (click, input, etc.)
- Async operations complete (HTTP, timers)

Example:

```typescript
this.todos = data;  // Angular detects this change
// Template automatically re-renders

```

## 📖 Advanced Topics to Explore

### **Once You Master the Basics**

1. **State Management**
   - NgRx (Redux for Angular)
   - Akita
   - NGXS

2. **Testing**
   - Unit tests with Jasmine/Karma
   - E2E tests with Cypress/Protractor

3. **Performance Optimization**
   - OnPush change detection
   - Lazy loading
   - TrackBy functions

4. **Real Backend Integration**
   - Replace in-memory storage with real API
   - Authentication/Authorization
   - WebSockets for real-time updates

5. **Advanced RxJS**
   - switchMap, mergeMap, concatMap
   - combineLatest, forkJoin
   - Subject, BehaviorSubject

6. **Forms**
   - Reactive Forms (FormGroup, FormControl)
   - Custom validators
   - Dynamic forms

---

## 📝 Exercises to Practice

### **Beginner Exercises**

1. **Add a priority field**
   - Add `priority: 'low' | 'medium' | 'high'` to ITodo
   - Add dropdown in form
   - Display priority in list with colors

2. **Add a search feature**
   - Add search input above list
   - Filter todos based on search term
   - Show "No results" when nothing matches

3. **Add sorting**
   - Add buttons to sort by: title, completion, date
   - Implement sorting logic
   - Remember sort preference

### **Intermediate Exercises**

1. **Add categories/tags**
   - Add `tags: string[]` to ITodo
   - Create multi-select in form
   - Filter by tag in list

2. **Add due dates**
   - Add `dueDate: Date` to ITodo
   - Use date input in form
   - Highlight overdue items
   - Sort by due date

3. **Add user authentication**
   - Create login/logout
   - Filter todos by user
   - Implement auth guard

### **Advanced Exercises**

1. **Implement drag-and-drop**
   - Reorder todos by dragging
   - Use Angular CDK
   - Save order

2. **Add real-time collaboration**
   - Use WebSockets
   - Show when others edit
   - Handle conflicts

3. **Progressive Web App (PWA)**
   - Add service worker
   - Enable offline mode
   - Add to home screen

---

## 🎓 Learning Resources

### **Official Documentation**

- Angular Docs: <https://angular.dev>
- TypeScript Docs: <https://www.typescriptlang.org>
- RxJS Docs: <https://rxjs.dev>

### **Video Tutorials**

- Angular University (YouTube)
- Academind (Udemy)
- Fireship (YouTube - quick concepts)

### **Books**

- "Angular Development with TypeScript" - Manning
- "ng-book: The Complete Guide to Angular" - Fullstack.io

### **Practice Platforms**

- StackBlitz - Online Angular IDE
- CodeSandbox - Online development
- Angular Playground - Component development

---
