import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.description.includes(search) || task.title.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((el) => el.id === id);
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid.v1(),
      status: TaskStatus.OPEN,
      title,
      description,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      throw new NotFoundException(`Task with uuid=${id} Does not exist`);
    }
    this.tasks.splice(index, 1);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
