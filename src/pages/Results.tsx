import { useSimulationStore } from '@/store/useSimulationStore';
import { SENSOR_UNITS } from '@/types/sensor';

export default function Results() {
  const { snapshot } = useSimulationStore();

  if (!snapshot) {
    return <div className="text-center p-10 text-slate-400">Inicia una simulación para ver los resultados.</div>;
  }

  // Calcular métricas para el Anemómetro
  const vientos = snapshot.medidas.anemometro.map(m => m.valorReferencia);
  const maxViento = Math.max(...vientos);
  const minViento = Math.min(...vientos);
  const umbralVientoSuperado = maxViento > snapshot.config.sensores.anemometro.umbral;

  // Calcular métricas para la Célula de Carga
  const tensiones = snapshot.medidas.celula_carga.map(m => m.valorReferencia);
  const maxTension = Math.max(...tensiones);
  const minTension = Math.min(...tensiones);
  const umbralTensionSuperado = maxTension > snapshot.config.sensores.celulaCarga.umbral;

  // Función para exportar los datos a CSV
  const exportarCSV = () => {
    const headers = "Sensor,Tiempo,Valor_Referencia,Valor_Observado,Estado\n";
    
    const rowsViento = snapshot.medidas.anemometro.map(m => 
      `Anemometro,${m.t.toFixed(2)},${m.valorReferencia.toFixed(4)},${m.valorObservado !== null ? m.valorObservado.toFixed(4) : 'NULL'},${m.estadoTransmision}`
    ).join("\n");
    
    const rowsTension = snapshot.medidas.celula_carga.map(m => 
      `Celula_Carga,${m.t.toFixed(2)},${m.valorReferencia.toFixed(4)},${m.valorObservado !== null ? m.valorObservado.toFixed(4) : 'NULL'},${m.estadoTransmision}`
    ).join("\n");

    const csvContent = headers + rowsViento + "\n" + rowsTension;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `simtele_datos_${new Date().getTime()}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Resultados del Experimento</h1>
          <p className="text-slate-400">Resumen de valores extremos y auditoría de umbrales.</p>
        </div>
        <button 
          onClick={exportarCSV} 
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded shadow transition font-semibold text-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        
        {/* Resultados Anemómetro */}
        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h2 className="text-xl font-bold text-accent mb-4">Anemómetro</h2>
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-panelBorder/50 pb-2">
              <span className="text-slate-400">Valor Máximo:</span>
              <span className="font-mono text-slate-200">{maxViento.toFixed(2)} {SENSOR_UNITS.anemometro}</span>
            </li>
            <li className="flex justify-between border-b border-panelBorder/50 pb-2">
              <span className="text-slate-400">Valor Mínimo:</span>
              <span className="font-mono text-slate-200">{minViento.toFixed(2)} {SENSOR_UNITS.anemometro}</span>
            </li>
            <li className="flex justify-between pt-2">
              <span className="text-slate-400">Auditoría de Umbral ({snapshot.config.sensores.anemometro.umbral} m/s):</span>
              <span className={`font-bold ${umbralVientoSuperado ? 'text-red-400' : 'text-green-400'}`}>
                {umbralVientoSuperado ? '¡UMBRAL SUPERADO!' : 'Normal'}
              </span>
            </li>
          </ul>
        </div>

        {/* Resultados Célula de Carga */}
        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h2 className="text-xl font-bold text-accent mb-4">Célula de Carga</h2>
          <ul className="space-y-3">
            <li className="flex justify-between border-b border-panelBorder/50 pb-2">
              <span className="text-slate-400">Valor Máximo:</span>
              <span className="font-mono text-slate-200">{maxTension.toFixed(2)} {SENSOR_UNITS.celula_carga}</span>
            </li>
            <li className="flex justify-between border-b border-panelBorder/50 pb-2">
              <span className="text-slate-400">Valor Mínimo:</span>
              <span className="font-mono text-slate-200">{minTension.toFixed(2)} {SENSOR_UNITS.celula_carga}</span>
            </li>
            <li className="flex justify-between pt-2">
              <span className="text-slate-400">Auditoría de Umbral ({snapshot.config.sensores.celulaCarga.umbral} kN):</span>
              <span className={`font-bold ${umbralTensionSuperado ? 'text-red-400' : 'text-green-400'}`}>
                {umbralTensionSuperado ? '¡UMBRAL SUPERADO!' : 'Normal'}
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="bg-[#0b1120] border border-panelBorder rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Interpretación Física</h3>
        <p className="text-slate-400 text-sm max-w-3xl mx-auto">
          Los modelos matemáticos de referencia han sido evaluados. 
          {umbralVientoSuperado || umbralTensionSuperado 
            ? ' Se han detectado cruces de umbrales operativos de seguridad. En un escenario real, esto requeriría una reducción de velocidad o detención de la cabina.' 
            : ' Los valores se mantuvieron dentro de los límites operativos seguros durante toda la simulación.'}
        </p>
      </div>
    </div>
  );
}