import { usePathname, useRouter } from 'expo-router'; // Importamos los hooks de navegación
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const Navbar = () => {
  const router = useRouter(); // Para navegar
  const pathname = usePathname(); // Para saber en qué ruta estamos (reemplaza a activeTab)

  const tabs = [
    { id: '/Dashboard', icon: '📊' },
    { id: '/Historial_certificado', icon: '📄' },
    { id: '/Historial_incidencia', icon: '📋' },
    { id: '/Lector_QR', icon: '📷' },
    { id: '/Registro_certificado', icon: '📄' },
    { id: '/Registro_incidencia', icon: '⚠️' },
    { id: '/auth/login/login', icon: '🔑' }, // Ruta corregida según estructura Expo Router
  ];

  return (
    <View style={styles.navWrapper}>
      <View style={styles.blurContainer}>
        {tabs.map((tab) => {
          
          const isActive = pathname === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => router.push(tab.id)} 
              style={styles.tabItem}
            >
              <View style={[
                styles.iconBg, 
                isActive && styles.activeIconBg
              ]}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navWrapper: {
    position: 'absolute',
    bottom: 30,
    width: width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  blurContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 35,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabIcon: {
    fontSize: 22,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00D4FF',
    marginTop: 4,
    position: 'absolute',
    bottom: -4,
  },
});

export default Navbar;