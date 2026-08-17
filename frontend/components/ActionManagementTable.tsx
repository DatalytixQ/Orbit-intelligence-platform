"use client";

import { useState } from "react";
import { fetchFromApiClient } from "@/lib/api.client";
import { CheckCircle2, Clock, User, AlertCircle } from "lucide-react";

export type ActionData = {
  id: number;
  insight_key: string;
  insight_id: number;
  action_title: string;
  action_description: string;
  owner_name: string;
  status: string;
  created_at: string;
  due_date: string;
  completed_at: string | null;
  result_note: string | null;
};

export default function ActionManagementTable({ actions }: { actions: ActionData[] }) {
  const [localActions, setLocalActions] = useState<ActionData[]>(actions);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  if (!localActions || localActions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-background border border-border rounded-lg">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground font-medium">No hay acciones registradas.</p>
      </div>
    );
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    setIsUpdating(id);
    try {
      const updated = await fetchFromApiClient(`/api/insights/actions/${id}/status`, {
        method: "POST",
        body: JSON.stringify({ status: newStatus }),
      });
      if (updated && !updated.error) {
        setLocalActions(prev => prev.map(a => a.id === id ? { ...a, status: updated.status, completed_at: updated.completed_at } : a));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="min-w-full divide-y divide-border bg-card text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-foreground">Acción</th>
            <th className="px-4 py-3 text-left font-medium text-foreground">Responsable</th>
            <th className="px-4 py-3 text-left font-medium text-foreground">Estado</th>
            <th className="px-4 py-3 text-left font-medium text-foreground">Vencimiento</th>
            <th className="px-4 py-3 text-right font-medium text-foreground">Actualizar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {localActions.map((action) => (
            <tr key={action.id} className="hover:bg-muted">
              <td className="px-4 py-3">
                <p className="font-medium text-foreground">{action.action_title}</p>
                <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{action.action_description}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-1.5 h-3.5 w-3.5" />
                  {action.owner_name || "Sin Asignar"}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {action.status === 'completada' ? (
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Completada
                  </span>
                ) : action.status === 'en_progreso' ? (
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    En Progreso
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                    Pendiente
                  </span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  {new Date(action.due_date).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                {action.status !== 'completada' && (
                  <button
                    onClick={() => handleStatusChange(action.id, 'completada')}
                    disabled={isUpdating === action.id}
                    className="inline-flex items-center justify-center rounded-md bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted disabled:opacity-50"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-green-500" />
                    Marcar lista
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
