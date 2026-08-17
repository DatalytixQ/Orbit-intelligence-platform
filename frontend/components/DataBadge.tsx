"use client";

import React from "react";

type DataState = "LIVE" | "DEMO" | "NO_DATA";

export default function DataBadge({ state }: { state: DataState }) {
  if (state === "LIVE") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        LIVE DATA
      </span>
    );
  }

  if (state === "DEMO") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-600 uppercase border border-amber-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        SAMPLE DATA
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase border border-border">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
      NO DATA
    </span>
  );
}
