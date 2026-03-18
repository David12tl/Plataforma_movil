import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

const COLORS = {
  accent: '#A855F7',
  bg: '#0F0A1A',
  card: '#1E152E',
  text: '#FFFFFF',
  subtext: '#94A3B8',
  danger: '#EF4444',
  success: '#22C55E'
};

export default function SupervisorIndex() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [stats, setStats] = useState({
    totalPersonal: 0,
    incidenciasSemana: 0,
    vencimientosCriticos: 0
  });

  const loadSupervisorStats = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile) setUserName(profile.full_name);
      }

      const { count: empCount } = await supabase.from('empleado').select('*', { count: 'exact', head: true });
      const { count: incCount } = await supabase.from('incidencias').select('*', { count: 'exact', head: true });
      
      const today = new Date().toISOString().split('T')[0];
      const { count: expiredCount } = await supabase
        .from('certificados')
        .select('*', { count: 'exact', head: true })
        .lt('vigencia_certificacion', today);

      setStats({
        totalPersonal: empCount || 0,
        incidenciasSemana: incCount || 0,
        vencimientosCriticos: expiredCount || 0
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupervisorStats();
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [loadSupervisorStats]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login' as any);
  };

  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView 
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandText}>ICC SEGURIDAD</Text>
            <Text style={styles.welcomeText}>Hola, {userName.split(' ')[0] || 'Supervisor'}</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>PLANTA ACTIVA</Text>
          </View>
        </View>

        {/* Dashboard Grid */}
        <View style={styles.dashboardGrid}>
          <View style={styles.mainKpi}>
            <Text style={styles.kpiValue}>{stats.totalPersonal}</Text>
            <Text style={styles.kpiLabel}>PERSONAL TOTAL</Text>
          </View>
          <View style={styles.sideKpis}>
            <View style={[styles.smallCard, styles.borderDanger]}>
              <Text style={[styles.smallCardValue, styles.textDanger]}>{stats.vencimientosCriticos}</Text>
              <Text style={styles.smallCardLabel}>VENCIDOS</Text>
            </View>
            <View style={styles.smallCard}>
              <Text style={styles.smallCardValue}>{stats.incidenciasSemana}</Text>
              <Text style={styles.smallCardLabel}>INCIDENCIAS</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>AUDITORÍA Y SEGUIMIENTO</Text>
        
        {/* Menú de Opciones */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('#' as any)}>
            <View style={[styles.iconBox, { backgroundColor: '#3B2D52' }]}><Text style={styles.iconText}>👥</Text></View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Control de Personal</Text>
              <Text style={styles.menuSub}>Validación de certificados</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('../Historial_incidencia' as any)}>
            <View style={[styles.iconBox, { backgroundColor: '#EF444422' }]}><Text style={styles.iconText}>⚠️</Text></View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Historial de Incidencias</Text>
              <Text style={styles.menuSub}>Consulta histórica</Text>
            </View>
            <Text style={styles.arrow}>❯</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('../Lector_QR' as any)}>
          <Text style={styles.scanBtnText}>AUDITORÍA QR RÁPIDA</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutContainer}>
          <Text style={styles.logoutText}>CERRAR SESIÓN SEGURA</Text>
        </TouchableOpacity>

      </Animated.ScrollView>
    </View>
  );
}

// Estilos tipados para evitar errores de TS
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg } as ViewStyle,
  scrollContent: { padding: 20, paddingBottom: 40 } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 25
  } as ViewStyle,
  brandText: { color: COLORS.accent, fontWeight: '800', fontSize: 12, letterSpacing: 2 } as TextStyle,
  welcomeText: { color: COLORS.text, fontSize: 24, fontWeight: '900' } as TextStyle,
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.card, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent + '33'
  } as ViewStyle,
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success, marginRight: 6 } as ViewStyle,
  onlineText: { color: COLORS.success, fontSize: 10, fontWeight: 'bold' } as TextStyle,
  dashboardGrid: { flexDirection: 'row', gap: 12, marginBottom: 30 } as ViewStyle,
  mainKpi: { 
    flex: 1.2, 
    backgroundColor: COLORS.accent, 
    borderRadius: 24, 
    padding: 20, 
    justifyContent: 'center' 
  } as ViewStyle,
  kpiValue: { color: COLORS.bg, fontSize: 42, fontWeight: '900' } as TextStyle,
  kpiLabel: { color: COLORS.bg, fontSize: 10, fontWeight: '800', marginTop: 5 } as TextStyle,
  sideKpis: { flex: 1, gap: 12 } as ViewStyle,
  smallCard: { 
    flex: 1, 
    backgroundColor: COLORS.card, 
    borderRadius: 20, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: COLORS.accent + '22' 
  } as ViewStyle,
  borderDanger: { borderColor: COLORS.danger } as ViewStyle,
  smallCardValue: { color: COLORS.text, fontSize: 20, fontWeight: '900' } as TextStyle,
  textDanger: { color: COLORS.danger } as TextStyle,
  smallCardLabel: { color: COLORS.subtext, fontSize: 9, fontWeight: '700', marginTop: 2 } as TextStyle,
  sectionTitle: { color: COLORS.subtext, fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 15, marginTop: 10 } as TextStyle,
  menuContainer: { gap: 12 } as ViewStyle,
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent + '11'
  } as ViewStyle,
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' } as ViewStyle,
  iconText: { fontSize: 20 } as TextStyle,
  menuInfo: { flex: 1, marginLeft: 15 } as ViewStyle,
  menuTitle: { color: COLORS.text, fontSize: 15, fontWeight: '700' } as TextStyle,
  menuSub: { color: COLORS.subtext, fontSize: 12, marginTop: 2 } as TextStyle,
  arrow: { color: COLORS.accent, fontSize: 14, fontWeight: 'bold' } as TextStyle,
  scanBtn: {
    backgroundColor: COLORS.card,
    marginTop: 25,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent
  } as ViewStyle,
  scanBtnText: { color: COLORS.accent, fontWeight: '900', letterSpacing: 1 } as TextStyle,
  logoutContainer: { marginTop: 30, alignItems: 'center' } as ViewStyle,
  logoutText: { color: COLORS.danger, fontSize: 12, fontWeight: '700', opacity: 0.7 } as TextStyle,
});