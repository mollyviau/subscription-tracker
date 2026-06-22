import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

const inputClass = "w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]";

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const { error: signupError } = await supabase.auth.signUp({ email, password });
    if (signupError) setError(signupError.message);
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-57px)]">
      <div className="w-full max-w-sm px-4">
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-white">Create an account</h2>
            <p className="text-sm text-gray-400 mt-1">Start tracking your subscriptions</p>
          </div>
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors rounded-xl py-2.5 font-semibold text-white mt-1"
            type="submit"
            onClick={handleSubmit}
          >
            Sign up
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;