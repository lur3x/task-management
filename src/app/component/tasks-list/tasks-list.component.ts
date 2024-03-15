import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { generateId } from 'src/app/utils/id-generator';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {
    id: 0,
    name: '',
    description: '',
    creationDate: new Date(),
    modificationDate: new Date(),
    state: 'in queue',
    userName: null,
  };
  users: User[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getAllTasks();
    this.users = this.userService.getAllUsers();
  }

  unassignTask(taskId: number): void {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      const user = this.users.find((user) => user.taskIds && user.taskIds.includes(taskId));
      if (user) {
        user.taskIds = user.taskIds!.filter((id) => id !== taskId);
        this.userService.updateUser(user);
      }
      task.userName = null;
      task.state = 'in queue';
      this.taskService.updateTask(task);
    }
  }

  changeTaskState(taskId: number, newState: string): void {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.state = newState;
      this.taskService.updateTask(task);
    }
  }

  isUserAssignedToTaskInProgress(task: Task): boolean {
    return this.users.some(
      (user) =>
        user.taskIds &&
        user.taskIds.includes(task.id) &&
        this.tasks.some((t) => t.id === task.id && t.state === 'in progress'),
    );
  }

  createTask(): void {
    this.newTask.id = generateId(this.tasks);
    this.taskService.addTask(this.newTask);
    this.tasks = this.taskService.getAllTasks();
    this.newTask = {
      id: 0,
      name: '',
      description: '',
      creationDate: new Date(),
      modificationDate: new Date(),
      state: 'in queue',
      userName: null,
    };

    this.cd.detectChanges();
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId);
    this.tasks = this.taskService.getAllTasks();
  }
}
