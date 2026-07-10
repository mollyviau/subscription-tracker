// Estimated uses per month for each usage frequency
export const USES_PER_MONTH = {
  daily: 30,
  weekly: 12,   // "a few times a week"
  monthly: 3,   // "a few times a month"
  rarely: 0.5,  // "every few months"
  never: 0.1,   // avoids divide-by-zero, yields a very poor score
};

// Cost-per-use thresholds → score bands (tune these during pilot testing)
export const SCORE_BANDS = [
  { maxCostPerUse: 0.75,     score: 95, label: "Excellent", color: "text-emerald-400 border-emerald-800" },
  { maxCostPerUse: 1.5,      score: 80, label: "Good",      color: "text-cyan-400 border-cyan-800" },
  { maxCostPerUse: 3,        score: 60, label: "Fair",      color: "text-gray-300 border-white/10" },
  { maxCostPerUse: 7,        score: 40, label: "Review",    color: "text-yellow-400 border-yellow-800" },
  { maxCostPerUse: Infinity, score: 15, label: "Cancel?",   color: "text-red-400 border-red-800" },
];

export const REVIEW_THRESHOLD = 40; // scores at/below this get flagged

export function monthlyCost(sub) {
  const cost = parseFloat(sub.cost);
  return sub.billing_cycle === "yearly" ? cost / 12 : cost;
}

export function getUtilityScore(sub) {
  const monthly = monthlyCost(sub);
  if (monthly === 0) {
    return { score: 100, label: "Free", color: "text-emerald-400 border-emerald-800", costPerUse: 0 };
  }
  const costPerUse = monthly / USES_PER_MONTH[sub.usage];
  const band = SCORE_BANDS.find((b) => costPerUse <= b.maxCostPerUse);
  return { score: band.score, label: band.label, color: band.color, costPerUse };
}