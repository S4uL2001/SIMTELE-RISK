import { describe, expect, it } from 'vitest';
import { TelemetryEngine } from '@/engine/telemetryEngine';
import { ScenarioConfig } from '@/types/simulation';

describe('TelemetryEngine', () => {
  const normalScenario: ScenarioConfig = {
    tipo: 'NORMAL',
    descripcion: 'Test',
    loss: { instantesIndividuales: [4, 8] },
    noiseAmplitude: 0.1,
  };

  const stressScenario: ScenarioConfig = {
    tipo: 'ESTRES',
    descripcion: 'Test',
    loss: { intervaloContinuo: [6, 10] },
    noiseAmplitude: 0.5,
  };

  it('detecta pérdidas individuales en el escenario NORMAL', () => {
    expect(TelemetryEngine.isLost(4, normalScenario)).toBe(true);
    expect(TelemetryEngine.isLost(4.00001, normalScenario)).toBe(true); // Epsilon
    expect(TelemetryEngine.isLost(5, normalScenario)).toBe(false);
  });

  it('detecta pérdida continua en el escenario ESTRÉS', () => {
    expect(TelemetryEngine.isLost(5.9, stressScenario)).toBe(false);
    expect(TelemetryEngine.isLost(6, stressScenario)).toBe(true);
    expect(TelemetryEngine.isLost(8, stressScenario)).toBe(true);
    expect(TelemetryEngine.isLost(10, stressScenario)).toBe(true);
    expect(TelemetryEngine.isLost(10.1, stressScenario)).toBe(false);
  });
});