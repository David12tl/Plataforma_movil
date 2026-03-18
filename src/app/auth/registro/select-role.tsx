import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ROLES = [
  { id: '1', name: 'Administrador', icon: 'shield-check-outline', color: '#1e293b' },
  { id: '2', name: 'Ingeniero', icon: 'construct-outline', color: '#0369a1' },
  { id: '3', name: 'Supervisor', icon: 'eye-outline', color: '#047857' },
  { id: '4', name: 'Empleado', icon: 'people-outline', color: '#5200cc' },
];

export default function SelectRoleScreen() {
  const router = useRouter();

  const handleSelect = (roleId: string) => {
    // Navegamos al registro pasando el ID del rol como parámetro
    router.push({
      pathname: './registro',
      params: { roleId: roleId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>¿Cuál es tu rol?</Text>
        <Text style={styles.subtitle}>Selecciona tu perfil para personalizar tu experiencia</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {ROLES.map((role) => (
          <TouchableOpacity 
            key={role.id} 
            style={styles.card}
            onPress={() => handleSelect(role.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: role.color + '15' }]}>
              <Ionicons name={role.icon as any} size={28} color={role.color} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>{role.name}</Text>
              <Text style={styles.roleDesc}>Acceso nivel {role.id}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  header: { padding: 30, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 8 },
  list: { paddingHorizontal: 24, gap: 16 },
  card: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: { flex: 1, marginLeft: 16 },
  roleName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  roleDesc: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
});