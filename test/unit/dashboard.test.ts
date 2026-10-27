import { buildSummaryCards, emptySummary, timeAgo } from "@/lib/dashboard";

describe("buildSummaryCards", () => {
  it("shows live asset figures, not placeholders", () => {
    const cards = buildSummaryCards({
      ...emptySummary,
      inventoryTracked: 1234,
      addedThisMonth: 5,
      deployed: 3,
      readyToDeploy: 4,
      dueForAudit: 2,
      overdueCheckin: 1,
      undeployable: 7,
      pending: 6,
    });

    expect(cards.map((c) => [c.label, c.value, c.detail])).toEqual([
      ["Inventory Tracked", "1,234", "5 added this month"],
      ["Deployed", "3", "4 ready to deploy"],
      ["Due for Audit", "2", "1 overdue check-in"],
      ["Un-deployable", "7", "6 pending"],
    ]);
  });

  it("pluralizes the overdue check-in count", () => {
    const [, , audit] = buildSummaryCards({ ...emptySummary, overdueCheckin: 3 });
    expect(audit.detail).toBe("3 overdue check-ins");
  });
});

describe("timeAgo", () => {
  const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

  it.each([
    [10_000, "just now"],
    [5 * 60_000, "5 min ago"],
    [3 * 3_600_000, "3 hr ago"],
    [2 * 86_400_000, "2 d ago"],
  ])("formats %i ms as %s", (ms, expected) => {
    expect(timeAgo(ago(ms))).toBe(expected);
  });
});
