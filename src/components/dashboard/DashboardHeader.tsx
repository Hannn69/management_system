"use client";

type DashboardHeaderProps = {
  title: string;
};

export function DashboardHeader({ title }: DashboardHeaderProps) {

  return (
    <header className="px-6 pt-6">
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="rounded-[28px] border border-zinc-200 dark:border-white/8 bg-white dark:bg-[#121e28] px-6 py-5 shadow-sm dark:shadow-[0_30px_70px_-38px_rgba(0,0,0,0.78)]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-[#6f8c9c]">
                Control Center
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-foreground">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-[#7d97a6]">
                Track operational status, recent requests, and resource health
                from one shared workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
