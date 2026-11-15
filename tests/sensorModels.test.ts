import { describe, expect, it } from 'vitest';
import { tensionCable, velocidadViento } from '@/engine/sensorModels';
import { defaultSensorConfig } from '@/types/sensor';

const cfg = defaultSensorConfig();

describe('velocidadViento · v(t)=12+6sin(0.8t)', () => {
  it('reproduce los valores del documento de la Semana 1', () => {
    expect(velocidadViento(1, cfg.anemometro)).toBeCloseTo(16.3041, 3);
    expect(velocidadViento(2, cfg.anemometro)).toBeCloseTo(17.9974, 3);
    expect(velocidadViento(3, cfg.anemometro)).toBeCloseTo(16.0528, 3);
    expect(velocidadViento(5, cfg.anemometro)).toBeCloseTo(7.4592, 3);
  });

  it('v(0) = velocidad media', () => {
    expect(velocidadViento(0, cfg.anemometro)).toBeCloseTo(12, 10);
  });
});

describe('tensionCable · T(t)=450+15sin(0.8t-0.5)+20e^{-0.2t}', () => {
  it('T(0) = 450 + 15sin(-0.5) + 20', () => {
    const esperado = 450 + 15 * Math.sin(-0.5) + 20;
    expect(tensionCable(0, cfg.celulaCarga)).toBeCloseTo(esperado, 8);
  });

  it('tiende a la componente oscilatoria cuando t→∞', () => {
    const tGrande = 200;
    const valor = tensionCable(tGrande, cfg.celulaCarga);
    const sinExponencial = 450 + 15 * Math.sin(0.8 * tGrande - 0.5);
    expect(Math.abs(valor - sinExponencial)).toBeLessThan(1e-6);
  });
});