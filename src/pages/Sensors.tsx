import { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

export default function Sensors() {
  const [activeTab, setActiveTab] = useState(1);
  const { config } = useSimulationStore(); // Solo para el M4

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Modelos Matemáticos del Sistema</h1>
        <p className="text-slate-400">Ecuaciones analíticas de referencia para los 4 módulos.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-panelBorder pb-2">
        {[1, 2, 3, 4].map((mod) => (
          <button
            key={mod}
            onClick={() => setActiveTab(mod)}
            className={`px-4 py-2 rounded-t-lg font-bold transition ${
              activeTab === mod ? 'bg-panel text-accent border-t-2 border-accent' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Módulo {mod}
          </button>
        ))}
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg p-6">
        {activeTab === 1 && (
          <div>
            <h2 className="text-xl font-bold text-accent mb-4">Módulo 1: Frenado (EDO)</h2>
            <p className="text-slate-300 mb-4">Sistema de ecuaciones diferenciales para la cinemática de frenado:</p>
            <div className="font-mono text-green-400 bg-[#0b1120] p-4 rounded text-center text-lg">
              dx/dt = v(t)<br/>
              dv/dt = -a
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <h2 className="text-xl font-bold text-accent mb-4">Módulo 2: Deterioro (Raíces)</h2>
            <p className="text-slate-300 mb-4">Modelo cuadrático de degradación mecánica:</p>
            <div className="font-mono text-green-400 bg-[#0b1120] p-4 rounded text-center text-lg">
              D(t) = d₀ + αt + βt²
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <h2 className="text-xl font-bold text-accent mb-4">Módulo 3: Viento (EDO)</h2>
            <p className="text-slate-300 mb-4">Oscilador armónico forzado y amortiguado:</p>
            <div className="font-mono text-green-400 bg-[#0b1120] p-4 rounded text-center text-lg">
              dv/dt = (F₀cos(ωt) - cv - kx) / m
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div>
            <h2 className="text-xl font-bold text-accent mb-4">Módulo 4: Telemetría (Sensores)</h2>
            <p className="text-slate-300 mb-4">Señales sintéticas de viento y tensión:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="font-mono text-green-400 bg-[#0b1120] p-4 rounded text-center">
                v(t) = {config.sensores.anemometro.vMedia} + {config.sensores.anemometro.amplitud}·sin({config.sensores.anemometro.frecuenciaAngular}t)
              </div>
              <div className="font-mono text-green-400 bg-[#0b1120] p-4 rounded text-center text-sm">
                T(t) = {config.sensores.celulaCarga.tMedia} + {config.sensores.celulaCarga.amplitudSeno}·sin({config.sensores.celulaCarga.frecuenciaAngular}t - {config.sensores.celulaCarga.desfase}) + {config.sensores.celulaCarga.amplitudExponencial}e^(-{config.sensores.celulaCarga.amortiguamiento}t)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}