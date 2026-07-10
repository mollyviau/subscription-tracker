// logging helper
// src/lib/analytics.js
import { supabase } from "./supabase.js";

export function logEvent(eventType, metadata = {}) {
  supabase
    .from("events")
    .insert([{ event_type: eventType, metadata }])
    .then(({ error }) => {
      if (error) console.error("logEvent:", error.message);
    });
}