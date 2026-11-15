import { supabase } from './supabase';
import { SimulationConfig } from '@/types/simulation';

export async function guardarSimulacion(config: SimulationConfig, nombre: string) {
  try {
    // 1. Buscar Caso de Estudio. Si no existe, lo creamos.
    let { data: casos } = await supabase.from('caso_estudio').select('id').limit(1);
    let casoId = casos?.[0]?.id;

    if (!casoId) {
      const { data: nuevoCaso, error: errorCaso } = await supabase
        .from('caso_estudio')
        .insert({
          nombre: 'Reconstrucción Numérica y Auditoría de Telemetría Dual',
          descripcion: 'Módulo 4: viento y tensión con pérdida de señal.',
          modelo_version: 'v1.0'
        })
        .select('id')
        .single();
        
      if (errorCaso) throw new Error(`Error al crear caso: ${errorCaso.message}`);
      casoId = nuevoCaso.id;
    }

    // 2. Guardar Escenario
    const { data: escenario, error: escError } = await supabase
      .from('escenario')
      .insert({
        caso_id: casoId,
        tipo: config.escenario.tipo,
        parametros_json: config.sensores,
      })
      .select()
      .single();

    if (escError) throw new Error(`Error en escenario: ${escError.message}`);

    // 3. Guardar Simulación
    const { data: simulacion, error: simError } = await supabase
      .from('simulacion')
      .insert({
        escenario_id: escenario.id,
        nombre: nombre,
        duracion: config.duracionSeg,
        frecuencia_muestreo: config.frecuenciaMuestreoHz,
        semilla_aleatoria: config.semilla,
        estado: 'finished',
        fecha_inicio: new Date().toISOString(),
        fecha_finalizacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (simError) throw new Error(`Error en simulación: ${simError.message}`);

    return simulacion.id;
    
  } catch (error: any) {
    console.error("Error detallado de Supabase:", error.message);
    throw error;
  }
}

export async function obtenerHistorial() {
  const { data, error } = await supabase
    .from('simulacion')
    .select(`
      id, nombre, duracion, created_at,
      escenario (tipo)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error al obtener historial de Supabase:', error.message, error.details, error.hint);
    throw error;
  }
  return data;
}