import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksQueryDto } from './dto/get-tasks-query.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const sampleUuid = 'a3b2c1d0-1234-4567-89ab-cdef01234567';
  const sampleTaskResponse = {
    id: sampleUuid,
    title: 'Học NestJS cơ bản',
    category: 'Backend',
    description: 'Tìm hiểu về DTO, Controller, Service và Module',
    isCompleted: false,
    createdAt: new Date('2026-10-27T08:30:00.000Z'),
    updatedAt: new Date('2026-10-27T08:30:00.000Z'),
  };

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call taskService.create and return task response', async () => {
      const dto: CreateTaskDto = {
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
      };
      mockTaskService.create.mockResolvedValue(sampleTaskResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(sampleTaskResponse);
    });
  });

  describe('findAll', () => {
    it('should call taskService.findAll and return tasks', async () => {
      const query: GetTasksQueryDto = {
        isCompleted: false,
        category: 'Backend',
      };
      mockTaskService.findAll.mockResolvedValue([sampleTaskResponse]);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([sampleTaskResponse]);
    });
  });

  describe('findOne', () => {
    it('should call taskService.getById and return task', async () => {
      mockTaskService.getById.mockResolvedValue(sampleTaskResponse);

      const result = await controller.findOne(sampleUuid);

      expect(service.getById).toHaveBeenCalledWith(sampleUuid);
      expect(result).toEqual(sampleTaskResponse);
    });
  });

  describe('update', () => {
    it('should call taskService.update and return updated task', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Học NestJS nâng cao',
        isCompleted: true,
      };
      const updatedResponse = {
        ...sampleTaskResponse,
        ...updateDto,
      };
      mockTaskService.update.mockResolvedValue(updatedResponse);

      const result = await controller.update(sampleUuid, updateDto);

      expect(service.update).toHaveBeenCalledWith(sampleUuid, updateDto);
      expect(result).toEqual(updatedResponse);
    });
  });

  describe('remove', () => {
    it('should call taskService.remove', async () => {
      mockTaskService.remove.mockResolvedValue(undefined);

      await controller.remove(sampleUuid);

      expect(service.remove).toHaveBeenCalledWith(sampleUuid);
    });
  });
});
