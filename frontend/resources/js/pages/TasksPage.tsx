import { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { DailySummaryCard } from '../components/DailySummaryCard';
import { Plus, Check, Trash2 } from 'lucide-react';
import { tasks as tasksApi, ApiTask } from '../lib/api';

export function TasksPage() {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    tasksApi.list().then(res => setTasks(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const task = await tasksApi.create(newTitle.trim()).catch(() => null);
    if (task) { setTasks(prev => [task, ...prev]); setNewTitle(''); setAdding(false); }
  };

  const toggleTask = async (id: string) => {
    const result = await tasksApi.toggle(id).catch(() => null);
    if (result) setTasks(prev => prev.map(t => t.id === id ? result.task : t));
  };

  const deleteTask = async (id: string) => {
    await tasksApi.delete(id).catch(() => {});
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const pending   = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <MainLayout headerTitle="Tasks">
      <div className="h-full overflow-y-auto">
        <div className="p-8 flex gap-8 max-w-[1200px] items-start">

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Pending Tasks</h3>
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>

            {adding && (
              <div className="flex gap-3">
                <input
                  autoFocus
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') { setAdding(false); setNewTitle(''); } }}
                  placeholder="Task name..."
                  className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-primary/20 text-sm outline-none focus:ring-2 focus:ring-primary/20 dark:text-slate-200"
                />
                <button onClick={addTask} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all">Add</button>
                <button onClick={() => { setAdding(false); setNewTitle(''); }} className="px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel</button>
              </div>
            )}

            {loading ? (
              <p className="text-slate-400 text-sm text-center py-8">Loading tasks...</p>
            ) : (
              <div className="flex flex-col gap-4">
                {pending.length === 0 && !adding && (
                  <p className="text-slate-400 text-sm font-medium py-4 text-center">All tasks done! Add a new one.</p>
                )}
                {pending.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
              </div>
            )}

            {completed.length > 0 && (
              <>
                <h3 className="text-xl font-bold mt-8 opacity-60">Completed</h3>
                <div className="flex flex-col gap-4">
                  {completed.map(task => <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />)}
                </div>
              </>
            )}
          </div>

          <div className="w-80 flex-none flex flex-col gap-4">
            <DailySummaryCard completed={completed.length} total={tasks.length} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: ApiTask; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const label = `${task.estimatedPomodoros} Pomodoro${task.estimatedPomodoros !== 1 ? 's' : ''}`;

  if (task.completed) {
    return (
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/10 flex items-center justify-between group opacity-60">
        <div className="flex items-center gap-4">
          <button onClick={() => onToggle(task.id)} className="size-6 bg-green-500 text-white rounded flex items-center justify-center flex-shrink-0 hover:bg-green-600 transition-colors">
            <Check size={16} strokeWidth={3} />
          </button>
          <p className="font-bold text-slate-500 line-through dark:text-slate-400">{task.title}</p>
        </div>
        <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
          <Trash2 size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-primary/10 shadow-sm flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <button onClick={() => onToggle(task.id)} className="size-6 border-2 border-slate-300 dark:border-slate-600 rounded flex items-center justify-center flex-shrink-0 hover:border-primary hover:bg-primary/10 transition-colors">
          <Check size={14} strokeWidth={3} className="text-primary opacity-0 group-hover:opacity-40 transition-opacity" />
        </button>
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-100">{task.title}</p>
          <div className="flex items-center gap-2 mt-1">
            {task.tags.map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded">{tag}</span>
            ))}
            <p className="text-xs text-slate-400 font-medium ml-2">{label}</p>
          </div>
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
        <Trash2 size={20} />
      </button>
    </div>
  );
}
