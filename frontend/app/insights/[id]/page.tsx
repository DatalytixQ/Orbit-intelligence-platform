import AppShell from "@/components/layout/AppShell";
import { fetchFromApi } from "@/lib/api";
import Link from "next/link";
import { 
    AlertCircle, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Info 
} from "lucide-react";

export default async function InsightDetailPage({ params }: { params: { id: string } }) {
    const insight = await fetchFromApi(`/api/insights/${params.id}`);

    if (!insight || insight.error) {
        return (
            <AppShell>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-slate-900">Insight no encontrado</h2>
                        <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-500">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    const isResolved = insight.status === 'resuelto';
    
    return (
        <AppShell>
            <div className="mx-auto max-w-4xl px-4 py-8">
                <Link 
                    href="/" 
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                insight.severity === 'critico' ? 'bg-red-100 text-red-800' :
                                insight.severity === 'alerta' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {insight.severity.toUpperCase()}
                            </span>
                            
                            <span className={`inline-flex items-center text-sm font-medium ${
                                isResolved ? 'text-green-600' : 'text-slate-600'
                            }`}>
                                {isResolved ? (
                                    <><CheckCircle2 className="mr-1.5 h-4 w-4" /> Resuelto</>
                                ) : (
                                    <><Clock className="mr-1.5 h-4 w-4" /> Activo</>
                                )}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            {insight.title}
                        </h1>
                        
                        <p className="text-slate-600 mb-8">
                            {insight.description}
                        </p>

                        <div className="bg-slate-50 rounded-lg p-6 mb-8">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                                <Info className="mr-2 h-4 w-4 text-indigo-500" />
                                Acción Sugerida
                            </h3>
                            <p className="text-slate-700 text-sm">
                                {insight.action_suggested || "Revisar y tomar acción correctiva según el contexto del insight."}
                            </p>
                        </div>

                        {insight.context_json && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                                    Contexto de Datos
                                </h3>
                                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-sm text-slate-300 font-mono">
                                        {JSON.stringify(insight.context_json, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
