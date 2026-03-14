import { QrCode, Share2 } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    StyleSheet, Text,
    TextInput, TouchableOpacity,
    View
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const PRIMARY_COLOR = "#5200cc";

export default function GenerarQRPage() {
  const [text, setText] = useState('');
  const qrRef = useRef<any>(null);

  const handleAction = () => {
    if (!text) return;
    // Aquí podrías implementar lógica de guardado sin dependencias de FileSystem
    Alert.alert("Acción", "Función de compartir lista para implementar");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        
        <View style={styles.qrContainer}>
          {text ? (
            <QRCode value={text} size={200} getRef={(ref) => (qrRef.current = ref)} />
          ) : (
            <QrCode size={100} color="#e2e8f0" />
          )}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Ingresa texto para el QR..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity 
          style={[styles.button, !text && styles.disabledButton]} 
          onPress={handleAction}
          disabled={!text}
        >
          <Share2 color="white" size={20} />
          <Text style={styles.buttonText}>Compartir QR</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f5f8' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  qrContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    marginBottom: 24
  },
  button: {
    flexDirection: 'row',
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  disabledButton: { backgroundColor: '#cbd5e1' },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 }
});