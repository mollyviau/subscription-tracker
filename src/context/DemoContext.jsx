import { createContext, useContext, useState } from "react";
import { buildDemoSubscriptions } from "../lib/demoData.js";

// Demo mode is stateless by construction: subscriptions live in React state
// only. Any change survives until the tab is refreshed or closed, then the
// seed data returns. There is nothing on the server to reset.

const DemoContext = createContext(null);

// Returns the demo API when inside <DemoProvider>, otherwise null.
// Components branch on this: `if (demo) { ...local } else { ...supabase }`
export function useDemo() {
  return useContext(DemoContext);
}

export function DemoProvider({ children }) {
  const [subscriptions, setOwnSubscriptions] = useState(buildDemoSubscriptions);

  const addSubscription = (payload) =>
    setOwnSubscriptions((prev) => [
      ...prev,
      { ...payload, id: `demo-${Date.now()}` },
    ]);

  const updateSubscription = (id, payload) =>
    setOwnSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, ...payload } : sub)),
    );

  const deleteSubscription = (id) =>
    setOwnSubscriptions((prev) => prev.filter((sub) => sub.id !== id));

  const reset = () => setOwnSubscriptions(buildDemoSubscriptions());

  return (
    <DemoContext.Provider
      value={{
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        reset,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
