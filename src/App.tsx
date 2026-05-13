import { useState, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import { FilterStatus, Priority } from './types/todo';
import TodoInput from './components/TodoInput';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [search, setSearch] = useState('');
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!todo.text.toLowerCase().includes(q) && !todo.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [todos, filter, priorityFilter, search]);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  }), [todos]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950 transition-colors duration-300">
        <div className="max-w-xl mx-auto px-4 py-8">

          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/50">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-none">할 일 목록</h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">오늘도 파이팅!</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-base hover:scale-105 active:scale-95 transition-transform"
              title={darkMode ? '라이트 모드' : '다크 모드'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </header>

          {/* Progress */}
          <TodoStats total={stats.total} completed={stats.completed} active={stats.active} />

          {/* Add Todo */}
          <div className="mb-3">
            <TodoInput onAdd={addTodo} />
          </div>

          {/* Filters */}
          <div className="mb-3">
            <TodoFilter
              filter={filter}
              onFilterChange={setFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              search={search}
              onSearchChange={setSearch}
            />
          </div>

          {/* List */}
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />

          {/* Footer */}
          {todos.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <span>{stats.active}개 남음</span>
              {stats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  완료된 항목 삭제
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
