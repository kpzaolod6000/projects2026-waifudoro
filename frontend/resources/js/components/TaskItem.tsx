import { Check, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  if (task.completed) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/10 flex items-center justify-between group opacity-60">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggle(task.id)}
            className="size-6 bg-green-500 text-white rounded flex items-center justify-center flex-shrink-0 hover:bg-green-600 transition-colors"
          >
            <Check size={16} strokeWidth={3} />
          </button>
          <p className="font-bold text-slate-500 line-through dark:text-slate-400">{task.title}</p>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/10 shadow-sm flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className="size-6 border-2 border-slate-300 dark:border-slate-600 rounded flex items-center justify-center flex-shrink-0 hover:border-primary hover:bg-primary/10 transition-colors"
        >
          <Check size={14} strokeWidth={3} className="text-primary opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{task.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {task.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded">
                {tag}
              </span>
            ))}
            <p className="text-xs text-slate-400 font-medium ml-2">{task.time}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
