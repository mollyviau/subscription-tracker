import { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import SubscriptionForm from '../components/SubscriptionForm';
import SubscriptionList from '../components/SubscriptionList';




function Dashboard({ session }) {
    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const [subscriptions, setSubscriptions] = useState([]);
    async function fetchSubscriptions() {
     const { data, error } = await supabase
       .from('subscriptions')
       .select('*')
       .eq('user_id', session.user.id);
 
     if (error) {
       console.error('Error fetching subscriptions: ', error.message);
       throw error;
     }
 
     setSubscriptions(data);
 
    
   }



 return(
    <div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mt-6 mb-4">Dashboard</h1>
        <SubscriptionForm session={session} fetchSubscriptions={fetchSubscriptions} />
        <SubscriptionList subscriptions={subscriptions} fetchSubscriptions={fetchSubscriptions} />   
    </div>
    )
}
 export default Dashboard;

 
