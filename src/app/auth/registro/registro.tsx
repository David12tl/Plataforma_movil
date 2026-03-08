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
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Manager</Text>
          <View style={{ width: 48 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <h1 style={styles.title}>Crear Cuenta</h1>
            <p style={styles.subtitle}>
              Únete a QR Manager y empieza a crear tus códigos personalizados.
            </p>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce tu nombre"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#5200cc" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#5200cc" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
                {termsAccepted && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.termsText}>
                Acepto los <Text style={styles.linkBold}>Términos y Condiciones</Text> y la <Text style={styles.linkBold}>Política de Privacidad</Text>.
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton} activeOpacity={0.8}>
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O REGÍSTRATE CON</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Register */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#0f172a" style={{ marginRight: 8 }} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color="#0f172a" style={{ marginRight: 8 }} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login/login' as any)}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    height: 56,
  },
  backButton: { width: 48, height: 48, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  heroSection: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 24 },
  form: { gap: 16 },
  inputGroup: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 8 },
  input: {
    height: 56,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  passwordInput: { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 16, color: '#0f172a' },
  eyeIcon: { paddingHorizontal: 15 },
  checkboxContainer: { flexDirection: 'row', marginTop: 8, gap: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.3)',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: '#5200cc', borderColor: '#5200cc' },
  termsText: { flex: 1, fontSize: 14, color: '#64748b', lineHeight: 20 },
  linkBold: { color: '#5200cc', fontWeight: 'bold' },
  registerButton: {
    backgroundColor: '#5200cc',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#5200cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(82, 0, 204, 0.1)' },
  dividerText: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(82, 0, 204, 0.2)',
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 4 },
  footerText: { fontSize: 14, color: '#64748b' },
  loginLink: { fontSize: 14, fontWeight: 'bold', color: '#5200cc' },
});