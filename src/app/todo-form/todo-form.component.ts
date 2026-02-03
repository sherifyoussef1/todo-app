import { Component, OnInit } from '@angular/core';
import { TodoService } from '../Services/todo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ITodo } from '../Models/ITodo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent implements OnInit {
  todo: ITodo = { title: '', completed: false };
  isEditMode = false;
  errorMessage = '';
  loading = false;
  todoId: number | null = null;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Check if there is an ID in the URL for editing
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.todoId = +id;
      this.loadTodo(this.todoId);
    }
  }

  loadTodo(id: number) {
    this.loading = true;
    this.errorMessage = '';

    this.todoService.getTodoById(id).subscribe({
      next: (todo) => {
        if (todo) {
          this.todo = { ...todo };
          this.loading = false;
        } else {
          this.errorMessage = `Todo with ID ${id} not found.`;
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load todo. Please try again.';
        this.loading = false;
        console.error('Error loading todo:', err);
      },
    });
  }

  submit() {
    this.errorMessage = '';

    // Validate title
    if (!this.todo.title || !this.todo.title.trim()) {
      this.errorMessage = 'Title is required and cannot be empty.';
      return;
    }

    if (this.todo.title.trim().length < 3) {
      this.errorMessage = 'Title must be at least 3 characters long.';
      return;
    }

    if (this.isEditMode) {
      this.updateTodo();
    } else {
      this.addTodo();
    }
  }

  addTodo() {
    this.todoService.addTodo(this.todo).subscribe({
      next: (newTodo) => {
        console.log('Todo added successfully:', newTodo);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to add todo. Please try again.';
        console.error('Error adding todo:', err);
      },
    });
  }

  updateTodo() {
    this.todoService.updateTodo(this.todo).subscribe({
      next: (updatedTodo) => {
        console.log('Todo updated successfully:', updatedTodo);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update todo. Please try again.';
        console.error('Error updating todo:', err);
      },
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
