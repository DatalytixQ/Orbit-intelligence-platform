"use client";

import React from "react";

export default function DQBotTrigger({ contextItem, className, label }: { contextItem: any; className?: string; label?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("open-dqbot", { detail: { context: contextItem } })
    );
  };

  return (
    <button
      onClick={handleClick}
      className={className || "text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"}
    >
      {label || "Revisar con DQBot"}
    </button>
  );
}
