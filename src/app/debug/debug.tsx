import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase'; // VERIFICA QUE ESTA RUTA SEA CORRECTA

export default function DebugScreen() {
  
  const runTest = async () => {
    console.log("-----------------------------------------");
    console.log("🚀 BOTÓN PRESIONADO - INICIANDO PRUEBA");
    console.log("-----------------------------------------");

    try {
      // PRUEBA 0: Conexión básica
      console.log("1. Probando comunicación con Supabase...");
      const { data: connectionTest, error: connError } = await supabase.from('roles').select('count');
      
      if (connError) {
        console.error("❌ ERROR DE CONEXIÓN:", connError.message);
        Alert.alert("Error de Red", connError.message);
        return;
      }
      console.log("✅ Conexión establecida con éxito.");

      // PRUEBA 1: Intento de registro manual
      const emailTest = `user_${Date.now()}@test.com`;
      console.log(`2. Intentando registrar: ${emailTest}`);

      const { data, error } = await supabase.auth.signUp({
        email: emailTest,
        password: 'Password123!',
        options: {
          data: {
            full_name: "Test Debugger",
            id_rol: "4" 
          }
        }
      });

      if (error) {
        console.error("❌ ERROR EN SIGNUP:", error.message);
        Alert.alert("Error en Auth", error.message);
      } else {
        console.log("✅ USUARIO CREADO EN AUTH. ID:", data.user?.id);
        Alert.alert("Éxito parcial", "Usuario creado en Auth. Revisa la consola.");
      }

    } catch (err: any) {
      console.error("💥 ERROR CRÍTICO:", err.message);
      Alert.alert("Fallo Crítico", err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ marginBottom: 20, fontWeight: 'bold' }}>MODO DIAGNÓSTICO ACTIVO</Text>
      <TouchableOpacity 
        onPress={runTest}
        style={{ padding: 20, backgroundColor: 'red', borderRadius: 10 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>FORZAR REGISTRO DE PRUEBA</Text>
      </TouchableOpacity>
    </View>
  );
}