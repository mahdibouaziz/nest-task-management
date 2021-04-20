import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.status.model';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(value: string) {
    value = value.toUpperCase();

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(
        `status value must be in [${this.allowedStatus}]`,
      );
    }

    return value;
  }

  private isValidStatus(status: string): boolean {
    const index = this.allowedStatus.findIndex((el) => el === status);
    return index !== -1;
  }
}
