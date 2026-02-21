import { createStackNavigator } from '@react-navigation/stack';

// Importación de pantallas (debes crearlas en sus carpetas)
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';

const Stack = createStackNavigator();

export const AppNavigator = ({ session }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && session.user ? (
        // Rutas Protegidas (Si hay usuario)
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      ) : (
        // Rutas Públicas (Si no hay usuario)
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};