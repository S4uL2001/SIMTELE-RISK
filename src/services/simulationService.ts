import { supabase } from './supabase';

/**
 * Guarda una simulación completa en la base de datos (Caso -> Escenario -> Simulación)
 */
export async function saveSimulationToDB(
  modulo: string, 
  escenario: string, 
  parametros: any, 
  resultados: any
) {
  try {
    // 1. Buscar o crear el Caso de Estudio
    let { data: casos } = await supabase.from('caso_estudio').select('id').eq('nombre', modulo).limit(1);
    let casoId = casos?.[0]?.id;

    if (!casoId) {
      const { data: nuevoCaso, error: errorCaso } = await supabase
        .from('caso_estudio')
        .insert({ nombre: modulo, descripcion: 'Generado automáticamente', modelo_version: 'v1.0' })
        .select('id').single();
      if (errorCaso) throw errorCaso;
      casoId = nuevoCaso.id;
    }

    // 2. Crear el Escenario
    const { data: esc, error: escError } = await supabase
      .from('escenario')
      .insert({ caso_id: casoId, tipo: escenario, parametros_json: parametros })
      .select().single();
    if (escError) throw escError;

    // 3. Crear la Simulación
    const { error: simError } = await supabase
      .from('simulacion')
      .insert({
        escenario_id: esc.id,
        nombre: `Ejecución ${new Date().toLocaleTimeString()}`,
        duracion: 15,
        frecuencia_muestreo: 10,
        semilla_aleatoria: 42,
        estado: 'terminado',
        fecha_inicio: new Date().toISOString(),
        fecha_finalizacion: new Date().toISOString(),
      });
    
    if (simError) throw simError;
    return true;
  } catch (error) {
    console.error('Error guardando en Supabase:', error);
    return false;
  }
}

/**
 * Obtiene todas las estadísticas para el Dashboard y el Historial.
 * Une las tablas manualmente en JS para evitar fallos de Foreign Keys en Supabase.
 */
export async function getDashboardStats() {
  try {
    // 1. Traer todas las simulaciones (ordenadas por fecha)
    const { data: simulaciones, error: simError } = await supabase
      .from('simulacion')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (simError) {
      console.warn('No se pudo conectar a Supabase (simulaciones):', simError.message);
      return [];
    }

    // 2. Traer todos los escenarios
    const { data: escenarios, error: escError } = await supabase
      .from('escenario')
      .select('*');
    
    if (escError) {
      console.warn('No se pudo conectar a Supabase (escenarios):', escError.message);
      return [];
    }

    // 3. Traer todos los casos de estudio
    const { data: casos, error: casoError } = await supabase
      .from('caso_estudio')
      .select('*');
    
    if (casoError) {
      console.warn('No se pudo conectar a Supabase (casos):', casoError.message);
      return [];
    }

    // 4. Unir los datos en JavaScript
    const resultadosCompletos = simulaciones.map(sim => {
      const esc = escenarios.find(e => e.id === sim.escenario_id);
      const caso = esc ? casos.find(c => c.id === esc.caso_id) : null;
      
      return {
        ...sim,
        escenario: {
          tipo: esc ? esc.tipo : 'NORMAL',
          caso_estudio: { 
            nombre: caso ? caso.nombre : 'Módulo Desconocido' 
          }
        }
      };
    });

    return resultadosCompletos;
  } catch (error) {
    console.error('Error de red obteniendo estadísticas:', error);
    return [];
  }
}