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

const ROLES = [
  { id: '1', nombre: 'Administrador', icon: 'shield-checkmark-outline' },
  { id: '2', nombre: 'Ingeniero', icon: 'construct-outline' },
  { id: '3', nombre: 'Supervisor', icon: 'eye-outline' },
  { id: '4', nombre: 'Empleado', icon: 'people-outline' },
];

export default function RegisterScreen() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('4'); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSignUp() {
    if (!email || !password || !fullName) {
      Alert.alert('Campos incompletos', 'Por favor, llena todos los datos.');
      return;
    }

    setLoading(true);

    // Registro en Supabase Auth con metadatos
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: fullName,
          id_rol: selectedRole, // Esto lo recibe tu Trigger en la DB
        },
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert(
        '¡Registro Exitoso!', 
        'Usuario creado correctamente. Ahora puedes iniciar sesión.',
        [{ text: 'Ir al Login', onPress: () => router.replace('/auth/login') }]
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#5200cc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nuevo Registro</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionLabel}>Selecciona tu Cargo</Text>
          <View style={styles.roleGrid}>
            {ROLES.map((role) => (
              <TouchableOpacity 
                key={role.id}
                style={[styles.roleItem, selectedRole === role.id && styles.roleItemSelected]}
                onPress={() => setSelectedRole(role.id)}
              >
                <Ionicons 
                  name={role.icon as any} 
                  size={20} 
                  color={selectedRole === role.id ? 'white' : '#64748b'} 
                />
                <Text style={[styles.roleText, selectedRole === role.id && styles.roleTextSelected]}>
                  {role.nombre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nombre Completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#5200cc" style={styles.inputIcon} />
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Ej. Juan Pérez" />
            </View>

            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#5200cc" style={styles.inputIcon} />
              <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="correo@empresa.com" />
            </View>

            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#5200cc" style={styles.inputIcon} />
              <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="••••••••" />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Crear Cuenta</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 25 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#64748b', marginBottom: 15 },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  roleItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', minWidth: '47%', gap: 8 },
  roleItemSelected: { backgroundColor: '#5200cc', borderColor: '#5200cc' },
  roleText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  roleTextSelected: { color: 'white' },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 15, height: 55, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  btn: { backgroundColor: '#5200cc', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});