// Seed data for /demo — client-side only, never written to Supabase.
// Dates are computed relative to today so "Renewing soon" and the
// 30-day upcoming list always have something to show.

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// Built fresh on each call so the seed array is never mutated by reference.
export function buildDemoSubscriptions() {
  return [
    {
      id: "demo-1",
      name: "Netflix",
      cost: 12.99,
      billing_cycle: "monthly",
      category: "Streaming & Entertainment",
      usage: "weekly",
      next_billing_date: daysFromNow(4),
    },
    {
      id: "demo-2",
      name: "Spotify",
      cost: 10.99,
      billing_cycle: "monthly",
      category: "Streaming & Entertainment",
      usage: "daily",
      next_billing_date: daysFromNow(19),
    },
    {
      id: "demo-3",
      name: "City Gym",
      cost: 45.0,
      billing_cycle: "monthly",
      category: "Fitness & Health",
      usage: "rarely",
      next_billing_date: daysFromNow(11),
    },
    {
      id: "demo-4",
      name: "Adobe Creative Cloud",
      cost: 719.88,
      billing_cycle: "yearly",
      category: "Software & Apps",
      usage: "monthly",
      next_billing_date: daysFromNow(63),
    },
    {
      id: "demo-5",
      name: "Meal Kit Box",
      cost: 89.99,
      billing_cycle: "monthly",
      category: "Food & Delivery",
      usage: "never",
      next_billing_date: daysFromNow(2),
    },
    {
      id: "demo-6",
      name: "News Digital",
      cost: 8.0,
      billing_cycle: "monthly",
      category: "News & Reading",
      usage: "weekly",
      next_billing_date: daysFromNow(26),
    },
  ];
}
