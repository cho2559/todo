import { useState, useRef, KeyboardEvent } from 'react';
import { Priority } from '../types/todo';

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: '높음', color: 'text-rose-500' },
  { value: 'medium', label: '보통', color: 'text-amber-500' },
  { value: 'low', label: '낮음', color: 'text-emerald-500' },
];

interface Props {
  onAdd: (text: string, priority: Priority, category: string, dueDate: string) => void;
}

export default function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd() {
    if (!text.trim()) {
      inputRef.current?.focus();
      return;
    }
    onAdd(text, priority, category, dueDate);
    setText('');
    setCategory('');
    setDueDate('');
    setPriority('medium');
    inputRef.current?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  const priorityInfo = PRIORITIES.find(p => p.value === priority)!;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={handleAdd}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-800/60 transition-colors"
          title="추가"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setExpanded(true)}
          placeholder="새로운 할 일을 입력하세요..."
          className="flex-1 bg-transparent text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none"
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value as Priority)}
          className={`flex-shrink-0 text-xs font-medium bg-transparent border-none outline-none cursor-pointer ${priorityInfo.color}`}
        >
          {PRIORITIES.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          className="flex-shrink-0 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          추가
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 flex gap-2 animate-slide-down border-t border-slate-100 dark:border-slate-700 pt-3">
          <input
            type="text"
            value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="카테고리 (예: 업무, 개인)"
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg px-3 py-2 outline-none border border-slate-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-2 outline-none border border-slate-200 dark:border-slate-600 focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
          />
          <button
            onClick={() => setExpanded(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors px-1"
          >
            접기
          </button>
        </div>
      )}
    </div>
  );
}
