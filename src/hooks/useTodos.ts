import { useState, useEffect } from 'react';
import { Todo, Priority } from '../types/todo';

const STORAGE_KEY = 'todo-app-v1';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(text: string, priority: Priority, category: string, dueDate: string) {
    if (!text.trim()) return;
    setTodos(prev => [
      {
        id: generateId(),
        text: text.trim(),
        completed: false,
        priority,
        category: category.trim(),
        dueDate,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }

  function toggleTodo(id: string) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function editTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed));
  }

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
}
