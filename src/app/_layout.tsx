import { Stack, useRouter, useSegments } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '../utils/supabase';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();

  // 1. Función de redirección memorizada para evitar errores de dependencias en useEffect
  const handleRoleRedirect = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Redirigir según el rol detectado en la base de datos
      if (profile?.role === 'supervisor') {
        router.replace('/Supervisor' as any);
      } else if (profile?.role === 'ingeniero') {
        router.replace('/Ingeniero' as any);
      } else {
        // Si no tiene un rol definido, podrías mandarlo a un dashboard genérico
        router.replace('/Dashboard' as any);
      }
    } catch (err) {
      console.error("Error al obtener rol:", err);
      router.replace('/' as any); // Fallback al login en caso de error
    }
  }, [router]);

  // 2. Manejo de la sesión de Supabase
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setInitializing(false);
    };

    checkSession();

    // Suscribirse a cambios de autenticación (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // 3. Lógica de protección de rutas y redirección automática
  useEffect(() => {
    if (initializing) return;

    // Convertimos segmentos a string[] genérico para evitar error TypeScript 2367
    const allSegments = segments as string[];
    const firstSegment = allSegments[0];

    // Definimos qué carpetas requieren sesión obligatoria
    const privateFolders = ['Supervisor', 'Ingeniero', 'Dashboard', 'Empleado', 'Lector_QR'];
    const isPrivateArea = firstSegment && privateFolders.includes(firstSegment);
    
    // Verificamos si estamos en la raíz (Login)
    const isAtRoot = allSegments.length === 0 || firstSegment === 'index';

    if (!session && isPrivateArea) {
      // Intento de acceso privado sin sesión -> Al Login
      router.replace('/' as any);
    } else if (session && isAtRoot) {
      // Usuario con sesión activa en el Login -> Al Dashboard según su rol
      handleRoleRedirect(session.user.id);
    }
  }, [session, initializing, segments, handleRoleRedirect]);

  // Pantalla de carga inicial (Evita parpadeos de rutas no autorizadas)
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0A1A' }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Definición explícita de rutas principales */}
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="Supervisor/Index" />
      <Stack.Screen name="Ingeniero/Index" />
    </Stack>
  );
}