export interface Task {
  id: string;
  title: string;
  category?: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  category?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface UpdateTaskPayload {
  title?: string;
  category?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface TaskQueryParams {
  isCompleted?: boolean;
  category?: string;
}
