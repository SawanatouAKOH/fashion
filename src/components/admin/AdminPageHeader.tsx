import type { ReactNode } from "react";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-[#eadde3] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-[#a95b79]">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#211d20] sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#70676b]">{description}</p>
      </div>
      {actions ? <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:max-w-[60%]">{actions}</div> : null}
    </header>
  );
}