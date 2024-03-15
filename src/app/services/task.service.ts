import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksKey = 'tasks';
  
  constructor() { }

  getAllTasks(): Task[] {
    const tasksJson = localStorage.getItem(this.tasksKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  addTask(task: Task): void {
    const tasks = this.getAllTasks();
    tasks.push(task);
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  updateTask(task: Task): void {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      tasks[index] = task;
      localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    }
  }

  deleteTask(taskId: number): void {
    const tasks = this.getAllTasks().filter(t => t.id !== taskId);
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }
}