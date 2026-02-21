import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ─── Color tokens (mismo sistema que styles.ts) ────────────────
const C = {
  bg:       '#080a0f',
  surface:  '#0d1018',
  card:     '#111520',
  border:   'rgba(255,255,255,0.06)',
  borderFocus: 'rgba(0,229,255,0.4)',
  accent:   '#00e5ff',
  accentDim:'rgba(0,229,255,0.1)',
  purple:   '#7c5cfc',
  text:     '#eaedf3',
  sub:      '#8892a4',
  muted:    '#4b5563',
  error:    '#ff375f',
  errorDim: 'rgba(255,55,95,0.1)',
  white:    '#ffffff',
};

// ─── Tipos ─────────────────────────────────────────────────────
type Field = 'email' | 'password';

// ─── Componente InputField ─────────────────────────────────────
function InputField({
  label, placeholder, value, onChangeText,
  secureTextEntry = false, keyboardType = 'default',
  error, autoCapitalize = 'none',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  error?: string;
  autoCapitalize?: 'none' | 'sentences';
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? C.error : C.border, error ? C.error : C.borderFocus],
  });
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.surface, error ? C.errorDim : C.accentDim],
  });

  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <Animated.View style={[s.inputShell, { borderColor, backgroundColor: bgColor }]}>
        <TextInput
          style={s.input}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor={C.accent}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(v => !v)} style={s.eyeBtn}>
            <Text style={s.eyeIcon}>{showPass ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
      {error ? <Text style={s.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ─── Pantalla principal ────────────────────────────────────────
export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Partial<Record<Field, string>>>({});
  const [globalErr, setGlobalErr] = useState('');

  // Shake animation para errores
  const shakeX = useRef(new Animated.Value(0)).current;
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const validate = () => {
    const errs: Partial<Record<Field, string>> = {};
    if (!email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Correo inválido';
    if (!password) errs.password = 'La contraseña es requerida';
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres';
    return errs;
  };

  const handleLogin = async () => {
    setGlobalErr('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      shake();
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // ── Aquí va tu lógica de auth (Firebase, API, etc.) ──
      await new Promise(r => setTimeout(r, 1800)); // simulación
      router.replace('/auth/registro/registro'); // ajusta tu ruta destino
    } catch (e) {
      setGlobalErr('Credenciales incorrectas. Intenta de nuevo.');
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      {/* Ambient glows */}
      <View style={s.glowA} pointerEvents="none" />
      <View style={s.glowB} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo / Brand ── */}
        <View style={s.brand}>
          <View style={s.brandBadge}>
            <View style={s.brandDot} />
            <Text style={s.brandBadgeText}>SISTEMA SEGURO</Text>
          </View>
          <Text style={s.brandLogo}>
            Ops<Text style={s.brandAccent}>Core</Text>
          </Text>
          <Text style={s.brandSub}>
            Gestión Operativa · Seguridad Industrial
          </Text>
        </View>

        {/* ── Card ── */}
        <Animated.View style={[s.card, { transform: [{ translateX: shakeX }] }]}>

          {/* Header */}
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Bienvenido</Text>
            <Text style={s.cardSub}>Ingresa tus credenciales de acceso</Text>
          </View>

          {/* Global error */}
          {globalErr ? (
            <View style={s.globalError}>
              <Text style={s.globalErrorIcon}>⚠️</Text>
              <Text style={s.globalErrorText}>{globalErr}</Text>
            </View>
          ) : null}

          {/* Fields */}
          <View style={s.fields}>
            <InputField
              label="Correo electrónico"
              placeholder="usuario@empresa.com"
              value={email}
              onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
              keyboardType="email-address"
              error={errors.email}
            />
            <InputField
              label="Contraseña"
              placeholder="••••••••"
              value={password}
              onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
              secureTextEntry
              error={errors.password}
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={s.forgotWrap} onPress={() => router.push('/auth/registro/registro')}>
            <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnLoading]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={C.bg} size="small" />
            ) : (
              <>
                <Text style={s.submitText}>Iniciar Sesión</Text>
                <Text style={s.submitArrow}>→</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>o continúa con</Text>
            <View style={s.dividerLine} />
          </View>

          {/* SSO Options */}
          <View style={s.ssoRow}>
            <TouchableOpacity style={s.ssoBtn}>
              <Text style={s.ssoIcon}>🔑</Text>
              <Text style={s.ssoBtnText}>SSO Empresa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.ssoBtn}>
              <Text style={s.ssoIcon}>📱</Text>
              <Text style={s.ssoBtnText}>QR Code</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View style={s.securityBadge}>
            <Text style={s.securityIcon}>🔒</Text>
            <Text style={s.securityText}>Conexión cifrada · TLS 1.3</Text>
          </View>
          <Text style={s.footerVersion}>OpsCore v2.1 · © 2025</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── StyleSheet ────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  
  glowA: {
    position: 'absolute',
    top: -100,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0,229,255,0.07)',
  },
  glowB: {
    position: 'absolute',
    bottom: 60,
    right: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(124,92,252,0.06)',
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },

  
  brand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 20,
    gap: 6,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  brandBadgeText: {
    color: C.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandLogo: {
    fontSize: 40,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -2,
  },
  brandAccent: {
    color: C.accent,
  },
  brandSub: {
    color: C.muted,
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: C.border,
    padding: 28,
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 40 },
      android: { elevation: 12 },
    }),
  },
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    color: C.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 6,
  },
  cardSub: {
    color: C.sub,
    fontSize: 13,
    lineHeight: 20,
  },

  // Global error
  globalError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.errorDim,
    borderWidth: 1,
    borderColor: 'rgba(255,55,95,0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  globalErrorIcon: { fontSize: 14 },
  globalErrorText: { color: C.error, fontSize: 13, flex: 1 },

  // Fields
  fields: { gap: 16, marginBottom: 8 },
  fieldWrap: { gap: 6 },
  fieldLabel: {
    color: C.sub,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginLeft: 2,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    color: C.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  eyeIcon: { fontSize: 16 },
  fieldError: {
    color: C.error,
    fontSize: 11,
    marginLeft: 4,
    marginTop: 2,
  },

  // Forgot
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 12,
    marginBottom: 24,
  },
  forgotText: {
    color: C.accent,
    fontSize: 13,
    fontWeight: '600',
  },

  // Submit
  submitBtn: {
    backgroundColor: C.accent,
    borderRadius: 100,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios:     { shadowColor: C.accent, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  submitBtnLoading: {
    opacity: 0.75,
  },
  submitText: {
    color: C.bg,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  submitArrow: {
    color: C.bg,
    fontSize: 18,
    fontWeight: '700',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // SSO
  ssoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ssoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    height: 48,
    backgroundColor: C.surface,
    gap: 8,
  },
  ssoIcon: { fontSize: 16 },
  ssoBtnText: {
    color: C.sub,
    fontSize: 13,
    fontWeight: '600',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 10,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityIcon: { fontSize: 12 },
  securityText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  footerVersion: {
    color: 'rgba(255,255,255,0.12)',
    fontSize: 10,
  },
});