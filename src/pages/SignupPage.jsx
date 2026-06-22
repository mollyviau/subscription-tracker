import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

const inputClass =
  "w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signupError) setError(signupError.message);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] px-4 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.15; }
          50% { transform: translate(-50%, -70%) scale(1.2); opacity: 0.35; }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.18 }
          50% { transform: translate(-40px, -40px) scale(1.2; opacity: 0.35); }
        }
      `}</style>
      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-purple-700 rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          transform: "translate(-50%, -50%)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-400 rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ animation: "float2 8s ease-in-out infinite" }}
      />

      {/* Tagline */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Know what you're paying for.
        </h1>
        <p className="text-gray-400 text-lg">
          Track, review, and cut the subscriptions you don't need.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#13131f] border border-white/5 rounded-2xl p-8 flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-white">Create an account</h2>
            <p className="text-sm text-gray-400 mt-1">
              Start tracking your subscriptions
            </p>
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
