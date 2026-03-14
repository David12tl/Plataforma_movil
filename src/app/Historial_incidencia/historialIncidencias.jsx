
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
  {
    id: "#8270",
    titulo: "Mantenimiento de Puerta",
    descripcion: "Cerradura del depósito de limpieza reparada.",
    estado: "Resuelta",
    tiempo: "Ayer, 14:30",
    icono: "🔧",
  },
  {
    id: "#8264",
    titulo: "Aire Acondicionado Sala",
    descripcion: "El termostato no responde.",
    estado: "En proceso",
    tiempo: "12 Oct 2023",
    icono: "❄️",
  },
  {
    id: "#8255",
    titulo: "Cambio Luminarias Exterior",
    descripcion: "Dos focos del estacionamiento trasero fundidos.",
    estado: "Pendiente",
    tiempo: "11 Oct 2023",
    icono: "💡",
  },
];

export default function HistorialIncidencias() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">

      
      <h1 className="text-xl font-bold mb-4">Historial de Incidencias</h1>

      
      <input
        type="text"
        placeholder="Buscar por ID, título o ubicación..."
        className="w-full p-2 rounded-lg border mb-4"
      />

      
      <div className="flex gap-2 mb-4">
        <button className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Todas</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">Pendientes</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">En proceso</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-sm">Resueltas</button>
      </div>

      
      <div className="flex flex-col gap-3">

        {incidencias.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow flex items-start gap-3"
          >

            
            <div className="text-xl">{item.icono}</div>

            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{item.titulo}</h2>

                <span
                  className={`text-xs px-2 py-1 rounded-full
                  ${item.estado === "Pendiente" ? "bg-orange-200 text-orange-700" : ""}
                  ${item.estado === "En proceso" ? "bg-blue-200 text-blue-700" : ""}
                  ${item.estado === "Resuelta" ? "bg-green-200 text-green-700" : ""}
                  `}
                >
                  {item.estado}
                </span>
              </div>

              <p className="text-sm text-gray-500">{item.descripcion}</p>

              <div className="text-xs text-gray-400 mt-1">
                {item.id} • {item.tiempo}
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}