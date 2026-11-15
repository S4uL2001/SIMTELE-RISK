-- =====================================================================
-- SIMTELE-RISK · Modulo 4 · Esquema inicial
-- =====================================================================

create extension if not exists "pgcrypto";

-- Caso de estudio (Módulo 4 en este proyecto)
create table if not exists caso_estudio (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  modelo_version text not null,
  created_at timestamptz not null default now()
);

-- Escenario: NORMAL / ESTRES / MAL_CONDICIONADO
create table if not exists escenario (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid not null references caso_estudio(id) on delete cascade,
  tipo text not null check (tipo in ('NORMAL','ESTRES','MAL_CONDICIONADO')),
  parametros_json jsonb not null,
  fuente_datos text not null default 'sintetico',
  created_at timestamptz not null default now()
);

-- Simulación: una ejecución concreta
create table if not exists simulacion (
  id uuid primary key default gen_random_uuid(),
  escenario_id uuid not null references escenario(id) on delete cascade,
  nombre text not null,
  duracion numeric not null check (duracion > 0),
  frecuencia_muestreo numeric not null check (frecuencia_muestreo > 0),
  semilla_aleatoria bigint not null,
  estado text not null check (estado in ('idle','running','paused','finished')),
  fecha_inicio timestamptz,
  fecha_finalizacion timestamptz,
  created_at timestamptz not null default now()
);

-- Medición por sensor (batch insert)
create table if not exists medicion_sensor (
  id bigserial primary key,
  simulacion_id uuid not null references simulacion(id) on delete cascade,
  sensor_tipo text not null check (sensor_tipo in ('anemometro','celula_carga')),
  tiempo numeric not null,
  valor_referencia numeric not null,
  valor_observado numeric,             -- NULL si se perdió
  valor_reconstruido numeric,          -- NULL si no aplica / aún no calculado
  estado_transmision text not null check (estado_transmision in ('transmitido','perdido')),
  ruido_aplicado numeric not null default 0
);
create index if not exists idx_medicion_sim_sensor_t
  on medicion_sensor (simulacion_id, sensor_tipo, tiempo);

-- Ejecución de un método numérico
create table if not exists ejecucion_metodo (
  id uuid primary key default gen_random_uuid(),
  simulacion_id uuid not null references simulacion(id) on delete cascade,
  metodo text not null,
  sensor_tipo text not null check (sensor_tipo in ('anemometro','celula_carga')),
  tolerancia numeric,
  convergio boolean,
  tiempo_ejecucion_ms integer,
  parametros_json jsonb,
  created_at timestamptz not null default now()
);

-- Iteraciones de un método de raíces
create table if not exists iteracion_resultado (
  id bigserial primary key,
  ejecucion_id uuid not null references ejecucion_metodo(id) on delete cascade,
  numero_iteracion integer not null,
  aproximacion numeric not null,
  residual numeric not null,
  error_absoluto numeric,
  error_relativo numeric
);
create index if not exists idx_iteracion_ejecucion
  on iteracion_resultado (ejecucion_id, numero_iteracion);

-- Resumen de resultados por sensor
create table if not exists resultado_resumen (
  id uuid primary key default gen_random_uuid(),
  simulacion_id uuid not null references simulacion(id) on delete cascade,
  sensor_tipo text not null check (sensor_tipo in ('anemometro','celula_carga')),
  valor_maximo numeric,
  valor_minimo numeric,
  instante_critico numeric,
  error_promedio numeric,
  error_maximo numeric,
  interpretacion text
);

-- Interpretaciones dobles (matemática + física)
create table if not exists interpretacion (
  id uuid primary key default gen_random_uuid(),
  simulacion_id uuid not null references simulacion(id) on delete cascade,
  conclusion_numerica text not null,
  conclusion_fisica text not null,
  observaciones text
);

-- =====================================================================
-- RLS: acceso público de lectura/escritura para demo educativa.
-- En producción real: restringir por auth.uid().
-- =====================================================================
alter table caso_estudio        enable row level security;
alter table escenario           enable row level security;
alter table simulacion          enable row level security;
alter table medicion_sensor     enable row level security;
alter table ejecucion_metodo    enable row level security;
alter table iteracion_resultado enable row level security;
alter table resultado_resumen   enable row level security;
alter table interpretacion      enable row level security;

do $$
declare t text;
begin
  foreach t in array array[
    'caso_estudio','escenario','simulacion','medicion_sensor',
    'ejecucion_metodo','iteracion_resultado','resultado_resumen','interpretacion'
  ] loop
    execute format(
      'create policy "anon_all_%1$s" on %1$s for all to anon using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- Semilla del caso de estudio (Módulo 4)
insert into caso_estudio (nombre, descripcion, modelo_version)
values (
  'Reconstrucción Numérica y Auditoría de Telemetría Dual',
  'Módulo 4: viento (anemómetro) y tensión (célula de carga) con pérdida de señal.',
  'v1.0'
);