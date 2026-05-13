import { FilterStatus, Priority } from '../types/todo';

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'completed', label: '완료' },
];

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: '모든 우선순위' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' },
];

interface Props {
  filter: FilterStatus;
  onFilterChange: (f: FilterStatus) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (p: Priority | 'all') => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export default function TodoFilter({
  filter, onFilterChange,
  priorityFilter, onPriorityFilterChange,
  search, onSearchChange,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-100 dark:border-slate-700">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filter === tab.value
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="검색..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors"
          />
        </div>
        <select
          value={priorityFilter}
          onChange={e => onPriorityFilterChange(e.target.value as Priority | 'all')}
          className="text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm px-3 py-2 outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors cursor-pointer"
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
