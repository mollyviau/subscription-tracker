import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import SubscriptionForm from "../components/SubscriptionForm";
import SubscriptionList from "../components/SubscriptionList";

function Dashboard({ session }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching subscriptions: ", error.message);
      return;
    }
    setSubscriptions(data);
  }

  function closeModal() {
    setShowForm(false);
    setEditingSub(null);
  }

  const modalOpen = showForm || editingSub !== null;

  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    const cost = parseFloat(sub.cost);
    return sum + (sub.billing_cycle === "yearly" ? cost / 12 : cost);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white px-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-1">
        Subscription Hub
      </p>
      <h1 className="text-3xl font-bold mb-6">Your subscriptions</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="col-span-3 md:col-span-1 bg-[#1a1030] rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold tracking-widest text-purple-300 uppercase mb-1">
            Monthly Spend
          </p>
          <p className="text-3xl font-bold">${monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="bg-[#111118] border border-cyan-900 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-1">
            Active
          </p>
          <p className="text-3xl font-bold">{subscriptions.length}</p>
        </div>
        <div className="bg-[#111118] border border-red-900 rounded-2xl px-4 py-3">
          <p className="text-xs font-semibold tracking-widest text-red-400 uppercase mb-1">
            Review
          </p>
          <p className="text-3xl font-bold">
            {
              subscriptions.filter((sub) => {
                const days = Math.ceil(
                  (new Date(sub.next_billing_date) - new Date()) /
                    (1000 * 60 * 60 * 24),
                );
                return days <= 7 && days >= 0;
              }).length
            }
          </p>
        </div>
      </div>

      {/* Add Button - full width on mobile, inline on desktop */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full md:hidden bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors rounded-2xl py-4 font-semibold text-lg mb-8"
      >
        + Add subscription
      </button>

      {/* All subscriptions header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-400">All subscriptions</p>
        <button
          onClick={() => setShowForm(true)}
          className="hidden md:flex items-center gap-1 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors rounded-full py-2 px-4 text-sm font-semibold"
        >
          + Add
        </button>
      </div>

      {/* List */}
      <SubscriptionList
        subscriptions={subscriptions}
        fetchSubscriptions={fetchSubscriptions}
        onEdit={(sub) => setEditingSub(sub)}
      />

      {/* Modal (add + edit) */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#13131f] rounded-2xl w-full max-w-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">
              {editingSub ? `Edit ${editingSub.name}` : "Add subscription"}
            </h2>
            <SubscriptionForm
              key={editingSub?.id ?? "new"}
              session={session}
              fetchSubscriptions={fetchSubscriptions}
              editingSub={editingSub}
              onDone={closeModal}
            />
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-600 mt-8">
        Value tag = utility score · yearly normalized to monthly
      </p>
    </div>
  );
}

export default Dashboard;