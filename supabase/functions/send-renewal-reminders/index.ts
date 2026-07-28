// supabase/functions/send-renewal-reminders/index.ts
//
// Daily job: emails a reminder for every subscription renewing in exactly 3 days.
// Triggered by pg_cron (see supabase/migrations/20260728_schedule_reminders.sql).
//
// Behaviour:
//   - selects subscriptions where next_billing_date = today + REMINDER_DAYS
//   - skips any already notified today (idempotency guard: last_notified_at)
//   - groups by user so each user gets ONE email listing all their renewals
//   - sends via Resend, then stamps last_notified_at and logs to `events`
//
// Deploy:
//   npx supabase functions deploy send-renewal-reminders
//
// Secrets (set once):
//   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxx
//   npx supabase secrets set REMINDER_FROM="SubTrack <reminders@sub-track.dev>"
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by the
// Edge Runtime — do not set them yourself.

import { createClient } from "jsr:@supabase/supabase-js@2";
// If jsr: resolution fails on your CLI version, swap the line above for:
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REMINDER_DAYS = 3;
const APP_URL = "https://www.sub-track.dev";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

// ---------- helpers ----------

/** YYYY-MM-DD for a date offset by n days from now (UTC). */
function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

/** Normalised monthly cost, matching the dashboard's calculation. */
function monthlyEquivalent(sub: Subscription): number {
  const cost = Number(sub.cost);
  return sub.billing_cycle === "yearly" ? cost / 12 : cost;
}

function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00Z`).toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

// ---------- types ----------

interface Subscription {
  id: string;
  user_id: string;
  name: string;
  cost: number;
  billing_cycle: string;
  category: string | null;
  next_billing_date: string;
}

// ---------- email template ----------

function buildEmail(subs: Subscription[], renewalDate: string) {
  const total = subs.reduce((sum, s) => sum + Number(s.cost), 0);
  const plural = subs.length === 1 ? "subscription" : "subscriptions";

  const rows = subs
    .map(
      (s) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #ececf2;">
          <div style="font-size:15px;font-weight:600;color:#1a1a2e;">${escapeHtml(s.name)}</div>
          <div style="font-size:13px;color:#6b6b80;margin-top:2px;">
            ${escapeHtml(s.category ?? "Uncategorised")} &middot; ${s.billing_cycle}
            ${
              s.billing_cycle === "yearly"
                ? ` &middot; ${money(monthlyEquivalent(s))}/mo equivalent`
                : ""
            }
          </div>
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #ececf2;text-align:right;
                   font-size:16px;font-weight:600;color:#1a1a2e;white-space:nowrap;">
          ${money(Number(s.cost))}
        </td>
      </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px 12px;background:#f4f4f8;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
    <tr><td style="background:#1a1a2e;border-radius:14px 14px 0 0;padding:24px 28px;">
      <div style="color:#a78bfa;font-size:12px;letter-spacing:1.4px;font-weight:600;">SUBTRACK</div>
      <div style="color:#ffffff;font-size:21px;font-weight:600;margin-top:6px;">
        ${subs.length} ${plural} ${subs.length === 1 ? "renews" : "renew"} in ${REMINDER_DAYS} days
      </div>
      <div style="color:#b8b8cc;font-size:14px;margin-top:6px;">${formatDate(renewalDate)}</div>
    </td></tr>

    <tr><td style="background:#ffffff;padding:8px 28px 4px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
    </td></tr>

    <tr><td style="background:#ffffff;padding:18px 28px;">
      <table role="presentation" width="100%">
        <tr>
          <td style="font-size:14px;color:#6b6b80;">Total charging on this date</td>
          <td style="text-align:right;font-size:19px;font-weight:700;color:#7c3aed;">${money(total)}</td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="background:#ffffff;padding:4px 28px 28px;text-align:center;">
      <a href="${APP_URL}" style="display:inline-block;background:#7c3aed;color:#ffffff;
         text-decoration:none;font-size:15px;font-weight:600;padding:13px 30px;border-radius:10px;">
        Review these subscriptions
      </a>
      <div style="font-size:12px;color:#9a9ab0;margin-top:16px;line-height:1.5;">
        Still time to cancel before you're charged.
      </div>
    </td></tr>

    <tr><td style="background:#f4f4f8;border-radius:0 0 14px 14px;padding:18px 28px;text-align:center;">
      <div style="font-size:11px;color:#9a9ab0;line-height:1.6;">
        Sent by SubTrack because you added ${subs.length === 1 ? "this subscription" : "these subscriptions"} to your tracker.<br/>
        <a href="${APP_URL}" style="color:#7c3aed;">Manage your subscriptions</a>
      </div>
    </td></tr>
  </table>
</body></html>`;

  const subject =
    subs.length === 1
      ? `${subs[0].name} renews in ${REMINDER_DAYS} days (${money(Number(subs[0].cost))})`
      : `${subs.length} subscriptions renew in ${REMINDER_DAYS} days (${money(total)})`;

  return { subject, html };
}

// ---------- handler ----------

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("REMINDER_FROM") ?? "SubTrack <onboarding@resend.dev>";

  if (!supabaseUrl || !serviceKey || !resendKey) {
    return json({ error: "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY" }, 500);
  }

  // Optional body: { "dryRun": true, "days": 3 } — for QA without sending mail.
  let dryRun = false;
  let days = REMINDER_DAYS;
  try {
    const body = await req.json();
    dryRun = body?.dryRun === true;
    if (Number.isInteger(body?.days)) days = body.days;
  } catch {
    // no body / not JSON — use defaults
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const targetDate = isoDate(days);
  const today = isoDate(0);

  // 1. Select subscriptions renewing on the target date, not yet notified today.
  const { data: subs, error: selectError } = await supabase
    .from("subscriptions")
    .select("id, user_id, name, cost, billing_cycle, category, next_billing_date")
    .eq("next_billing_date", targetDate)
    .or(`last_notified_at.is.null,last_notified_at.lt.${today}`);

  if (selectError) {
    console.error("select failed:", selectError.message);
    return json({ error: selectError.message }, 500);
  }

  if (!subs || subs.length === 0) {
    return json({ targetDate, matched: 0, emailsSent: 0, message: "Nothing to remind." });
  }

  // 2. Group by user — one email per person, not one per subscription.
  const byUser = new Map<string, Subscription[]>();
  for (const sub of subs as Subscription[]) {
    const list = byUser.get(sub.user_id) ?? [];
    list.push(sub);
    byUser.set(sub.user_id, list);
  }

  const results: Array<Record<string, unknown>> = [];
  let emailsSent = 0;

  for (const [userId, userSubs] of byUser) {
    // 3. Resolve the recipient address from Supabase Auth (no duplicate email column).
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    const email = userData?.user?.email;

    if (userError || !email) {
      results.push({ userId, status: "skipped", reason: userError?.message ?? "no email on account" });
      continue;
    }

    const { subject, html } = buildEmail(userSubs, targetDate);

    if (dryRun) {
      results.push({ userId, email, status: "dry-run", subscriptions: userSubs.length, subject });
      continue;
    }

    // 4. Send.
    let emailId: string | null = null;
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to: [email], subject, html }),
      });

      const payload = await res.json();

      if (!res.ok) {
        console.error("resend failed:", res.status, JSON.stringify(payload));
        results.push({ userId, email, status: "failed", reason: payload?.message ?? res.status });
        continue; // last_notified_at NOT stamped — tomorrow's run retries
      }
      emailId = payload?.id ?? null;
    } catch (err) {
      console.error("resend threw:", err);
      results.push({ userId, email, status: "failed", reason: String(err) });
      continue;
    }

    emailsSent++;
    const ids = userSubs.map((s) => s.id);

    // 5. Stamp the idempotency guard.
    const { error: stampError } = await supabase
      .from("subscriptions")
      .update({ last_notified_at: new Date().toISOString() })
      .in("id", ids);

    if (stampError) console.error("stamp failed:", stampError.message);

    // 6. Log to the events table (service role bypasses RLS, so user_id is explicit).
    //    `events` has no subscription_id column — the reference goes inside
    //    metadata, matching the convention used by logEvent() in analytics.js.
    const { error: eventError } = await supabase.from("events").insert(
      userSubs.map((s) => ({
        user_id: userId,
        event_type: "renewal_reminder_sent",
        metadata: {
          subscription_id: s.id,
          days_before: days,
          renewal_date: targetDate,
          cost: Number(s.cost),
          billing_cycle: s.billing_cycle,
          category: s.category,
          batch_size: userSubs.length,
          resend_id: emailId,
        },
      }))
    );

    if (eventError) console.error("event log failed:", eventError.message);

    results.push({ userId, email, status: "sent", subscriptions: ids.length, resendId: emailId });
  }

  return json({
    targetDate,
    matched: subs.length,
    recipients: byUser.size,
    emailsSent,
    dryRun,
    results,
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
