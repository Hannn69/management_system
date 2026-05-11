const summaryCards = [
  {
    label: "Inventory Tracked",
    value: "2,608",
    detail: "+8.4% this month",
    tone: "bg-[#121f29]",
    accent: "text-[#43d3cf]",
  },
  {
    label: "Open Licenses",
    value: "50",
    detail: "12 renewals soon",
    tone: "bg-[#121f29]",
    accent: "text-[#ff5b9a]",
  },
  {
    label: "Accessories Ready",
    value: "4",
    detail: "1 awaiting assignment",
    tone: "bg-[#121f29]",
    accent: "text-[#ffb24d]",
  },
  {
    label: "Supply Alerts",
    value: "3",
    detail: "Low-stock watchlist",
    tone: "bg-[#121f29]",
    accent: "text-[#9c8cff]",
  },
];

const activityFeed = [
  {
    time: "3:33 AM",
    title: "Macbook check-in completed",
    meta: "Admin User reassigned Abdul Salam's device to Josefa.",
  },
  {
    time: "3:33 AM",
    title: "New workspace created",
    meta: "MSB workspace was created under Operations.",
  },
  {
    time: "3:30 AM",
    title: "License allocation updated",
    meta: "Photoshop license linked to Macbook Pro 13.",
  },
  {
    time: "3:26 AM",
    title: "New team member added",
    meta: "Deckow Wellington profile was created.",
  },
];

const tableRows = [
  {
    name: "Macbook Pro 13",
    owner: "Abdul Salam",
    state: "In service",
    updated: "5 min ago",
  },
  {
    name: "Photoshop License",
    owner: "Design Team",
    state: "Assigned",
    updated: "8 min ago",
  },
  {
    name: "Docking Station",
    owner: "Operations",
    state: "Ready",
    updated: "22 min ago",
  },
  {
    name: "Onboarding Kit",
    owner: "People Ops",
    state: "Pending",
    updated: "1 hr ago",
  },
];

const statusBars = [
  { label: "Ready", value: 74, color: "#20a39e" },
  { label: "Pending", value: 14, color: "#f18f01" },
  { label: "Archived", value: 9, color: "#4f86c6" },
  { label: "Maintenance", value: 3, color: "#d1495b" },
];

export function DashboardContent() {
  return (
    <main className="px-6 pb-6 pt-5">
      <div className="mx-auto w-full max-w-[1380px] flex flex-col gap-6">
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className={`${card.tone} rounded-[28px] border border-white/6 px-5 py-5 shadow-[0_25px_55px_-35px_rgba(0,0,0,0.8)]`}
            >
              <p className="text-sm font-medium text-[#7993a1]">{card.label}</p>
              <p className={`mt-3 text-4xl font-semibold ${card.accent}`}>
                {card.value}
              </p>
              <p className="mt-3 text-sm text-[#688290]">{card.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/6 bg-[linear-gradient(135deg,#142737_0%,#19384f_50%,#1f5962_100%)] px-7 py-7 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,0.82)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/62">
              Live Workspace
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight">
              Manage assets, requests, and team operations from a single view.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80">
              This dashboard is tailored for your project and keeps the familiar
              operational overview, but with its own visual system and content
              structure.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/8 bg-black/12 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Active items
                </p>
                <p className="mt-2 text-2xl font-semibold">2.6k</p>
              </div>
              <div className="rounded-[28px] border border-white/8 bg-black/12 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Pending actions
                </p>
                <p className="mt-2 text-2xl font-semibold">18</p>
              </div>
              <div className="rounded-[28px] border border-white/8 bg-black/12 px-4 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Team coverage
                </p>
                <p className="mt-2 text-2xl font-semibold">92%</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/6 bg-[#121f29] px-6 py-6 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7690a0]">
                  Status Mix
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Resource Health
                </h3>
              </div>
              <span className="rounded-full bg-[#1a2b36] px-3 py-1 text-xs font-medium text-[#8ca7b6]">
                Updated now
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center gap-6">
              <div className="relative flex h-[260px] w-[260px] items-center justify-center">
                <div
                  className="h-[240px] w-[240px] rounded-full"
                  style={{
                    background:
                      "conic-gradient(#20a39e 0deg 266.4deg, #f18f01 266.4deg 316.8deg, #4f86c6 316.8deg 349.2deg, #d1495b 349.2deg 360deg)",
                  }}
                />
                <div className="absolute flex h-[138px] w-[138px] flex-col items-center justify-center rounded-full border border-white/6 bg-[#121f29] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                  <span className="text-xs uppercase tracking-[0.22em] text-[#6f8a9a]">
                    Healthy
                  </span>
                  <span className="mt-2 text-4xl font-semibold text-white">
                    74%
                  </span>
                </div>
              </div>

              <div className="grid w-full gap-3">
                {statusBars.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-[28px] bg-[#182732] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-[#d3dde4]">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm text-[#8ca6b5]">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/6 bg-[#121f29] px-6 py-6 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.82)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7792a1]">
                  Activity Stream
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Recent Activity
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  className="rounded-full border border-white/8 bg-[#17242d] px-4 py-2.5 text-sm text-white placeholder:text-[#7d97a7] focus:outline-none"
                  placeholder="Search activity"
                  type="text"
                />
                <button
                  type="button"
                  className="rounded-full border border-white/8 bg-[#17242d] px-4 py-2.5 text-sm font-medium text-[#b8cad4]"
                >
                  Filter
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activityFeed.map((item) => (
                <div
                  key={`${item.time}-${item.title}`}
                  className="flex gap-4 rounded-[28px] border border-white/5 bg-[#182732] px-4 py-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[28px] bg-[#223948] text-xs font-bold text-white">
                    {item.time.replace(":", "")}
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#7691a0]">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/6 bg-[#121f29] px-6 py-6 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.82)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7792a1]">
                  Snapshot
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Key Resources
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-white/8 px-4 py-2 text-sm font-medium text-[#b8cad4]"
              >
                Export
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/6">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#17242d] text-sm text-[#7d97a7]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Resource</th>
                    <th className="px-4 py-3 font-semibold">Owner</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                    <th className="px-4 py-3 font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr
                      key={`${row.name}-${index}`}
                      className="border-t border-white/6 bg-[#121f29] text-sm text-[#dce6ed]"
                    >
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-[#7d97a7]">{row.owner}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-[#173039] px-3 py-1 text-xs font-medium text-[#56d0cb]">
                          {row.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#7d97a7]">{row.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
