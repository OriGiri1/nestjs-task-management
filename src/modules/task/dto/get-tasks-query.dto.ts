import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetTasksQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by completion status (true/false)',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by category',
    example: 'Backend',
    type: String,
  })
  @IsOptional()
  @IsString()
  category?: string;
}
