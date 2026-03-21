import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';

import { supabase } from '../../utils/supabase';


const ROLE_ROUTES = {
  '1': '/Admin',
  '2': '/Ingeniero',
  '3': '/Supervisor',
  '4': '/Empleado',
} as const;

type RoleKey = keyof typeof ROLE_ROUTES;

const ROLE_LABELS: Record<RoleKey, string> = {
  '1': 'Administrador',
  '2': 'Ingeniero',
  '3': 'Supervisor',
  '4': 'Empleado',
};

export default function DashboardIndex() {
  const router = useRouter();
  const [status, setStatus] = useState('Verificando sesión...');

  // Refs para animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0.3)).current;
  const dotAnim2 = useRef(new Animated.Value(0.3)).current;
  const dotAnim3 = useRef(new Animated.Value(0.3)).current;

  const fetchAndRedirect = useCallback(async () => {
    try {
      // 1. Obtener usuario actual
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace('/auth/login' as any);
        return;
      }

      setStatus('Cargando perfil...');

      // 2. Obtener el rol de la tabla profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id_rol')
        .eq('id', user.id);

      if (error || !data || data.length === 0) {
        console.error('Sin perfil en la tabla profiles:', error?.message);
        router.replace('/auth/login' as any);
        return;
      }

      // Convertimos a string por si el ID viene como número desde la DB
      const role = String(data[0].id_rol) as RoleKey;
      const label = ROLE_LABELS[role];

      setStatus(`Bienvenido${label ? ` · ${label}` : ''}...`);

      // Pequeña pausa estética para mostrar la animación
      await new Promise(r => setTimeout(r, 800));

      const route = ROLE_ROUTES[role];
      
      if (route) {
        // ✅ CORRECCIÓN CLAVE: Usamos "as any" para evitar el error de tipos de Expo Router
        router.replace(route as any); 
      } else {
        console.warn(`Rol detectado (${role}) no tiene ruta asignada.`);
        router.replace('/auth/login' as any);
      }
    } catch (err) {
      console.error('Error crítico en Dashboard:', err);
      router.replace('/auth/login' as any);
    }
  }, [router]);

  useEffect(() => {
    // Iniciar animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 7, useNativeDriver: true }),
    ]).start();

    // Spinner infinito
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animación de puntos suspensivos
    const pulseDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ])
      ).start();

    pulseDot(dotAnim1, 0);
    pulseDot(dotAnim2, 200);
    pulseDot(dotAnim3, 400);

    fetchAndRedirect();
  }, [fetchAndRedirect, fadeAnim, scaleAnim, spinAnim, dotAnim1, dotAnim2, dotAnim3]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.spinnerWrap}>
          <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />
          <View style={styles.spinnerCenter} />
        </View>

        <Text style={styles.statusText}>{status}</Text>

        <View style={styles.dotsRow}>
          {[dotAnim1, dotAnim2, dotAnim3].map((a, i) => (
            <Animated.View key={i} style={[styles.dot, { opacity: a }]} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d', // Fondo oscuro elegante
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  spinnerWrap: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  spinnerRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#5200cc', // Color principal morado
    borderRightColor: '#5200cc44',
  },
  spinnerCenter: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ffffff11' },
  statusText: { 
    color: '#e2e8f0', 
    fontSize: 16, 
    fontWeight: '500',
    letterSpacing: 1, 
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' 
  },
  dotsRow: { flexDirection: 'row', gap: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#5200cc' },
});