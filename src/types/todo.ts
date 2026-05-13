export type Priority = 'high' | 'medium' | 'low';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate: string;
  createdAt: string;
}
