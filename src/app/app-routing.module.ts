import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './component/tasks-list/tasks-list.component';
import { UserListComponent } from './component/users-list/users-list.component';

const routes: Routes = [
  { path: 'tasks', component: TaskListComponent },
  { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }