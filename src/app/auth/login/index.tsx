import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { supabase } from '../../../utils/supabase';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tus credenciales.');
      return;
    }

    setLoading(true);

    // 1. Intentar iniciar sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      Alert.alert('Error de acceso', 'Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    // 2. Si el login es exitoso, verificamos el rol en la tabla profiles
    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id_rol')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error("Error al obtener perfil:", profileError);
      }

      setLoading(false);
      // 3. Redirigir al Dashboard principal (que ya maneja los roles internamente)
      router.replace('/Dashboard');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="lock-open" size={40} color="white" />
            </View>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Ingresa tus datos para gestionar el sistema</Text>
          </View>

          <View style={styles.form}>
            {/* Campo Email */}
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
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.iconBox}>
                  <Ionicons name="lock-closed-outline" size={20} color="#5200cc" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Tu contraseña"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, loading && { opacity: 0.7 }]} 
              activeOpacity={0.8}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
                  <Ionicons name="log-in-outline" size={22} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/registro')}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  scrollContent: { paddingHorizontal: 30, paddingVertical: 60 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { 
    width: 80, 
    height: 80, 
    backgroundColor: '#5200cc', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#5200cc',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 5, textAlign: 'center' },
  form: { gap: 20 },
  inputGroup: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
  },
  iconBox: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  input: { flex: 1, paddingHorizontal: 15, fontSize: 16, color: '#0f172a' },
  eyeButton: { width: 50, justifyContent: 'center', alignItems: 'center' },
  loginButton: {
    backgroundColor: '#5200cc',
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    elevation: 4,
  },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: { fontSize: 14, color: '#64748b' },
  registerLink: { fontSize: 14, fontWeight: 'bold', color: '#5200cc' },
});