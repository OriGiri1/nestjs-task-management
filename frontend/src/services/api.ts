import { CreateTaskPayload, Task, TaskQueryParams, UpdateTaskPayload } from '../types/task';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const taskApi = {
  getTasks: async (params?: TaskQueryParams): Promise<Task[]> => {
    const query = new URLSearchParams();
    if (params?.isCompleted !== undefined) {
      query.set('isCompleted', String(params.isCompleted));
    }
    if (params?.category && params.category.trim() !== '') {
      query.set('category', params.category.trim());
    }

    const queryString = query.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return request<Task[]>(endpoint, { method: 'GET' });
  },

  getTaskById: async (id: string): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, { method: 'GET' });
  },

  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateTask: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  deleteTask: async (id: string): Promise<void> => {
    await request<void>(`/tasks/${id}`, { method: 'DELETE' });
  },
};
