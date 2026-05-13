import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Todo, Priority } from '../types/todo';

const PRIORITY_CONFIG = {
  high: { label: '높음', dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
  medium: { label: '보통', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
  low: { label: '낮음', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
};

function formatDueDate(dateStr: string): { label: string; overdue: boolean } {
  if (!dateStr) return { label: '', overdue: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { label: '오늘까지', overdue: false };
  if (diff === 1) return { label: '내일까지', overdue: false };
  if (diff === -1) return { label: '어제 (지남)', overdue: true };
  if (diff < 0) return { label: `${Math.abs(diff)}일 지남`, overdue: true };
  if (diff <= 7) return { label: `${diff}일 후`, overdue: false };
  return {
    label: due.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    overdue: false,
  };
}

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  function startEdit() {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate);
    setEditing(true);
  }

  function confirmEdit() {
    if (!editText.trim()) return;
    onEdit(todo.id, {
      text: editText.trim(),
      priority: editPriority,
      category: editCategory.trim(),
      dueDate: editDueDate,
    });
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  const pCfg = PRIORITY_CONFIG[todo.priority];
  const due = formatDueDate(todo.dueDate);

  if (editing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-violet-400 dark:border-violet-500 p-3 shadow-md animate-fade-in">
        <input
          ref={editRef}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none mb-2 font-medium"
        />
        <div className="flex gap-2 items-center">
          <select
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as Priority)}
            className="text-xs bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-600 outline-none"
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
          <input
            type="text"
            value={editCategory}
            onChange={e => setEditCategory(e.target.value)}
            placeholder="카테고리"
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 placeholder-slate-400 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-600 outline-none"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={e => setEditDueDate(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-2 py-1.5 border border-slate-200 dark:border-slate-600 outline-none"
          />
          <button
            onClick={confirmEdit}
            className="w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={cancelEdit}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white dark:bg-slate-800 rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md animate-fade-in ${
      todo.completed
        ? 'border-slate-100 dark:border-slate-700 opacity-60'
        : 'border-slate-100 dark:border-slate-700'
    }`}>
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-violet-600 border-violet-600'
              : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug break-words ${
            todo.completed
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-700 dark:text-slate-200'
          }`}>
            {todo.text}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${pCfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
              {pCfg.label}
            </span>
            {todo.category && (
              <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                {todo.category}
              </span>
            )}
            {due.label && (
              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border ${
                due.overdue && !todo.completed
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'
                  : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600'
              }`}>
                {due.overdue && !todo.completed && '⚠ '}
                {due.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={startEdit}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="수정"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="w-7 h-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center justify-center text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            title="삭제"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
