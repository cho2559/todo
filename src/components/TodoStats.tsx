interface Props {
  total: number;
  completed: number;
  active: number;
}

export default function TodoStats({ total, completed, active }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{completed}</span>
          <span> / {total} 완료</span>
        </span>
        <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="text-center text-sm text-violet-600 dark:text-violet-400 mt-2 font-medium animate-fade-in">
          🎉 모든 할 일 완료! 수고하셨어요!
        </p>
      )}
      <div className="flex gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
        <span>전체 {total}</span>
        <span>진행중 {active}</span>
        <span>완료 {completed}</span>
      </div>
    </div>
  );
}
