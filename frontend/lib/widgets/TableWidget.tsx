import React, { useState } from "react";
import { motion } from "framer-motion";
import { WidgetConfig } from "@/lib/engines/WidgetEngine";
import { useFilterEngine } from "@/lib/engines/FilterEngine";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getGroupedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Table as TableIcon, ChevronDown, ChevronUp } from "lucide-react";

export default function TableWidget({ config, data }: { config: WidgetConfig; data: any }) {
  const toggleFilter = useFilterEngine((state) => state.toggleFilter);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState(false);

  const tConf = config.tableConfig;
  if (!tConf) return null;

  const cols = tConf.columns.map((c) => ({
    accessorKey: c.key,
    header: c.label,
    cell: (info: any) => {
      const val = info.getValue();
      if (val === null || val === undefined) return "-";
      switch (c.format) {
        case "currency": return `$ ${Number(val).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
        case "percent": return `${Number(val).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
        case "number": return Number(val).toLocaleString();
        case "date": return new Date(val).toLocaleDateString();
        default: return String(val);
      }
    }
  }));

  const table = useReactTable({
    data: data || [],
    columns: cols,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  const handleRowClick = (row: any) => {
    if (config.filterDimension) {
      toggleFilter({
        dimension: config.filterDimension,
        value: row.original[config.filterDimension] || row.original.id,
        label: "Filtro",
        source: config.id,
      });
    }
  };

  const rows = table.getRowModel().rows;
  const displayRows = tConf.maxRows && !expanded ? rows.slice(0, tConf.maxRows) : rows;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{config.title}</h3>
          {config.subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.subtitle}</p>}
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
          <TableIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-grow overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        {(!data || data.length === 0) ? (
          <div className="flex items-center justify-center h-32 text-sm text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
            No se encontraron registros
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3.5 font-semibold tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1 text-[10px]">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUp className="w-3 h-3" />,
                          desc: <ChevronDown className="w-3 h-3" />
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {displayRows.map((row, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={row.id}
                  onClick={() => handleRowClick(row)}
                  className={`border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${config.filterDimension ? 'cursor-pointer' : ''} last:border-0`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {tConf.maxRows && rows.length > tConf.maxRows && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 rounded-full transition-colors"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
