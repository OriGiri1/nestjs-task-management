import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar, StatusFilter } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { DeleteModal } from './components/DeleteModal';
import { Toast, ToastMessage } from './components/Toast';
import { taskApi } from './services/api';
import { CreateTaskPayload, Task, UpdateTaskPayload } from './types/task';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load tasks from NestJS API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to fetch tasks', err);
      setError(err.message || 'Không thể kết nối đến máy chủ API NestJS.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category && t.category.trim()) {
        set.add(t.category.trim());
      }
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Filter tasks locally (or can also use backend query params)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search title or description
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesDesc) return false;
      }

      // Status
      if (statusFilter === 'active' && task.isCompleted) return false;
      if (statusFilter === 'completed' && !task.isCompleted) return false;

      // Category
      if (selectedCategory && task.category !== selectedCategory) return false;

      return true;
    });
  }, [tasks, searchQuery, statusFilter, selectedCategory]);

  // Toggle completion
  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await taskApi.updateTask(task.id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      addToast(
        updated.isCompleted
          ? `Đã hoàn thành "${task.title}"`
          : `Đã chuyển "${task.title}" sang trạng thái đang làm`,
        'success',
      );
    } catch (err: any) {
      addToast(err.message || 'Không thể cập nhật trạng thái.', 'error');
    }
  };

  // Open edit modal
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle create or update submit
  const handleModalSubmit = async (payload: CreateTaskPayload | UpdateTaskPayload) => {
    if (editingTask) {
      const updated = await taskApi.updateTask(editingTask.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
      addToast(`Đã cập nhật công việc "${updated.title}"!`, 'success');
    } else {
      const created = await taskApi.createTask(payload as CreateTaskPayload);
      setTasks((prev) => [created, ...prev]);
      addToast(`Đã thêm công việc mới: "${created.title}"!`, 'success');
    }
  };

  // Delete handlers
  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      setDeleteLoading(true);
      await taskApi.deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      addToast(`Đã xóa công việc "${deletingTask.title}"!`, 'success');
      setDeletingTask(null);
    } catch (err: any) {
      addToast(err.message || 'Không thể xóa công việc.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <Navbar
        onNewTaskClick={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
      />

      <main className="container" style={{ paddingBottom: 60 }}>
        <StatsOverview tasks={tasks} />

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <strong>Lỗi tải dữ liệu:</strong> {error}
            </div>
            <button className="btn-secondary" onClick={fetchTasks} style={{ background: 'white' }}>
              Thử lại
            </button>
          </div>
        )}

        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onNewTaskClick={() => {
            setEditingTask(null);
            setIsTaskModalOpen(true);
          }}
        />
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        initialTask={editingTask}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
      />

      <DeleteModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
