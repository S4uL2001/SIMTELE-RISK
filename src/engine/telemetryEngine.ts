import { SensorMeasurement, SensorType, TransmissionState } from '@/types/sensor';
import { ScenarioConfig } from '@/types/simulation';
import { uniformNoise } from './randomGenerator';

export class TelemetryEngine {
  /**
   * Evalúa si un instante de tiempo cae dentro de una zona de pérdida de señal.
   */
  static isLost(t: number, scenario: ScenarioConfig): boolean {
    const { loss } = scenario;

    // Pérdidas individuales (Escenario NORMAL)
    if (loss.instantesIndividuales) {
      // Usamos una tolerancia por punto flotante (epsilon) para comparar tiempos
      const epsilon = 1e-4;
      if (loss.instantesIndividuales.some((ti) => Math.abs(ti - t) < epsilon)) {
        return true;
      }
    }

    // Pérdida continua (Escenario ESTRÉS)
    if (loss.intervaloContinuo) {
      const [inicio, fin] = loss.intervaloContinuo;
      if (t >= inicio && t <= fin) {
        return true;
      }
    }

    return false;
  }

  /**
   * Genera un registro de medición para un sensor específico.
   */
  static generateMeasurement(
    id: string,
    sensor: SensorType,
    t: number,
    valorReferencia: number,
    scenario: ScenarioConfig,
    rng: () => number
  ): SensorMeasurement {
    const perdido = this.isLost(t, scenario);

    if (perdido) {
      return {
        id,
        sensor,
        t,
        valorReferencia,
        valorObservado: null,
        ruido: 0,
        estadoTransmision: 'perdido' as TransmissionState,
      };
    }

    // Si se transmite, aplicamos ruido (y = y_ref + epsilon)
    const ruido = uniformNoise(rng, scenario.noiseAmplitude);
    const valorObservado = valorReferencia + ruido;

    return {
      id,
      sensor,
      t,
      valorReferencia,
      valorObservado,
      ruido,
      estadoTransmision: 'transmitido' as TransmissionState,
    };
  }
}