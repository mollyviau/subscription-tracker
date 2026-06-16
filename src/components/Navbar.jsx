import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
  


function Navbar({ session }) {

const [error, setError] = useState(null);

async function logOut() {

    const { data, error: logoutError } = await supabase.auth.signOut();

       if (logoutError) {
        setError(logoutError.message);
      }

}
  
  
  
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Subscription Fatigue Tracker</h1>

        {session && (
            <div className="flex items-center gap-4">
            <div> { session?.user?.email } </div>
            <button className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors" onClick={() => logOut()}> Logout</button>
            </div>


        )}
        {error && <p>{error}</p>}

    </nav>
    
    );

}

export default Navbar;
