import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '@/services/simulationService';
import PlotlyChart from '@/components/charts/PlotlyChart';
import { Database, Layers, Clock, PlusCircle, Inbox, RefreshCw } from 'lucide-react';
import type { Data, Layout } from 'plotly.js';

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const modulosCount: Record<string, number> = {};
  stats.forEach(sim => {
    const modulo = sim.escenario?.caso_estudio?.nombre || 'Otro';
    modulosCount[modulo] = (modulosCount[modulo] || 0) + 1;
  });

  const barChartData: Data[] = [
    {
      x: Object.keys(modulosCount),
      y: Object.values(modulosCount),
      type: 'bar',
      marker: { color: ['#22d3ee', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'] }
    }
  ];

  const barChartLayout: Partial<Layout> = {
    title: { text: 'Simulaciones Ejecutadas por Módulo', font: { color: '#e2e8f0' } },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: { color: '#94a3b8' },
    xaxis: { gridcolor: '#1e293b' },
    yaxis: { gridcolor: '#1e293b', title: { text: 'Cantidad de ejecuciones' } }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Panel de Control</h1>
          <p className="text-slate-400 mt-1">Métricas y estadísticas globales extraídas de Supabase.</p>
        </div>
        <button 
          onClick={loadData} 
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-4 py-2 rounded-md text-sm transition shadow-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar Datos
        </button>
      </div>

      {/* Tarjetas de Resumen (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-panel border border-panelBorder p-5 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
          <div className="bg-cyan-500/10 p-3 rounded-lg"><Database className="w-6 h-6 text-cyan-500" /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Simulaciones</p>
            <p className="text-3xl font-bold text-slate-100 font-mono">{stats.length}</p>
          </div>
        </div>

        <div className="bg-panel border border-panelBorder p-5 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <div className="bg-green-500/10 p-3 rounded-lg"><Layers className="w-6 h-6 text-green-500" /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Módulos Activos</p>
            <p className="text-3xl font-bold text-slate-100 font-mono">{Object.keys(modulosCount).length}</p>
          </div>
        </div>

        <div className="bg-panel border border-panelBorder p-5 rounded-xl shadow-lg flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <div className="bg-yellow-500/10 p-3 rounded-lg"><Clock className="w-6 h-6 text-yellow-500" /></div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Última Ejecución</p>
            <p className="text-lg font-bold text-slate-100 font-mono pt-1">
              {stats.length > 0 ? new Date(stats[0].created_at).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>

        <Link to="/modulo1" className="bg-panel border border-panelBorder p-5 rounded-xl shadow-lg hover:bg-slate-800/80 transition flex items-center justify-center gap-2 group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:bg-indigo-400 transition"></div>
          <PlusCircle className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
          <span className="text-indigo-400 group-hover:text-indigo-300 font-bold">Nueva Simulación</span>
        </Link>
      </div>

      {/* Gráficos y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-panel border border-panelBorder rounded-xl p-4 shadow-lg">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              Cargando datos...
            </div>
          ) : stats.length > 0 ? (
            <PlotlyChart data={barChartData} layout={barChartLayout} />
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-slate-500">
              <Inbox className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-lg font-semibold text-slate-400">No hay simulaciones guardadas</p>
              <p className="text-sm mt-2 text-center max-w-sm">
                Ve a cualquier módulo, ejecuta los cálculos y presiona <strong>"Guardar en Base de Datos"</strong> para ver las estadísticas aquí.
              </p>
            </div>
          )}
        </div>

        <div className="bg-panel border border-panelBorder rounded-xl p-4 shadow-lg overflow-hidden">
          <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-panelBorder/50 pb-2">Últimos Experimentos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0b1120] text-slate-400">
                <tr>
                  <th className="py-3 px-4 rounded-tl-md font-semibold">Módulo</th>
                  <th className="py-3 px-4 font-semibold">Escenario</th>
                  <th className="py-3 px-4 rounded-tr-md font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-panelBorder/30">
                {stats.slice(0, 5).map((sim: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {sim.escenario?.caso_estudio?.nombre || 'Desconocido'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        sim.escenario?.tipo === 'NORMAL' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        sim.escenario?.tipo === 'ESTRES' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {sim.escenario?.tipo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                      {new Date(sim.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {stats.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500 italic">
                      Sin registros aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}