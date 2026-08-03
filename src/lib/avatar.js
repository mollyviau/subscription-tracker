// Shared avatar helpers.
// Used by both SubscriptionList (service tiles) and Navbar (account circle)
// so a given string always produces the same initial and colour.

export function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : "?";
}

export function getAvatarColor(name) {
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

// Resolve a human-readable name for the signed-in user.
// full_name is captured at signup into auth.users.raw_user_meta_data.
// Accounts created before that field existed fall back to the email local-part.
export function getDisplayName(session) {
  if (!session?.user) return "";
  return (
    session.user.user_metadata?.full_name?.trim() ||
    session.user.email?.split("@")[0] ||
    "Account"
  );
}
