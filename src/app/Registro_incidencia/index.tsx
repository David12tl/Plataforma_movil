import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../../utils/supabase';

const PrimaryColor = "#4F46E5";
const SuccessColor = "#10B981"; // Verde para el éxito

export default function RegistrarIncidencia() {
    const router = useRouter();
    
    // Estados
    const [loading, setLoading] = useState(false);
    const [fetchingEmployees, setFetchingEmployees] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Nuevo estado

    const [form, setForm] = useState({
        titulo: '',
        tipo_incidencia: '',
        ubicacion: '',
        descripcion: '',
        empleado_seleccionado: null as any,
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setFetchingEmployees(true);
            const { data, error } = await supabase
                .from('empleado')
                .select('id, nombre_completo, matricula_empleado');
            
            if (error) throw error;
            setEmployees(data || []);
            setFilteredEmployees(data || []);
        } catch (error: any) {
            console.error(error.message);
        } finally {
            setFetchingEmployees(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const term = text.toLowerCase().trim();
        const filtered = employees.filter(emp => 
            emp.nombre_completo?.toLowerCase().includes(term) ||
            emp.matricula_empleado?.toLowerCase().includes(term)
        );
        setFilteredEmployees(filtered);
    };

    const handleSendReport = async () => {
        if (!form.empleado_seleccionado || !form.titulo || !form.tipo_incidencia) {
            return Alert.alert("Atención", "Completa los campos obligatorios (*)");
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('incidencias')
                .insert([{
                    empleado_id: form.empleado_seleccionado.id,
                    titulo: form.titulo,
                    tipo_incidencia: form.tipo_incidencia,
                    descripcion: form.descripcion,
                    ubicacion: form.ubicacion,
                    nombre_registrador: "Supervisor"
                }]);

            if (error) throw error;

            // --- LÓGICA DE REINICIO Y MENSAJE ---
            setShowSuccessMessage(true); // Mostrar banner verde
            
            // Limpiar formulario
            setForm({
                titulo: '',
                tipo_incidencia: '',
                ubicacion: '',
                descripcion: '',
                empleado_seleccionado: null,
            });
            setSearchText('');

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Banner de Éxito Flotante */}
            {showSuccessMessage && (
                <View style={styles.successBanner}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                    <Text style={styles.successText}>¡Datos enviados correctamente!</Text>
                </View>
            )}

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace('../Dashboard' as any)}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Registrar Reporte</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.label}>Empleado involucrado *</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setShowModal(true)}>
                    <Text style={{ color: form.empleado_seleccionado ? '#000' : '#999' }}>
                        {form.empleado_seleccionado ? form.empleado_seleccionado.nombre_completo : "Toca para buscar empleado..."}
                    </Text>
                    <MaterialCommunityIcons name="magnify" size={20} color={PrimaryColor} />
                </TouchableOpacity>

                <Text style={styles.label}>Título *</Text>
                <TextInput 
                    style={styles.input} 
                    value={form.titulo} 
                    onChangeText={(t) => setForm({...form, titulo: t})}
                    placeholder="Ej: Retardo"
                />

                <Text style={styles.label}>Tipo de incidencia *</Text>
                <TextInput 
                    style={styles.input} 
                    value={form.tipo_incidencia} 
                    onChangeText={(t) => setForm({...form, tipo_incidencia: t})}
                    placeholder="Ej: Disciplina"
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput 
                    style={[styles.input, { height: 100 }]} 
                    multiline 
                    value={form.descripcion} 
                    onChangeText={(t) => setForm({...form, descripcion: t})}
                    placeholder="Detalles de lo ocurrido..."
                />

                <TouchableOpacity 
                    style={[styles.btn, loading && { opacity: 0.7 }]} 
                    onPress={handleSendReport}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Guardar Reporte</Text>}
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL DE BÚSQUEDA (Sin cambios) */}
            <Modal visible={showModal} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.modalHeader}>
                        <View style={styles.searchBar}>
                            <MaterialCommunityIcons name="magnify" size={20} color="#999" />
                            <TextInput 
                                style={styles.searchInput}
                                placeholder="Buscar por nombre o MAT..."
                                value={searchText}
                                onChangeText={handleSearch}
                                autoFocus
                            />
                        </View>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={{ padding: 10 }}>
                            <Text style={{ color: PrimaryColor, fontWeight: 'bold' }}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList 
                        data={filteredEmployees}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.empItem}
                                onPress={() => {
                                    setForm({...form, empleado_seleccionado: item});
                                    setShowModal(false);
                                }}
                            >
                                <View>
                                    <Text style={styles.empName}>{item.nombre_completo}</Text>
                                    <Text style={styles.empMat}>{item.matricula_empleado}</Text>
                                </View>
                                <MaterialCommunityIcons name="plus" size={20} color={PrimaryColor} />
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    // Estilo del Banner de Éxito
    successBanner: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: SuccessColor,
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    successText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
    
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    scrollContent: { padding: 20 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginTop: 15, textTransform: 'uppercase' },
    selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f0f4ff', borderRadius: 10, marginTop: 5, borderWidth: 1, borderColor: PrimaryColor },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: 5, fontSize: 16 },
    btn: { backgroundColor: PrimaryColor, padding: 18, borderRadius: 12, marginTop: 30, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 8, paddingHorizontal: 10, height: 45 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
    empItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
    empName: { fontWeight: 'bold', fontSize: 16 },
    empMat: { color: '#666', fontSize: 13, marginTop: 2 }
});