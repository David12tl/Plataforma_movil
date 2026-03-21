import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { supabase } from '../../utils/supabase';

export default function IngenieroIndex() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [blink, setBlink] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Estados para métricas de planta (Proyecto ICC)
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    certsVencidas: 0,
    incidenciasHoy: 0
  });

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => setBlink(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if (profile) setUserName(profile.full_name);
      }

      // Consultas reales según el Schema del proyecto
      const { count: empCount } = await supabase.from('empleado').select('*', { count: 'exact', head: true });
      
      // Simulación/Consulta de certificaciones vencidas (Lógica de negocio ICC)
      const today = new Date().toISOString().split('T')[0];
      const { count: expiredCount } = await supabase
        .from('certificados')
        .select('*', { count: 'exact', head: true })
        .lt('vigencia_certificacion', today);

      setStats({
        totalEmpleados: empCount || 0,
        certsVencidas: expiredCount || 0,
        incidenciasHoy: 0 // Aquí podrías filtrar incidencias por la fecha de hoy
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/login' as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F0A1A' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>

        {/* Terminal de Acceso Industrial */}
        <View style={styles.terminal}>
          <View style={styles.terminalTop}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.dot, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.terminalTitle}>ICC_ENGINEER_CORE_v1.0</Text>
          </View>
          
          <View style={styles.terminalBody}>
            <Text style={styles.termLine}>
              <Text style={styles.tPurple}>auth_session</Text>
              <Text style={styles.tWhite}>:</Text>
              <Text style={styles.tBlue}>~/ingenieria</Text>
              <Text style={styles.tWhite}>$ check_user</Text>
            </Text>
            <Text style={styles.termOutput}>{userName.toUpperCase() || 'INGENIERO_PLANTA'}</Text>
            <Text style={styles.termLine}>
              <Text style={styles.tPurple}>status</Text>
              <Text style={styles.tWhite}>:~/planta$ </Text>
              <Text style={blink ? styles.cursor : styles.cursorHidden}>█</Text>
            </Text>
          </View>
        </View>

        {/* Monitor de Cumplimiento (Basado en el Schema) */}
        <View style={styles.statusBar}>
          <View style={styles.statItem}>
            <Text style={styles.statusLabel}>PERSONAL</Text>
            <Text style={styles.statusValue}>{stats.totalEmpleados}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statusLabel, { color: '#EF4444' }]}>VENCIDOS</Text>
            <Text style={[styles.statusValue, { color: '#EF4444' }]}>{stats.certsVencidas}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statusLabel}>ESTADO</Text>
            <Text style={[styles.statusValue, { color: '#22C55E' }]}>ONLINE</Text>
          </View>
        </View>

        {/* Acciones Críticas del Ingeniero (Punto 5.2 y 5.3 del Proyecto) */}
        <Text style={styles.sectionTitle}>{`// PROTOCOLOS_DE_VERIFICACIÓN`}</Text>
        
        <TouchableOpacity 
          style={styles.actionCardPrimary} 
          activeOpacity={0.8}
          onPress={() => router.push('../Lector_QR' as any)}
        >
          <Text style={styles.actionIcon}>📸</Text>
          <View>
            <Text style={styles.actionTitle}>ESCANEAR CÓDIGO QR</Text>
            <Text style={styles.actionDesc}>Validar certificaciones y registrar incidencias</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cmdGrid}>
          <TouchableOpacity 
            style={styles.cmdBtn} 
            onPress={() => router.push('#' as any)}
          >
            <Text style={styles.cmdText}>{`> lista_personal`}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cmdBtn}
            onPress={() => router.push('../Registro_incidencia' as any)}
          >
            <Text style={styles.cmdText}>{`> ver_incidencias`}</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Estilo Terminal */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>$ terminate_session --user={userName.split(' ')[0].toLowerCase()}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  terminal: {
    backgroundColor: '#1E152E',
    margin: 16,
    marginTop: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B2D52',
    overflow: 'hidden',
  },
  terminalTop: {
    backgroundColor: '#2D2142',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 6,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  terminalTitle: { color: '#94A3B8', fontSize: 10, marginLeft: 10, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  terminalBody: { padding: 16 },
  termLine: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 22 },
  tPurple: { color: '#A855F7', fontWeight: 'bold' },
  tBlue: { color: '#6366F1' },
  tWhite: { color: '#FFFFFF' },
  termOutput: { color: '#FFFFFF', fontSize: 18, marginVertical: 4, fontWeight: '900', letterSpacing: 1 },
  cursor: { color: '#A855F7' },
  cursorHidden: { color: 'transparent' },

  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    backgroundColor: '#1E152E',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#A855F733',
  },
  statItem: { alignItems: 'center' },
  statusLabel: { color: '#94A3B8', fontSize: 9, fontWeight: '800', marginBottom: 4, letterSpacing: 1 },
  statusValue: { color: '#A855F7', fontSize: 16, fontWeight: '900', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },

  sectionTitle: { color: '#A855F7', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 12, paddingHorizontal: 20, marginTop: 35, marginBottom: 15, fontWeight: '800' },

  actionCardPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A855F7',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 20,
    gap: 15,
    marginBottom: 15
  },
  actionIcon: { fontSize: 30 },
  actionTitle: { color: '#0F0A1A', fontSize: 18, fontWeight: '900' },
  actionDesc: { color: '#0F0A1A', fontSize: 11, fontWeight: '600', opacity: 0.8 },

  cmdGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  cmdBtn: { 
    flex: 1,
    backgroundColor: '#1E152E', 
    borderWidth: 1, 
    borderColor: '#3B2D52', 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center'
  },
  cmdText: { color: '#A855F7', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 12, fontWeight: '700' },

  logoutBtn: { 
    marginHorizontal: 16, 
    marginTop: 40, 
    borderWidth: 1, 
    borderColor: '#EF444433', 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center',
    backgroundColor: '#1E152E'
  },
  logoutText: { color: '#EF4444', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 11, fontWeight: '700' },
});