import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const incidencias = [
  {
    id: "#8292",
    titulo: "Falla Eléctrica Sector A",
    descripcion: "Sin luz en el pasillo principal del ala norte.",
    estado: "Pendiente",
    tiempo: "Hace 15 min",
    icono: "⚡",
  },
  {
    id: "#8285",
    titulo: "Fuga de Agua - Baños",
    descripcion: "Goteo constante en el lavabo 3 del baño de mujeres.",
    estado: "En proceso",
    tiempo: "Hace 2 horas",
    icono: "🚿",
  },
];

export default function App() {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Historial de Incidencias</Text>

      <TextInput
        placeholder="Buscar..."
        style={styles.input}
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnActive}>
          <Text style={styles.btnText}>Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Text>Pendientes</Text>
        </TouchableOpacity>
      </View>

      {incidencias.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.icon}>{item.icono}</Text>

          <View style={{ flex: 1 }}>
            <Text style={styles.subtitle}>{item.titulo}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
            <Text style={styles.time}>{item.id} • {item.tiempo}</Text>
          </View>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#e5e7eb",
    padding: 8,
    borderRadius: 20,
  },
  btnActive: {
    backgroundColor: "#7c3aed",
    padding: 8,
    borderRadius: 20,
  },
  btnText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  subtitle: {
    fontWeight: "bold",
  },
  desc: {
    color: "gray",
    fontSize: 12,
  },
  time: {
    fontSize: 10,
    color: "gray",
  },
});