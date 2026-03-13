import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/timer', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950 font-display">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-primary/10 shadow-sm flex flex-col items-center w-full max-w-md relative overflow-hidden">

        <div className="size-16 bg-primary rounded-xl flex items-center justify-center text-white mb-6">
          <Rocket size={36} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Create Account</h1>
        <p className="text-sm text-slate-500 mb-8 font-medium text-center">Join WaifuDoro and boost your productivity</p>

        {error && (
          <div className="w-full mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ex: Alex_Kun"
              required
              className="w-full px-4 py-3 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all dark:text-slate-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@example.com"
              required
              className="w-full px-4 py-3 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all dark:text-slate-200"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
              className="w-full px-4 py-3 bg-primary/5 dark:bg-slate-800/50 outline-none border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'SIGN UP'}
          </button>
        </form>

        <p className="text-sm text-slate-500 font-medium mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
