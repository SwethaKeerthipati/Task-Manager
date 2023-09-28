import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { List } from './models/list.model';
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  getLists() {
    return this.webReqService.get('lists');
  }

  createList(title: string): Observable<List> {
    return this.webReqService.post('lists', { title }) as Observable<List>;
  }

  getTasks(listId: string): Observable<Task> {
    return this.webReqService.get(`lists/${listId}/tasks`) as Observable<Task>;
  }

  createTask(title: string, listId: string) {
    return this.webReqService.post(`lists/${listId}/tasks`, { title });
  }
}