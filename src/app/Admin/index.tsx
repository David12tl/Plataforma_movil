import { useRouter } from 'expo-router';
import {
  AlertTriangle,
  ChevronRight,
  FileCheck,
  History,
  LogOut,
  QrCode,
  ScanLine,
  ShieldCheck,
  Users
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../utils/supabase';

const { width } = Dimensions.get('window');

export default function AdminIndex() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'EMPLEADOS', value: '0', color: '#4F46E5' },
    { label: 'INCIDENCIAS', value: '0', color: '#EF4444' },
    { label: 'CERTIFICADOS', value: '0', color: '#10B981' },
    { label: 'ROLES', value: '0', color: '#F59E0B' },
  ]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile) setUserName(profile.full_name);
      }

      const [emp, inc, cert, roles] = await Promise.all([
        supabase.from('empleado').select('*', { count: 'exact', head: true }),
        supabase.from('incidencias').select('*', { count: 'exact', head: true }),
        supabase.from('certificados').select('*', { count: 'exact', head: true }),
        supabase.from('roles').select('*', { count: 'exact', head: true }),
      ]);

      setStats(prev => [
        { ...prev[0], value: String(emp.count || 0) },
        { ...prev[1], value: String(inc.count || 0) },
        { ...prev[2], value: String(cert.count || 0) },
        { ...prev[3], value: String(roles.count || 0) },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim, loadDashboardData]);

  const modules = [
    { id: 1, icon: <Users color="#4F46E5" size={24} />, title: 'Gestión de Empleados', desc: 'Matrículas y perfiles', route: '/Empleado', tint: '#EEF2FF' },
    { id: 2, icon: <AlertTriangle color="#EF4444" size={24} />, title: 'Incidencias', desc: 'Seguridad en sitio', route: '/Registro_incidencia', tint: '#FEF2F2' },
    { id: 3, icon: <FileCheck color="#10B981" size={24} />, title: 'Certificaciones', desc: 'Vigencias y emisores', route: '/Registro_certificados', tint: '#ECFDF5' },
    { id: 4, icon: <History color="#3B82F6" size={24} />, title: 'Hist. Certificados', desc: 'Consulta previa', route: '/Historial_certificado', tint: '#EFF6FF' },
    { id: 5, icon: <ShieldCheck color="#F59E0B" size={24} />, title: 'Hist. Incidencias', desc: 'Bitácora de eventos', route: '/Historial_incidencia', tint: '#FFFBEB' },
    { id: 6, icon: <ScanLine color="#8B5CF6" size={24} />, title: 'Lector QR', desc: 'Escaneo de personal', route: '/Lector_QR', tint: '#F5F3FF' },
    { id: 7, icon: <QrCode color="#6366F1" size={24} />, title: 'Generador QR', desc: 'Identificaciones', route: '/QR_generador', tint: '#EEF2FF' },
  ];

  return (
    <View style={styles.mainContainer}>
      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Elegante */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerWelcome}>Panel Administrativo</Text>
            <Text style={styles.headerUser}>{userName || 'Administrador'}</Text>
          </View>
          <TouchableOpacity style={styles.minimalLogout} onPress={() => supabase.auth.signOut()}>
            <LogOut color="#64748B" size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats en Blanco */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{loading ? '...' : s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>MÓDULOS DEL SISTEMA</Text>
        
        <View style={styles.modulesWrapper}>
          {modules.map((m) => (
            <TouchableOpacity 
              key={m.id} 
              style={styles.moduleCard} 
              onPress={() => router.push(m.route as any)}
            >
              <View style={[styles.moduleIconContainer, { backgroundColor: m.tint }]}>
                {m.icon}
              </View>
              <View style={styles.moduleText}>
                <Text style={styles.moduleTitle}>{m.title}</Text>
                <Text style={styles.moduleDesc}>{m.desc}</Text>
              </View>
              <ChevronRight color="#CBD5E1" size={20} />
            </TouchableOpacity>
          ))}
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingTop: 50, 
    paddingBottom: 25 
  },
  headerWelcome: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  headerUser: { color: '#1E293B', fontSize: 28, fontWeight: '800' },
  minimalLogout: { padding: 10, backgroundColor: '#F1F5F9', borderRadius: 12 },
  
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 16, 
    gap: 12,
    justifyContent: 'center' 
  },
  statCard: {
    width: Platform.OS === 'web' ? '22%' : (width - 44) / 2,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    // Sombra suave para que resalte sobre el fondo blanco
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } as any,
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 2 }
    })
  },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: '#94A3B8', fontSize: 10, letterSpacing: 1, marginTop: 4, fontWeight: '700' },
  
  sectionTitle: { color: '#1E293B', fontSize: 13, letterSpacing: 1.5, paddingHorizontal: 24, marginTop: 35, marginBottom: 15, fontWeight: '800' },
  
  modulesWrapper: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: Platform.OS === 'web' ? '31%' : '100%',
    minWidth: Platform.OS === 'web' ? 300 : '100%',
    ...Platform.select({ web: { transition: '0.2s transform' } as any })
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleText: { flex: 1 },
  moduleTitle: { color: '#1E293B', fontSize: 15, fontWeight: '700' },
  moduleDesc: { color: '#64748B', fontSize: 13, marginTop: 2 },
});