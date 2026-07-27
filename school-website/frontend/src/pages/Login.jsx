import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Crest } from '../components/Layout';
import { ErrorBox } from '../components/UI';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const field = 'w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20';

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <Crest className="h-14 w-14" />
            <span className="font-display text-xl font-bold text-white">Staff Portal</span>
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-8 shadow-2xl">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-800">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">Administrators and staff only.</p>
          </div>

          {error && <ErrorBox message={error} />}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
            <input required type="email" className={field} value={email}
                   onChange={(e) => setEmail(e.target.value)} placeholder="admin@brightfuture.edu.ng" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
            <input required type="password" className={field} value={password}
                   onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={busy}
                  className="w-full rounded-md bg-navy-700 py-3 font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign In'}
          </button>

          <div className="rounded-md bg-amber-50 p-3 text-center text-xs text-amber-800">
            <strong>Demo login</strong><br />
            admin@brightfuture.edu.ng &nbsp;/&nbsp; admin123
          </div>

          <Link to="/" className="block text-center text-sm text-navy-600 hover:underline">
            ← Back to the website
          </Link>
        </form>
      </div>
    </div>
  );
}
