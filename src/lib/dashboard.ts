export interface DashboardSummary {
  inventoryTracked: number;
  addedThisMonth: number;
  deployed: number;
  readyToDeploy: number;
  pending: number;
  undeployable: number;
  archived: number;
  dueForAudit: number;
  overdueCheckin: number;
  statusMix: { type: string; count: number }[];
  activity: { at: string; title: string; meta: string }[];
  recentAssets: { name: string; owner: string | null; state: string; updatedAt: string }[];
}

export const emptySummary: DashboardSummary = {
  inventoryTracked: 0,
  addedThisMonth: 0,
  deployed: 0,
  readyToDeploy: 0,
  pending: 0,
  undeployable: 0,
  archived: 0,
  dueForAudit: 0,
  overdueCheckin: 0,
  statusMix: [],
  activity: [],
  recentAssets: [],
};

const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

export function buildSummaryCards(summary: DashboardSummary) {
  return [
    {
      label: "Inventory Tracked",
      value: summary.inventoryTracked.toLocaleString(),
      detail: `${summary.addedThisMonth.toLocaleString()} added this month`,
      accent: "text-emerald-600 dark:text-[#43d3cf]",
    },
    {
      label: "Deployed",
      value: summary.deployed.toLocaleString(),
      detail: `${summary.readyToDeploy.toLocaleString()} ready to deploy`,
      accent: "text-rose-600 dark:text-[#ff5b9a]",
    },
    {
      label: "Due for Audit",
      value: summary.dueForAudit.toLocaleString(),
      detail: `${plural(summary.overdueCheckin, "overdue check-in")}`,
      accent: "text-amber-600 dark:text-[#ffb24d]",
    },
    {
      label: "Un-deployable",
      value: summary.undeployable.toLocaleString(),
      detail: `${summary.pending.toLocaleString()} pending`,
      accent: "text-indigo-600 dark:text-[#9c8cff]",
    },
  ];
}

export function timeAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}
