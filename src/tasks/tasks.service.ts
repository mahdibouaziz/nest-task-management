import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.model';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    //extracting criteria variables
    const { search, status } = filterDto;

    //create a query builder for the entity Task <=> the table taskmanagement
    //the argument task is just an alias
    //this query gonna get all the table
    const query = this.taskRepository.createQueryBuilder('task');
    //console.log(query.getSql());

    //build the query
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search) ',
        { search: `%${search}%` },
      );
    }

    //execute the query
    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    //check if the id exists
    if (!task) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.taskRepository.create({ title, description, user });
    return await this.taskRepository.save(newTask);
  }

  async deleteTask(id: number): Promise<void> {
    //meth1 with remove
    /* const task = await this.getTaskById(id);
    await this.taskRepository.remove(task); */

    //meth2 with delete (better performance)
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<void> {
    const result = await this.taskRepository.update(id, { status });
    if (result.affected === 0) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }
  }
}
