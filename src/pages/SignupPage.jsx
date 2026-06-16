import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
      e.preventDefault();
    
      
      const { data, error: signupError } = await supabase.auth.signUp({ email, password })
    
      if (signupError) {
          setError(signupError.message);
      }
    }


    return (
    <div className="flex items-center justify-center min-h-screen">
        <form className="flex flex-col gap-4 w-full max-w-sm p-8 bg-white rounded-lg shadow-md" onSubmit={handleSubmit} >
                <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4">Signup Page</h1>
                <input className="" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' />
                <input className="" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' />
                {error && <p>{error}</p>}
                <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors" type="submit">Signup</button>
                <Link to="/login"><br></br>Already have an account? Login</Link>

            </form>
    </div>
   
    );

}
 export default SignupPage;