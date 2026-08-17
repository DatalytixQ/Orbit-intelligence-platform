"use client";

import React, { useMemo, useState } from "react";
import { Package, Truck, Warehouse } from "lucide-react";

type Node = {
  id: string;
  group: "vendor" | "item" | "location";
  label: string;
};

type Edge = {
  source: string;
  target: string;
  value: number;
};

type NetworkGraphProps = {
  nodes: Node[];
  edges: Edge[];
};

export default function NetworkGraph({ nodes, edges }: NetworkGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { vendors, items, locations } = useMemo(() => {
    return {
      vendors: nodes.filter((n) => n.group === "vendor"),
      items: nodes.filter((n) => n.group === "item"),
      locations: nodes.filter((n) => n.group === "location"),
    };
  }, [nodes]);

  const COLUMN_WIDTH = 300;
  const NODE_HEIGHT = 60;
  const GAP_Y = 20;

  const getHeight = (count: number) => count * NODE_HEIGHT + (count - 1) * GAP_Y;
  const maxItems = Math.max(vendors.length, items.length, locations.length);
  const containerHeight = Math.max(600, getHeight(maxItems) + 100);

  const getYPos = (index: number, count: number) => {
    const startY = (containerHeight - getHeight(count)) / 2;
    return startY + index * (NODE_HEIGHT + GAP_Y);
  };

  const nodePositions: Record<string, { x: number; y: number }> = {};

  vendors.forEach((n, i) => {
    nodePositions[n.id] = { x: 50, y: getYPos(i, vendors.length) };
  });
  items.forEach((n, i) => {
    nodePositions[n.id] = { x: 50 + COLUMN_WIDTH, y: getYPos(i, items.length) };
  });
  locations.forEach((n, i) => {
    nodePositions[n.id] = { x: 50 + COLUMN_WIDTH * 2, y: getYPos(i, locations.length) };
  });

  return (
    <div className="relative w-full overflow-x-auto bg-slate-50 border border-slate-200 rounded-lg p-4" style={{ height: containerHeight }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((e, idx) => {
          const source = nodePositions[e.source];
          const target = nodePositions[e.target];
          if (!source || !target) return null;
          
          const isActive = hoveredNode === e.source || hoveredNode === e.target;
          const isFaded = hoveredNode !== null && !isActive;

          const pathData = `M ${source.x + 200} ${source.y + 30} C ${source.x + 250} ${source.y + 30}, ${target.x - 50} ${target.y + 30}, ${target.x} ${target.y + 30}`;
          return (
            <path
              key={idx}
              d={pathData}
              fill="none"
              stroke={isActive ? "#6366f1" : "#cbd5e1"}
              strokeWidth={isActive ? Math.min(6, Math.max(2, e.value / 100)) : 2}
              opacity={isFaded ? 0.2 : 0.7}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {nodes.map((n) => {
        const pos = nodePositions[n.id];
        if (!pos) return null;

        const isHovered = hoveredNode === n.id;
        const isFaded = hoveredNode !== null && !isHovered && !edges.some(e => 
           (e.source === n.id && e.target === hoveredNode) || (e.target === n.id && e.source === hoveredNode)
        );

        const nodeClass = [
          "absolute flex items-center p-3 w-[200px] bg-white border rounded-lg shadow-sm cursor-pointer transition-all duration-300",
          isHovered ? "border-indigo-500 shadow-md ring-2 ring-indigo-100 z-10" : "border-slate-200",
        ].join(" ");

        const iconClass = [
          "flex items-center justify-center w-10 h-10 rounded-full mr-3",
          n.group === "vendor" ? "bg-emerald-100 text-emerald-600" :
          n.group === "item" ? "bg-indigo-100 text-indigo-600" :
          "bg-amber-100 text-amber-600",
        ].join(" ");

        return (
          <div
            key={n.id}
            onMouseEnter={() => setHoveredNode(n.id)}
            onMouseLeave={() => setHoveredNode(null)}
            className={nodeClass}
            style={{
              left: pos.x,
              top: pos.y,
              height: NODE_HEIGHT,
              opacity: isFaded ? 0.3 : 1
            }}
          >
            <div className={iconClass}>
              {n.group === "vendor" && <Truck size={20} />}
              {n.group === "item" && <Package size={20} />}
              {n.group === "location" && <Warehouse size={20} />}
            </div>
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="text-sm font-semibold text-slate-800" title={n.label}>{n.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
