import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { CATEGORIES } from "../lib/constants.js";
import { logEvent } from "../lib/analytics.js";   // ← add this

const inputClass =
  "w-full bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500 transition-colors";

function SubscriptionForm({ session, fetchSubscriptions, editingSub, onDone }) {
  const [formData, setFormData] = useState(
    editingSub
      ? {
          name: editingSub.name,
          cost: String(editingSub.cost), // input wants a string
          billing_cycle: editingSub.billing_cycle,
          category: editingSub.category,
          next_billing_date: editingSub.next_billing_date ?? "",
          usage: editingSub.usage,
        }
      : {
          name: "",
          cost: "",
          billing_cycle: "monthly",
          category: "",
          next_billing_date: "",
          usage: "monthly",
        },
  );
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: formData.name,
      cost: parseFloat(formData.cost),
      billing_cycle: formData.billing_cycle,
      category: formData.category,
      next_billing_date: formData.next_billing_date,
      usage: formData.usage,
    };

    const { error: submissionError } = editingSub
      ? await supabase
          .from("subscriptions")
          .update(payload)
          .eq("id", editingSub.id)
      : await supabase
          .from("subscriptions")
          .insert([{ ...payload, user_id: session.user.id }]);

    if (submissionError) {
      setError(submissionError.message);
    } else {
      if (editingSub) {
        logEvent("subscription_updated", {
          subscription_id: editingSub.id,
          usage_before: editingSub.usage,
          usage_after: formData.usage,
        });
      } else {
        logEvent("subscription_created", {
          category: formData.category,
          billing_cycle: formData.billing_cycle,
          usage: formData.usage,
        });
      }
      fetchSubscriptions();
      setFormData({
        name: "",
        cost: "",
        billing_cycle: "monthly",
        category: "",
        next_billing_date: "",
        usage: "monthly",
      });
      onDone?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Subscription name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={inputClass}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Cost"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
          className={inputClass}
          required
        />
        <select
          value={formData.billing_cycle}
          onChange={(e) =>
            setFormData({ ...formData, billing_cycle: e.target.value })
          }
          className={inputClass}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className={inputClass}
        required
      >
        <option value="" disabled>
          Select a category
        </option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">
          How often do you use it?
        </label>
        <select
          value={formData.usage}
          onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
          className={inputClass}
        >
          <option value="daily">Daily</option>
          <option value="weekly">A few times a week</option>
          <option value="monthly">A few times a month</option>
          <option value="rarely">Every few months</option>
          <option value="never">Rarely / forgot I had it</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-400 font-medium">
          Next Billing Date
        </label>
        <input
          type="date"
          value={formData.next_billing_date}
          onChange={(e) =>
            setFormData({ ...formData, next_billing_date: e.target.value })
          }
          className={inputClass}
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors rounded-xl py-2.5 font-semibold text-white mt-1"
      >
        {editingSub ? "Update subscription" : "Add subscription"}
      </button>
    </form>
  );
}

export default SubscriptionForm;

/* import { useState } from 'react';
import { supabase } from '../lib/supabase.js';


function SubscriptionForm({ session, fetchSubscriptions }) {
    const [formData, setFormData] = useState({
    name: '',
    cost: '',
    billing_cycle: 'monthly',
    category: '',
    next_billing_date: '',
    });

    const [error, setError] = useState(null);


    async function handleSubmit(e) {
        e.preventDefault();

    const { error: submissionError } = await supabase
        .from('subscriptions')
        .insert([{
            name: formData.name,
            cost: parseFloat(formData.cost),
            billing_cycle: formData.billing_cycle,
            category: formData.category,
            next_billing_date: formData.next_billing_date,
            user_id: session.user.id,
        }]);

        if (submissionError) {
            setError(submissionError.message);
        } else {
        fetchSubscriptions();
        // Reset Form
        setFormData({
            name: '',
            cost: '',
            billing_cycle: 'monthly',
            category: '',
            next_billing_date: '',
        });

        }

        
    }



  return (
  <div className="flex justify-center mt-6">
    <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
      <input type='text' onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} placeholder='Subscription Name' className="border border-gray-300 rounded-md px-3 py-2" />
      <input type='number' onChange={(e) => setFormData({ ...formData, cost: e.target.value })} value={formData.cost} placeholder='Subscription Cost' className="border border-gray-300 rounded-md px-3 py-2" />
      <select value={formData.billing_cycle} onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })} className="border border-gray-300 rounded-md px-3 py-2">
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
      <input type='text' onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category} placeholder='Subscription Category' className="border border-gray-300 rounded-md px-3 py-2" />
      <input type='date' onChange={(e) => setFormData({ ...formData, next_billing_date: e.target.value })} value={formData.next_billing_date} className="border border-gray-300 rounded-md px-3 py-2" />
      <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors" type="submit">Submit</button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div></form>
  </div>
);

}
export default SubscriptionForm; */
