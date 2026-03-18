import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../utils/supabase';
// Importamos iconos para un look más moderno
import {
  AlertCircle,
  Award,
  ChevronRight,
  History,
  LogOut,
  QrCode,
  Shield
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Nueva paleta de colores Light
const COLORS = {
  primary: '#4F46E5', // Azul índigo moderno
  background: '#FFFFFF',
  surface: '#F8FAFC', // Gris muy claro para secciones
  card: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  danger: '#EF4444',
  accent: '#EEF2FF'
};

export default function EmpleadoIndex() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [certificaciones, setCertificaciones] = useState<any[]>([]);
  const [incidenciasCount, setIncidenciasCount] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, certsRes, incRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('certificados').select('*').eq('empleado_id', user.id),
        supabase.from('incidencias').select('*', { count: 'exact', head: true }).eq('empleado_id', user.id)
      ]);

      if (profileRes.data) setUserName(profileRes.data.full_name);
      if (certsRes.data) setCertificaciones(certsRes.data);
      setIncidenciasCount(incRes.count || 0);

    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [loadData, fadeAnim, scaleAnim]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/' as any);
  };

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Header Superior - Estilo Minimalista */}
        <View style={styles.topBar}>
           <Shield color={COLORS.primary} size={24} />
           <Text style={styles.topBarTitle}>ICC SEGURIDAD</Text>
           <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
              <LogOut color={COLORS.textSecondary} size={20} />
           </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <Animated.View style={[styles.hero, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.heroGreeting}>Bienvenido de nuevo,</Text>
          <Text style={styles.heroName}>{userName || 'Cargando...'}</Text>
          <Text style={styles.heroDate}>{today.toUpperCase()}</Text>
        </Animated.View>

        {/* Status Card - Resumen de Incidencias */}
        <TouchableOpacity 
          style={styles.statusCard}
          onPress={() => router.push('../Historial_certificado' as any)}
        >
          <View style={styles.statusInfo}>
            <View style={[styles.statusIconBox, { backgroundColor: incidenciasCount > 0 ? '#FEF2F2' : '#ECFDF5' }]}>
              <AlertCircle color={incidenciasCount > 0 ? COLORS.danger : COLORS.success} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusText}>Estado de Seguridad</Text>
              <Text style={styles.statusSub}>{incidenciasCount} incidencias reportadas</Text>
            </View>
            <ChevronRight color={COLORS.border} size={20} />
          </View>
        </TouchableOpacity>

        {/* Certificaciones Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MIS CERTIFICACIONES</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{certificaciones.length}</Text>
          </View>
        </View>

        <View style={styles.certList}>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ margin: 20 }} />
          ) : certificaciones.length > 0 ? (
            certificaciones.map((c, i) => {
              const vencida = isExpired(c.vigencia_certificacion);
              return (
                <View key={c.id_certificado} style={[styles.certRow, i < certificaciones.length - 1 && styles.certRowBorder]}>
                  <Award color={vencida ? COLORS.danger : COLORS.success} size={20} style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.certName}>{c.nombre_certificacion}</Text>
                    <Text style={styles.certDate}>Expira: {c.vigencia_certificacion}</Text>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: vencida ? '#FEF2F2' : '#ECFDF5' }]}>
                    <Text style={[styles.statusTagText, { color: vencida ? COLORS.danger : COLORS.success }]}>
                      {vencida ? 'VENCIDA' : 'VIGENTE'}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noData}>No hay certificaciones registradas.</Text>
          )}
        </View>

        {/* Accesos Rápidos (Grid) */}
        <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('../QR_generador' as any)}>
            <View style={[styles.gridIcon, { backgroundColor: '#F5F3FF' }]}>
              <QrCode color="#8B5CF6" size={28} />
            </View>
            <Text style={styles.gridLabel}>Mi QR Casco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push('../Historial_certificado' as any)}>
            <View style={[styles.gridIcon, { backgroundColor: '#EFF6FF' }]}>
              <History color="#3B82F6" size={28} />
            </View>
            <Text style={styles.gridLabel}>Ver Historial</Text>
          </TouchableOpacity>
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 24,
    justifyContent: 'space-between'
  },
  topBarTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 1, flex: 1, marginLeft: 10 },
  iconBtn: { padding: 8, backgroundColor: COLORS.surface, borderRadius: 10 },
  
  hero: { paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 },
  heroGreeting: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '500' },
  heroName: { color: COLORS.textPrimary, fontSize: 32, fontWeight: '800', marginTop: 4 },
  heroDate: { color: COLORS.primary, fontSize: 11, marginTop: 10, letterSpacing: 1.5, fontWeight: '700' },
  
  statusCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } as any,
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  statusInfo: { flexDirection: 'row', alignItems: 'center' },
  statusIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  statusText: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' },
  statusSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginTop: 35, marginBottom: 15 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5, paddingHorizontal: 24, marginTop: 35, marginBottom: 15 },
  badge: { backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: -10 },
  badgeText: { color: COLORS.primary, fontWeight: '800', fontSize: 12 },
  
  certList: { 
    backgroundColor: COLORS.card, 
    marginHorizontal: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    overflow: 'hidden'
  },
  certRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  certRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  certName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  certDate: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  statusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusTagText: { fontSize: 10, fontWeight: '800' },
  
  grid: { flexDirection: 'row', paddingHorizontal: 15, gap: 12 },
  gridItem: { 
    flex: 1, 
    backgroundColor: COLORS.card, 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border
  },
  gridIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  gridLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' },
  
  noData: { color: COLORS.textSecondary, textAlign: 'center', padding: 30, fontStyle: 'italic', fontSize: 14 }
});