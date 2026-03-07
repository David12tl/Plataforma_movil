import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importación necesaria
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter(); // Inicialización del router

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={24} color="#5200cc" />
      </View>

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <View style={styles.heroImage}>
          <View style={styles.overlay} />
          <View style={styles.iconWrapper}>
            <Ionicons name="qr-code-outline" size={64} color="#5200cc" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido a QR Manager</Text>
        <Text style={styles.subtitle}>
          Gestiona incidencias y certificados de forma rápida y segura mediante códigos QR
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
         // En tu botón
          onPress={() => router.push('/Dashboard/page')}
        >
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.versionText}>V2.4.0 PROFESSIONAL EDITION</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  header: { alignItems: 'flex-end', padding: 20 },
  heroContainer: { paddingHorizontal: 24, marginVertical: 20 },
  heroImage: { height: 280, borderRadius: 16, backgroundColor: '#e6d9ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(82, 0, 204, 0.1)' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(82, 0, 204, 0.2)' },
  iconWrapper: { backgroundColor: 'white', padding: 20, borderRadius: 50 },
  content: { paddingHorizontal: 24, marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#1a1a1a', marginBottom: 16 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', lineHeight: 24 },
  buttonContainer: { paddingHorizontal: 24, gap: 12, marginTop: 20 },
  primaryButton: { backgroundColor: '#5200cc', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: 'rgba(82, 0, 204, 0.1)', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { color: '#5200cc', fontWeight: 'bold', fontSize: 16 },
  footer: { paddingVertical: 30, alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(82, 0, 204, 0.3)' },
  activeDot: { width: 24, backgroundColor: '#5200cc' },
  versionText: { fontSize: 10, color: '#999', letterSpacing: 1, fontWeight: '600' }
});