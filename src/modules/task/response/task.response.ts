import { Task } from '@database/typeorm/entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskResponse {
  @ApiProperty({
    description: 'Task unique identifier (UUID)',
    example: 'a3b2c1d0-1234-4567-89ab-cdef01234567',
  })
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Học NestJS cơ bản',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Task category',
    example: 'Backend',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Tìm hiểu về DTO, Controller, Service và Module',
  })
  description?: string;

  @ApiProperty({
    description: 'Task completion status',
    example: false,
  })
  isCompleted: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2026-10-27T08:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-10-27T08:30:00.000Z',
  })
  updatedAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    if (task.category !== undefined && task.category !== null) {
      this.category = task.category;
    }
    if (task.description !== undefined && task.description !== null) {
      this.description = task.description;
    }
    this.isCompleted = task.isCompleted ?? false;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}
