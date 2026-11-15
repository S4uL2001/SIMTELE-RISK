export type SensorType = 'anemometro' | 'celula_carga';

export type TransmissionState = 'transmitido' | 'perdido';

/** Registro unificado por muestra y por sensor. */
export interface SensorMeasurement {
  id: string;
  sensor: SensorType;
  /** Tiempo físico de simulación en segundos. */
  t: number;
  /** Verdad analítica. Nunca se usa como entrada de interpolación. */
  valorReferencia: number;
  /** Observación del sensor (referencia + ruido). null si se perdió. */
  valorObservado: number | null;
  /** Ruido ε(t) aplicado (0 si no hubo medición). */
  ruido: number;
  estadoTransmision: TransmissionState;
}

/** Parámetros del anemómetro: v(t) = vMedia + amp * sin(w * t). */
export interface AnemometroParams {
  vMedia: number; // m/s
  amplitud: number; // m/s
  frecuenciaAngular: number; // rad/s
  umbral: number; // m/s
}

/** Parámetros de la célula de carga:
 *  T(t) = TMedia + ampSin * sin(w t - fase) + ampExp * e^(-lambda t). */
export interface CelulaCargaParams {
  tMedia: number; // kN
  amplitudSeno: number; // kN
  frecuenciaAngular: number; // rad/s
  desfase: number; // rad
  amplitudExponencial: number; // kN
  amortiguamiento: number; // 1/s
  umbral: number; // kN
}

export interface SensorConfig {
  anemometro: AnemometroParams;
  celulaCarga: CelulaCargaParams;
}

export const SENSOR_LABELS: Record<SensorType, string> = {
  anemometro: 'Anemómetro ultrasónico',
  celula_carga: 'Célula de carga',
};

export const SENSOR_UNITS: Record<SensorType, string> = {
  anemometro: 'm/s',
  celula_carga: 'kN',
};

export function defaultSensorConfig(): SensorConfig {
  return {
    anemometro: { vMedia: 12, amplitud: 6, frecuenciaAngular: 0.8, umbral: 17 },
    celulaCarga: {
      tMedia: 450,
      amplitudSeno: 15,
      frecuenciaAngular: 0.8,
      desfase: 0.5,
      amplitudExponencial: 20,
      amortiguamiento: 0.2,
      umbral: 462,
    },
  };
}