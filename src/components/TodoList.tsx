import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-5xl mb-3">📋</div>
        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">할 일이 없어요</p>
        <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">새로운 할 일을 추가해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
