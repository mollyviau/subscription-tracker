import { supabase } from "../lib/supabase.js";
import { getUtilityScore, REVIEW_THRESHOLD } from "../lib/utilityScore.js";
import { logEvent } from "../lib/analytics.js";

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

function getAvatarColor(name) {
  const colors = [
    "bg-purple-700",
    "bg-cyan-700",
    "bg-indigo-700",
    "bg-pink-700",
    "bg-orange-700",
    "bg-teal-700",
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
}

function getRenewalDays(dateStr) {
  if (!dateStr) return null;
  const days = Math.ceil(
    (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24),
  );
  return days;
}

function SubscriptionList({ subscriptions, fetchSubscriptions, onEdit }) {
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}? This can't be undone.`)) return;

    // Capture details BEFORE deleting — unrecoverable afterward
    const sub = subscriptions.find((s) => s.id === id);
    const utility = sub ? getUtilityScore(sub) : null;
    const monthlyCost = sub
      ? sub.billing_cycle === "yearly"
        ? parseFloat(sub.cost) / 12
        : parseFloat(sub.cost)
      : null;

    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting subscription: ", error.message);
      return;
    }

    logEvent("subscription_deleted", {
      subscription_id: id,
      category: sub?.category ?? null,
      usage: sub?.usage ?? null,
      monthly_cost: monthlyCost,
      utility_score: utility?.score ?? null,
      utility_label: utility?.label ?? null,
      was_flagged: utility ? utility.score <= REVIEW_THRESHOLD : null,
    });

    fetchSubscriptions();
  };

  if (subscriptions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No subscriptions yet. Add one above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {subscriptions.map((sub) => {
        const days = getRenewalDays(sub.next_billing_date);
        const renewingSoon = days !== null && days <= 7 && days >= 0;
        const displayCost =
          sub.billing_cycle === "yearly"
            ? (parseFloat(sub.cost) / 12).toFixed(2)
            : parseFloat(sub.cost).toFixed(2);
        const utility = getUtilityScore(sub);
        return (
          <div
            key={sub.id}
            className="bg-[#111118] border border-white/5 rounded-2xl px-4 py-4 flex items-center gap-4"
          >
            {/* Avatar */}
            <div
              className={`${getAvatarColor(sub.name)} w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}
            >
              {getInitial(sub.name)}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{sub.name}</p>
              <p className="text-xs text-gray-400">
                {sub.category} ·{" "}
                {sub.billing_cycle.charAt(0).toUpperCase() +
                  sub.billing_cycle.slice(1)}
              </p>
              {renewingSoon && (
                <p className="text-xs text-yellow-400 mt-0.5">
                  🔔 Renews in {days} day{days !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {/* Utility score badge */}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${utility.color}`}
              title={`~$${utility.costPerUse.toFixed(2)} per use`}
            >
              {utility.label} · {utility.score}
            </span>
            {/* Cost */}
            <p className="text-white font-semibold w-16 text-right">
              ${displayCost}
            </p>
            {/* Edit */}
            <button
              onClick={() => onEdit(sub)}
              className="text-gray-600 hover:text-white transition-colors text-lg ml-1"
              title="Edit"
              aria-label={`Edit ${sub.name}`}
            >
              ✎
            </button>
            {/* Delete */}
            <button
              onClick={() => handleDelete(sub.id, sub.name)}
              className="text-gray-600 hover:text-red-400 transition-colors text-lg"
              title="Delete"
              aria-label={`Delete ${sub.name}`}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default SubscriptionList;