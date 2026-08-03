// logging helper
// src/lib/analytics.js
import { supabase } from "./supabase.js";

export function logEvent(eventType, metadata = {}) {
  if (window.location.pathname.startsWith("/demo")) return;
  supabase
    .from("events")
    .insert([{ event_type: eventType, metadata }])
    .then(({ error }) => {
      if (error) console.error("logEvent:", error.message);
    });
}