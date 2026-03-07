import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../../navigation/BottomNav'; // Importación del componente reutilizable

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>Juan Pérez</Text>
          <Text style={styles.userId}>ID: 45829 • Gestor</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={24} color="#334155" />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="alert-circle-outline" size={16} color="#5200cc" />
              <Text style={styles.statLabel}>Incidencias Activas</Text>
            </View>
            <Text style={styles.statValue}>12</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#5200cc" />
              <Text style={styles.statLabel}>Certificados Validados</Text>
            </View>
            <Text style={styles.statValue}>84</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity style={styles.primaryAction}>
          <Ionicons name="qr-code-outline" size={24} color="white" />
          <Text style={styles.primaryActionText}>Escaneador QR</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secAction}><Text style={styles.secActionText}>Nueva Incidencia</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secAction}><Text style={styles.secActionText}>Nuevo Certificado</Text></TouchableOpacity>
        </View>
      </ScrollView>

      {/* Menú de Navegación Reutilizable */}
      <BottomNav /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd' },
  headerInfo: { flex: 1, marginLeft: 12 },
  userName: { fontWeight: 'bold', color: '#0f172a' },
  userId: { fontSize: 12, color: '#5200cc' },
  notifButton: { padding: 8 },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: 'white', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(82,0,204,0.1)' },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#64748b', marginLeft: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  primaryAction: { flexDirection: 'row', backgroundColor: '#5200cc', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  primaryActionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  secAction: { flex: 1, backgroundColor: '#e6d9ff', padding: 16, borderRadius: 12, alignItems: 'center' },
  secActionText: { color: '#5200cc', fontWeight: '600' }
});