import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Mapeo de tus carpetas a rutas de navegación
  const navItems = [
  { name: 'Inicio', icon: 'home-outline', route: '/Dashboard' },
  { name: 'Incidencias', icon: 'alert-circle-outline', route: '/Registro_incidencia' },
  { name: 'Certificados', icon: 'ribbon-outline', route: '/Registro_certificados' },
  { name: 'Historial Cer.', icon: 'document-text-outline', route: '/Historial_certificado' },
  { name: 'Historial Inc.', icon: 'time-outline', route: '/Historial_incidencia' },
  { name: 'Historial Inc.', icon: 'time-outline', route: '/QR_generador' },
  { name: 'Ajustes', icon: 'settings-outline', route: '/auth/login/login' },
  ];

  return (
    <View style={styles.navBar}>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.route);
        return (
          <TouchableOpacity 
            key={item.route} 
            style={styles.navItem} 
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons 
              name={item.icon as any} 
              size={28} 
              color={isActive ? "#5200cc" : "#94a3b8"} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: { flex: 1, alignItems: 'center' },
});