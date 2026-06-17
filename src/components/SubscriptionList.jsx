import { supabase } from '../lib/supabase.js';

function SubscriptionList({ subscriptions, fetchSubscriptions}) {
const handleDelete = async (id) => {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id);
  if (!error) fetchSubscriptions();
};

  return (
  <div className="flex justify-center mt-6">
  <table className="w-full max-w-3xl border-collapse bg-white rounded-lg shadow-md">
    <thead>
      <tr className="border-b border-gray-300 text-left text-sm font-semibold text-gray-700">
        <th className="py-2 px-4">Subscription Name</th>
        <th className="py-2 px-4">Cost</th>
        <th className="py-2 px-4">Billing Cycle</th>
        <th className="py-2 px-4">Category</th>
        <th className="py-2 px-4">Date</th>
        <th className="py-2 px-4"></th>
      </tr>
    </thead>
    <tbody>
      {subscriptions.map((sub) => (
        <tr key={sub.id} className="border-b border-gray-200 text-sm text-gray-800">
          <td className="py-2 px-4">{sub.name}</td>
          <td className="py-2 px-4">${sub.cost}</td>
          <td className="py-2 px-4">{sub.billing_cycle}</td>
          <td className="py-2 px-4">{sub.category}</td>
          <td className="py-2 px-4">{sub.next_billing_date}</td>
          <td className="py-2 px-4">
            <button
              className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors text-xs"
              onClick={() => handleDelete(sub.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  
);
}

export default SubscriptionList;


 