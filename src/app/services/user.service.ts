import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersKey = 'users';
  
  constructor() { }

  getAllUsers(): User[] {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  addUser(user: User): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  updateUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  deleteUser(userId: number): void {
    const users = this.getAllUsers().filter(u => u.id !== userId);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  assignTaskToUser(userId: number, taskId: number): void {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      if (!user.taskIds) {
        user.taskIds = [];
      }
      user.taskIds.push(taskId);
      this.updateUser(user);
    }
  }
}
