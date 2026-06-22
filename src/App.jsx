import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

// Root Component, handles auth-gated routing
function App() {
  // session holds the current Supabase auth session (or null)
  // loading tracks whether the initial auth check has finished
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // runs once on mount
  // checks if a session already exists, sets session and flips loading to false
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    // subscribes to future auth events (login, logout, token refresh) and updates session when they fire
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session),
    );
    // unsubscribes listener when the componenent unmounts, preventing memory leaks
    return () => subscription.unsubscribe();
  }, []);

  // blocks rendering until the initial getSession() check resolves
  if (loading) return <div>Loading...</div>;

  // wraps everything in BrowserRouter, and defines 3 routes
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a12]">
        <Navbar session={session} />
        <Routes>
          <Route
            path="/login"
            element={!session ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!session ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              session ? (
                <Dashboard session={session} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
