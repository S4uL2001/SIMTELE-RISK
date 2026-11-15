import { useEffect, useState } from 'react';
import { obtenerHistorial } from '@/services/simulationService';

export default function History() {
  const [historial, setHistorial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const data = await obtenerHistorial();
      setHistorial(data || []);
    } catch (error) {
      console.error('Error al cargar historial', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Historial de Experimentos</h1>
        <p className="text-slate-400">Simulaciones guardadas en la base de datos (Supabase).</p>
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0b1120]">
            <tr className="text-slate-400 text-sm border-b border-panelBorder">
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Escenario</th>
              <th className="py-3 px-4">Duración</th>
              <th className="py-3 px-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Cargando datos...</td></tr>
            ) : historial.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-500">No hay experimentos guardados.</td></tr>
            ) : (
              historial.map((item) => (
                <tr key={item.id} className="border-b border-panelBorder/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-accent">{item.nombre}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs">{item.escenario?.tipo || 'N/A'}</span>
                  </td>
                  <td className="py-3 px-4">{item.duracion} s</td>
                  <td className="py-3 px-4">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}