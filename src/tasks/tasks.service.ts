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

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    //extracting criteria variables
    const { search, status } = filterDto;

    //create a query builder for the entity Task <=> the table taskmanagement
    //the argument task is just an alias
    //this query gonna get all the table
    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.user = :userId', { userId: user.id }); //get tasks for only the owned user who's sending the request
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

  async getTaskById(id: number, user: User): Promise<Task> {
    //const task = await this.taskRepository.findOne(id);

    const task = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.id = :id', { id })
      .andWhere('task.user = :userId', { userId: user.id })
      .getOne();

    //check if the id of the task exists
    if (!task) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.taskRepository.create({ title, description, user });
    const task = await this.taskRepository.save(newTask);
    delete task.user;
    return task;
  }

  async deleteTask(id: number, user: User): Promise<any> {
    //meth1 with remove
    /* const task = await this.getTaskById(id);
    await this.taskRepository.remove(task); */

    //meth2 with delete (better performance)
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }
    return { message: 'Task Deleted' };
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<any> {
    const result = await this.taskRepository.update(
      { id, userId: user.id },
      { status },
    );
    if (result.affected === 0) {
      throw new NotFoundException(`task with id=${id} Does not exists`);
    }
    return { message: 'Task updated' };
  }
}
