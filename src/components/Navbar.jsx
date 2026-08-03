import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { Wallet } from "lucide-react";
import { getInitial, getAvatarColor, getDisplayName } from "../lib/avatar.js";

function Navbar({ session }) {
  const [error, setError] = useState(null);
  const location = useLocation();
  const inDemo = location.pathname.startsWith("/demo");

  async function logOut() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError(logoutError.message);
  }

  const displayName = getDisplayName(session);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#0a0a12] border-b border-white/5">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-white">SubTrack</h1>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          to="/about"
          className="text-sm text-gray-400 hover:text-white transition-colors px-2 py-1.5"
        >
          About
        </Link>

        {/* Demo entry point — only for visitors who aren't signed in */}
        {!session && !inDemo && (
          <Link
            to="/demo"
            className="text-sm font-semibold text-purple-300 hover:text-purple-200 border border-purple-500/40 hover:border-purple-500/70 transition-colors px-3 py-1.5 rounded-lg whitespace-nowrap"
          >
            Try the demo
          </Link>
        )}

        {/* Demo mode indicator + exit */}
        {inDemo && (
          <>
            <span className="text-xs font-semibold text-yellow-400 border border-yellow-500/40 rounded-full px-2.5 py-1 whitespace-nowrap">
              Demo
            </span>
            <Link
              to="/login"
              className="text-sm text-gray-300 border border-white/20 hover:border-white/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Sign in
            </Link>
          </>
        )}

        {/* Signed-in account area */}
        {session && (
          <>
            {/* Name on wide screens */}
            <span className="hidden sm:block text-sm text-gray-300 max-w-[12rem] truncate">
              {displayName}
            </span>

            {/* Avatar circle — always visible, carries the identity on mobile */}
            <div
              className={`${getAvatarColor(displayName)} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
              title={session.user.email}
            >
              {getInitial(displayName)}
            </div>

            <button
              onClick={logOut}
              className="text-sm text-gray-300 border border-white/20 hover:border-white/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </nav>
  );
}

export default Navbar;
