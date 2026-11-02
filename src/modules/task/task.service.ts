import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Task } from '@database/typeorm/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';
import { TaskResponse } from './response/task.response';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      isCompleted: createTaskDto.isCompleted ?? false,
    });
    const saved = await this.taskRepository.save(task);
    return new TaskResponse(saved);
  }

  async findAll(query: GetTasksQueryDto): Promise<TaskResponse[]> {
    const where: FindOptionsWhere<Task> = {};

    if (query.isCompleted !== undefined) {
      where.isCompleted = query.isCompleted;
    }

    if (query.category !== undefined && query.category.trim() !== '') {
      where.category = query.category.trim();
    }

    const tasks = await this.taskRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return tasks.map((task) => new TaskResponse(task));
  }

  async getById(id: string): Promise<TaskResponse> {
    const task = await this.findEntityById(id);
    return new TaskResponse(task);
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.findEntityById(id);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.category !== undefined) {
      task.category = updateTaskDto.category;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }

    const updated = await this.taskRepository.save(task);
    return new TaskResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findEntityById(id);
    await this.taskRepository.remove(task);
  }

  private async findEntityById(id: string): Promise<Task> {
    if (!id || typeof id !== 'string' || !isUUID(id)) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Tasks with ID ${id} not found`);
    }

    return task;
  }
}
