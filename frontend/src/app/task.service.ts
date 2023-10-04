import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { List } from './models/list.model';
import { Task } from './models/task.model';
import { compileClassMetadata } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  getLists(): Observable<List[]> {
    return this.webReqService.get('lists') as Observable<List[]>;
  }

  createList(title: string): Observable<List> {
    return this.webReqService.post('lists', { title }) as Observable<List>;
  }

  getTasks(listId: string): Observable<Task[]> {
    return this.webReqService.get(`lists/${listId}/tasks`) as Observable<
      Task[]
    >;
  }

  createTask(title: string, listId: string): Observable<Task> {
    return this.webReqService.post(`lists/${listId}/tasks`, {
      title,
    }) as Observable<Task>;
  }
  updateList(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`lists/${id}`, { title });
  }

  updateTask(listId: string, taskId: string, title: string) {
    return this.webReqService.patch(`lists/${listId}/tasks/${taskId}`, {
      title,
    });
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.delete(`lists/${listId}/tasks/${taskId}`);
  }

  deleteList(id: string) {
    return this.webReqService.delete(`lists/${id}`);
  }
  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed,
    });
  }
}
