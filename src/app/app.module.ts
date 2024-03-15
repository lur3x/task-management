import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserListComponent } from './component/users-list/users-list.component';
import { AppRoutingModule } from './app-routing.module';
import { TaskListComponent } from './component/tasks-list/tasks-list.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule, UserListComponent, AppRoutingModule,TaskListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
