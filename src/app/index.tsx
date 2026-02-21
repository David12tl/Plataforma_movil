import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  AlertTriangle,
  Camera,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LucideIcon
} from 'lucide-react-native';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Importación de tus estilos externos
import { styles } from './styles';

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

const ModuleCard = ({ icon: Icon, title, desc, tag, color }: ModuleCardProps) => (
  <View style={styles.moduleCard}>
    <View style={styles.moduleIconContainer}>
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.moduleName}>{title}</Text>
    <Text style={styles.moduleDesc}>{desc}</Text>
    <Text style={[styles.moduleTag, { color: color }]}>{tag}</Text>
  </View>
);

export default function LandingScreen() {
  const router = useRouter(); // Hook para manejar la navegación

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.glowTop} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>SISTEMA OPERATIVO NATIVO</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Operaciones{"\n"}
            <Text style={{ color: '#00e5ff', fontStyle: 'italic' }}>en control.</Text>{"\n"}
            <Text style={styles.line2}>Siempre.</Text>
          </Text>

          <Text style={styles.heroDesc}>
            Plataforma de gestión operativa de alta gama. 
            Seguridad industrial y visión inteligente.
          </Text>

          <View style={styles.heroActions}>
            {/* BOTÓN CON NAVEGACIÓN */}
            <TouchableOpacity 
              style={styles.btnPrimary} 
              activeOpacity={0.8}
              onPress={() => router.push('/auth/login/login')}>
              <Text style={styles.btnPrimaryText}>Iniciar Sesión</Text>
              <ChevronRight size={18} color="#0a0c10" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnGhost}>
              <Text style={styles.btnGhostText}>Stack Técnico</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid de Módulos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>CAPACIDADES</Text>
          <Text style={styles.sectionTitle}>Ecosistema Modular.</Text>
        </View>

        <View style={styles.modulesGrid}>
          <ModuleCard icon={LayoutDashboard} title="Panel" desc="Métricas en tiempo real." tag="DASHBOARD" color="#00e5ff" />
          <ModuleCard icon={FileText} title="Cumplimiento" desc="Certificaciones ISO." tag="CERTIFICATES" color="#30d158" />
          <ModuleCard icon={Camera} title="Visión AI" desc="Escaneo de activos." tag="SCANNER" color="#ffcc02" />
          <ModuleCard icon={AlertTriangle} title="Seguridad" desc="Gestión de riesgos." tag="INCIDENTS" color="#ff6b35" />
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>© 2026 OpsCore · Expo Router</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}