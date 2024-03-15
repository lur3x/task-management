import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { generateId } from 'src/app/utils/id-generator';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  tasks: Task[] = [];
  newUser: User = { id: 0, name: '' };
  selectedUser: User | null = null;
  isTaskSelectionModalOpen = false;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.users = this.userService.getAllUsers();
    this.tasks = this.taskService.getAllTasks();
  }

  createUser(): void {
    this.newUser.id = generateId(this.users);
    this.userService.addUser(this.newUser);
    this.users = this.userService.getAllUsers();
    this.newUser = { id: 0, name: '' };
    this.cd.detectChanges();
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId);
    this.users = this.userService.getAllUsers();
  }

  openTaskSelectionModal(user: User): void {
    this.selectedUser = user;
    this.isTaskSelectionModalOpen = true;
  }

  closeTaskSelectionModal(): void {
    this.selectedUser = null;
    this.isTaskSelectionModalOpen = false;
  }

  assignTaskToUser(taskId: number): void {
    if (this.selectedUser) {
      const task = this.tasks.find((task) => task.id === taskId);

      const userHasTaskInProgress = this.users.some(
        (user) =>
          user.taskIds &&
          user.taskIds.some((id) => {
            const assignedTask = this.tasks.find((task) => task.id === id);
            return assignedTask && assignedTask.state === 'in progress';
          }),
      );

      if (userHasTaskInProgress && task!.state === 'in progress') {
        alert('The user is already assigned to a task in progress.');
        return;
      }

      if (userHasTaskInProgress) {
        const taskInProgressId = this.users
          .flatMap((user) => user.taskIds)
          .find((id) => {
            const assignedTask = this.tasks.find((task) => task.id === id);
            return assignedTask && assignedTask.state === 'in progress';
          });
        const taskInProgress = this.tasks.find((task) => task.id === taskInProgressId);
        taskInProgress!.state = 'in queue';
        this.taskService.updateTask(taskInProgress!);
      }

      const previousAssignedUser = this.users.find(
        (user) => user.taskIds && user.taskIds.includes(taskId),
      );
      if (previousAssignedUser) {
        previousAssignedUser.taskIds = previousAssignedUser.taskIds!.filter((id) => id !== taskId);
        this.userService.updateUser(previousAssignedUser);
      }

      task!.userName = this.selectedUser.name;

      task!.state = 'in progress';

      this.taskService.updateTask(task!);

      if (!this.selectedUser.taskIds) {
        this.selectedUser.taskIds = [];
      }
      this.selectedUser.taskIds.push(taskId);
      this.userService.updateUser(this.selectedUser);

      this.closeTaskSelectionModal();
    }
  }

  getTaskName(taskId: number): string {
    const task = this.tasks.find((task) => task.id === taskId);
    return task ? task.name : '';
  }
}
