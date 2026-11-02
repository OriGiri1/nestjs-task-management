import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '@database/typeorm/entities/task.entity';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  const mockRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const sampleUuid = 'a3b2c1d0-1234-4567-89ab-cdef01234567';

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const dto = {
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
      };

      const createdEntity = {
        id: sampleUuid,
        ...dto,
        isCompleted: false,
        createdAt: new Date('2026-10-27T08:30:00.000Z'),
        updatedAt: new Date('2026-10-27T08:30:00.000Z'),
      };

      mockRepository.create.mockReturnValue(createdEntity);
      mockRepository.save.mockResolvedValue(createdEntity);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...dto,
        isCompleted: false,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual({
        id: sampleUuid,
        title: dto.title,
        category: dto.category,
        description: dto.description,
        isCompleted: false,
        createdAt: createdEntity.createdAt,
        updatedAt: createdEntity.updatedAt,
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks when no filter is provided', async () => {
      const tasks = [
        {
          id: sampleUuid,
          title: 'Học NestJS cơ bản',
          category: 'Backend',
          description: 'Tìm hiểu về DTO, Controller, Service và Module',
          isCompleted: false,
          createdAt: new Date('2026-10-27T08:30:00.000Z'),
          updatedAt: new Date('2026-10-27T08:30:00.000Z'),
        },
      ];

      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll({});

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(sampleUuid);
    });

    it('should apply filters for isCompleted and category', async () => {
      mockRepository.find.mockResolvedValue([]);

      await service.findAll({ isCompleted: true, category: 'Backend' });

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          isCompleted: true,
          category: 'Backend',
        },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getById', () => {
    it('should return task when found', async () => {
      const task = {
        id: sampleUuid,
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOneBy.mockResolvedValue(task);

      const result = await service.getById(sampleUuid);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: sampleUuid });
      expect(result.id).toBe(sampleUuid);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(sampleUuid)).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${sampleUuid} not found`),
      );
    });

    it('should throw NotFoundException when ID is invalid format', async () => {
      await expect(service.getById('invalid-id')).rejects.toThrow(
        new NotFoundException('Tasks with ID invalid-id not found'),
      );
    });
  });

  describe('update', () => {
    it('should update and return task', async () => {
      const existingTask = {
        id: sampleUuid,
        title: 'Học NestJS cơ bản',
        category: 'Backend',
        description: 'Tìm hiểu về DTO, Controller, Service và Module',
        isCompleted: false,
        createdAt: new Date('2026-10-27T08:30:00.000Z'),
        updatedAt: new Date('2026-10-27T08:30:00.000Z'),
      };

      mockRepository.findOneBy.mockResolvedValue({ ...existingTask });
      mockRepository.save.mockImplementation((t) => Promise.resolve(t));

      const updateDto = {
        title: 'Học NestJS nâng cao',
        isCompleted: true,
      };

      const result = await service.update(sampleUuid, updateDto);

      expect(result.title).toBe('Học NestJS nâng cao');
      expect(result.isCompleted).toBe(true);
      expect(result.category).toBe('Backend');
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(sampleUuid, { title: 'Updated' }),
      ).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${sampleUuid} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove task when found', async () => {
      const task = {
        id: sampleUuid,
        title: 'Task',
      };
      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.remove.mockResolvedValue(task);

      await service.remove(sampleUuid);

      expect(mockRepository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException when task to remove does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(sampleUuid)).rejects.toThrow(
        new NotFoundException(`Tasks with ID ${sampleUuid} not found`),
      );
    });
  });
});
