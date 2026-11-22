import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/simulationService'; // <-- IMPORTACIÓN CORREGIDA

export default function History() {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats(); // <-- FUNCIÓN CORREGIDA
      setHistorial(data || []);
    } catch (error) {
      console.error('Error al cargar historial', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Historial de Experimentos</h1>
          <p className="text-slate-400">Todas las simulaciones guardadas en Supabase.</p>
        </div>
        <button 
          onClick={cargarHistorial} 
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded text-sm transition"
        >
          Actualizar Tabla
        </button>
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0b1120]">
            <tr className="text-slate-400 text-sm border-b border-panelBorder">
              <th className="py-3 px-4">Módulo</th>
              <th className="py-3 px-4">Nombre / ID</th>
              <th className="py-3 px-4">Escenario</th>
              <th className="py-3 px-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Cargando datos desde Supabase...</td></tr>
            ) : historial.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-500">No hay experimentos guardados. Ve al simulador y guarda uno.</td></tr>
            ) : (
              historial.map((item) => (
                <tr key={item.id} className="border-b border-panelBorder/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-slate-300">
                    {item.escenario?.caso_estudio?.nombre || 'Desconocido'}
                  </td>
                  <td className="py-3 px-4 text-accent font-mono text-xs">
                    {item.nombre}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.escenario?.tipo === 'NORMAL' ? 'bg-green-500/20 text-green-400' :
                      item.escenario?.tipo === 'ESTRES' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.escenario?.tipo || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}