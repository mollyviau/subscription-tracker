import { useState } from 'react';
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
export default SubscriptionForm;