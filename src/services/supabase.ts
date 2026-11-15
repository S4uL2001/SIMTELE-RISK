import { createClient } from '@supabase/supabase-js';

// 1. Tipamos estrictamente como string para que TS no se queje
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// 2. Validación para avisar en consola si falta el .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Faltan las credenciales de Supabase en el archivo .env');
}

// 3. Advertencia si la anon key no tiene formato JWT esperado
if (supabaseAnonKey && !supabaseAnonKey.startsWith('eyJ')) {
  console.warn(
    '⚠️ La VITE_SUPABASE_ANON_KEY no parece un token JWT válido (debería empezar con "eyJ...").\n' +
    '   Ve a tu Dashboard de Supabase → Settings → API → Project API keys y copia la clave "anon" completa.'
  );
}

// 4. Inicializamos con placeholders para evitar que la app explote si faltan
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
