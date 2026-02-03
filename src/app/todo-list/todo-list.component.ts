import { Component, OnInit } from '@angular/core';
import { TodoService } from '../Services/todo.service';
import { ITodo } from '../Models/ITodo';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterPipe } from '../Pipes/filter.pipe';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, RouterLink, FilterPipe],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  todos: ITodo[] = [];
  loading = false;
  errorMessage = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.fetchTodos();
  }

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
        console.error('Error fetching todos:', err);
      },
    });
  }

  deleteTodo(id: number, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      this.errorMessage = '';

      this.todoService.deleteTodo(id).subscribe({
        next: (success) => {
          if (success) {
            // Remove from local array immediately
            this.todos = this.todos.filter((todo) => todo.id !== id);
          } else {
            this.errorMessage = 'Failed to delete todo. Todo not found.';
          }
        },
        error: (err) => {
          this.errorMessage = 'An error occurred while deleting the todo.';
          console.error('Error deleting todo:', err);
        },
      });
    }
  }
}
