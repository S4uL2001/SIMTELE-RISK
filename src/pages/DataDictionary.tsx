export default function DataDictionary() {
  const variables = [
    { simbolo: 't', nombre: 'Tiempo', unidad: 's', desc: 'Variable independiente del sistema continuo.' },
    { simbolo: 'v(t)', nombre: 'Velocidad del viento', unidad: 'm/s', desc: 'Medición del anemómetro ultrasónico. Oscila según ráfagas.' },
    { simbolo: 'T(t)', nombre: 'Tensión del cable', unidad: 'kN', desc: 'Medición de la célula de carga. Responde al viento y a la amortiguación hidráulica.' },
    { simbolo: 'Umbral', nombre: 'Límite de seguridad', unidad: '-', desc: 'Valor crítico (17 m/s o 462 kN) que activa las alertas operativas.' },
    { simbolo: 'ε(t)', nombre: 'Ruido', unidad: 'Variable', desc: 'Perturbación aleatoria añadida a la señal (y_obs = y_ref + ε).' },
    { simbolo: 'Ea', nombre: 'Error Absoluto', unidad: 'Variable', desc: 'Diferencia entre el valor real oculto y el valor reconstruido.' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Diccionario de Datos</h1>
        <p className="text-slate-400">Glosario de variables físicas y numéricas utilizadas en el simulador.</p>
      </div>

      <div className="bg-panel border border-panelBorder rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0b1120]">
            <tr className="text-slate-400 text-sm border-b border-panelBorder">
              <th className="py-3 px-4">Símbolo</th>
              <th className="py-3 px-4">Variable</th>
              <th className="py-3 px-4">Unidad</th>
              <th className="py-3 px-4">Descripción</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {variables.map((v, i) => (
              <tr key={i} className="border-b border-panelBorder/50 hover:bg-slate-800/30">
                <td className="py-3 px-4 font-mono text-accent font-bold">{v.simbolo}</td>
                <td className="py-3 px-4 text-slate-200">{v.nombre}</td>
                <td className="py-3 px-4 text-slate-400">{v.unidad}</td>
                <td className="py-3 px-4 text-slate-300">{v.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}