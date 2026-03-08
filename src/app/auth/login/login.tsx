import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header con Logo */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Ionicons name="qr-code" size={24} color="white" />
          </View>
          <Text style={styles.headerTitle}>QR Manager</Text>
          <View style={{ width: 40 }} /> {/* Espaciador para centrar el título */}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Visual (Placeholder de imagen abstracta) */}
          <View style={styles.heroWrapper}>
            <View style={styles.heroPlaceholder}>
               <Ionicons name="key-outline" size={60} color="#5200cc" style={{ opacity: 0.4 }} />
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            <Text style={styles.subtitle}>Gestiona tus códigos QR de forma rápida y sencilla.</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="mail-outline" size={20} color="#5200cc" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="lock-closed-outline" size={20} color="#5200cc" />
                </View>
                <TextInput
                  style={[styles.input, { borderRightWidth: 0, borderLeftWidth: 0, flex: 1 }]}
                  placeholder="********"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.loginButton} 
              activeOpacity={0.8}
              onPress={() => router.push('../../Dashboard/page' as any)}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
              <Ionicons name="log-in-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>

          {/* Registration Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/registro/registro' as any)}>
            </TouchableOpacity>
            <TouchableOpacity >
              <Text style={styles.registerLink}>Regístrate gratis</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Decoración Inferior */}
      <View style={styles.bottomBar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#5200cc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  heroWrapper: { marginTop: 30, marginBottom: 40 },
  heroPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: 'rgba(82, 0, 204, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: { marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  form: { gap: 20 },
  inputGroup: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  iconBox: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(82, 0, 204, 0.1)',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  eyeButton: {
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -10 },
  forgotText: { color: '#5200cc', fontSize: 14, fontWeight: '500' },
  loginButton: {
    backgroundColor: '#5200cc',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    shadowColor: '#5200cc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  footerText: { fontSize: 14, color: '#64748b' },
  registerLink: { fontSize: 14, fontWeight: 'bold', color: '#5200cc' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    height: 4,
    width: '100%',
    backgroundColor: '#5200cc',
    opacity: 0.1,
  }
});