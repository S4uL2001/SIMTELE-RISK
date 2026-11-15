import { SimulationConfig, SimulationSnapshot } from '@/types/simulation';
import { SensorMeasurement } from '@/types/sensor';
import { createRng } from './randomGenerator';
import { velocidadViento, tensionCable } from './sensorModels';
import { TelemetryEngine } from './telemetryEngine';

export class SimulationEngine {
  /**
   * Genera un "Snapshot" completo de datos estáticos para una duración dada.
   * Útil para poblar los gráficos y calcular los errores inmediatamente.
   */
  static generateDataset(config: SimulationConfig): SimulationSnapshot {
    const { duracionSeg, frecuenciaMuestreoHz, semilla, escenario, sensores } = config;
    
    // Creamos el generador determinista
    const rng = createRng(semilla);
    
    // Calculamos el paso de tiempo (delta t)
    const dt = 1 / frecuenciaMuestreoHz;
    const pasos = Math.floor(duracionSeg * frecuenciaMuestreoHz);
    
    const medidasViento: SensorMeasurement[] = [];
    const medidasTension: SensorMeasurement[] = [];

    for (let i = 0; i <= pasos; i++) {
      const t = i * dt;

      // 1. Verdad Analítica (Referencia)
      const vRef = velocidadViento(t, sensores.anemometro);
      const tRef = tensionCable(t, sensores.celulaCarga);

      // 2. Generación de Telemetría (Viento)
      medidasViento.push(
        TelemetryEngine.generateMeasurement(
          `v_${i}`,
          'anemometro',
          t,
          vRef,
          escenario,
          rng
        )
      );

      // 3. Generación de Telemetría (Tensión)
      medidasTension.push(
        TelemetryEngine.generateMeasurement(
          `t_${i}`,
          'celula_carga',
          t,
          tRef,
          escenario,
          rng
        )
      );
    }

    return {
      config,
      tiempoActual: duracionSeg,
      status: 'finished',
      medidas: {
        anemometro: medidasViento,
        celula_carga: medidasTension,
      },
    };
  }
}