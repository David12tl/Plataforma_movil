import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={24} color="#5200cc" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contenedor sin imagen, evita errores de rutas */}
        <View style={styles.heroContainer}>
          <View style={styles.heroPlaceholder}>
            <View style={styles.qrIconOverlay}>
              <Ionicons name="qr-code" size={80} color="#5200cc" />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Bienvenido a QR Manager</Text>
          <Text style={styles.subtitle}>
            Gestiona incidencias y certificados de forma rápida y segura mediante códigos QR
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login/login' as any)}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/registro/registro' as any)}
          >
            <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  header: { alignItems: 'flex-end', padding: 20 },
  scrollContent: { paddingBottom: 40 },
  heroContainer: { paddingHorizontal: 24, marginBottom: 30 },
  heroPlaceholder: {
    height: 260,
    borderRadius: 24,
    backgroundColor: '#e6d9ff', // Color morado claro de fondo
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIconOverlay: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#5200cc',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  content: { paddingHorizontal: 30, marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#64748b', lineHeight: 24 },
  buttonContainer: { paddingHorizontal: 24, gap: 16 },
  primaryButton: { backgroundColor: '#5200cc', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { backgroundColor: 'rgba(82, 0, 204, 0.05)', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(82, 0, 204, 0.2)' },
  secondaryButtonText: { color: '#5200cc', fontWeight: 'bold', fontSize: 16 },
});