import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { Wallet } from "lucide-react";

function Navbar({ session }) {
  const [error, setError] = useState(null);

  async function logOut() {
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) setError(logoutError.message);
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#0a0a12] border-b border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-white">SubTrack</h1>
      </div>
      {session && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">
            {session?.user?.email}
          </span>
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {session?.user?.email?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logOut}
            className="text-sm text-gray-300 border border-white/20 hover:border-white/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </nav>
  );
}

export default Navbar;

