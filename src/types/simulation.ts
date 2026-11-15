import type { SensorConfig, SensorMeasurement, SensorType } from './sensor';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'finished';
export type ScenarioType = 'NORMAL' | 'ESTRES' | 'MAL_CONDICIONADO';

export interface LossSpec {
  /** Instantes individuales a perder (escenario NORMAL: [4, 8]). */
  instantesIndividuales?: number[];
  /** Intervalo continuo [desde, hasta] a perder (escenario ESTRÉS: [6, 10]). */
  intervaloContinuo?: [number, number];
}

export interface ScenarioConfig {
  tipo: ScenarioType;
  descripcion: string;
  loss: LossSpec;
  /** Amplitud del ruido uniforme en [-noiseAmplitude, +noiseAmplitude] * escala. */
  noiseAmplitude: number;
}

export interface SimulationConfig {
  duracionSeg: number;
  frecuenciaMuestreoHz: number;
  playbackRate: number;
  semilla: number;
  escenario: ScenarioConfig;
  sensores: SensorConfig;
}

/** Buffer de muestras por sensor, ordenadas por t ascendente. */
export interface SimulationSnapshot {
  config: SimulationConfig;
  /** Reloj de simulación (s). */
  tiempoActual: number;
  status: SimulationStatus;
  medidas: Record<SensorType, SensorMeasurement[]>;
}