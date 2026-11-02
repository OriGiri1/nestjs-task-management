import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task (1 - 255 characters)',
    example: 'Học NestJS cơ bản',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({
    description: 'Category / topic of the task',
    example: 'Backend',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @ApiPropertyOptional({
    description: 'Optional detailed description of the task',
    example: 'Tìm hiểu về DTO, Controller, Service và Module',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Completion status of the task',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
