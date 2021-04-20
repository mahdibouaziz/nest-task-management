import { IsIn, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.model';

const allowedStatus = [
  TaskStatus.DONE,
  TaskStatus.IN_PROGRESS,
  TaskStatus.OPEN,
];

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(allowedStatus)
  status: TaskStatus;

  @IsOptional()
  search: string;
}
