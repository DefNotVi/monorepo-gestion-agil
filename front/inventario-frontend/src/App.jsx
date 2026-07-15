import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// URL exacta de tu controlador de Spring Boot
const API_URL = 'http://localhost:8080/api/Inventarios';

function App() {
  const [inventarios, setInventarios] = useState([]);
  const [formData, setFormData] = useState({
    numeroSerie: '', 
    nombre: '', 
    ubicacion: '', 
    stockActual: 0, 
    stockMinimo: 0
  });

  // HU01 & HU02: Cargar datos desde Spring Boot al iniciar la app
  useEffect(() => {
    fetchInventarios();
  }, []);

  const fetchInventarios = () => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
      })
      .then(data => setInventarios(data))
      .catch(err => console.error("Error cargando el inventario:", err));
  };

  // Manejar cambios en los inputs del formulario (HU01)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // HU01: Registrar un nuevo Inventario
// HU01: Registrar un nuevo Inventario (Con validación de duplicados)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async (res) => {
      if (!res.ok) {
        // Si el backend responde con error (ej: 400 Bad Request), extraemos el texto del error
        const msgError = await res.text();
        throw new Error(msgError);
      }
      return res.json();
    })
    .then(() => {
      fetchInventarios(); // Recargar la lista en tiempo real
      setFormData({ numeroSerie: '', nombre: '', ubicacion: '', stockActual: 0, stockMinimo: 0 }); // Limpiar formulario
      alert("✅ Componente registrado exitosamente.");
    })
    .catch(err => {
      // Muestra la alerta en pantalla con el mensaje enviado desde Spring Boot
      alert(`❌ Error: ${err.message}`);
      console.error("Error al guardar el ítem:", err);
    });
  };

  // HU03: Simular movimiento (Sumar o restar stock)
  const handleMovimiento = (id, cantidad) => {
    fetch(`${API_URL}/${id}/movimiento?cantidad=${cantidad}`, {
      method: 'PUT'
    })
    .then(() => fetchInventarios())
    .catch(err => console.error("Error en el movimiento de stock:", err));
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">Maestranzas Unidos S.A.</h2>
        <p className="text-muted">Panel de Control de Inventario & MVP (Vite + React + Spring Boot)</p>
      </div>
      
      {/* HU01: Formulario de Registro */}
      <div className="card p-4 mb-5 shadow-sm border-0 bg-light">
        <h5 className="fw-bold mb-3 text-secondary">📦 HU01: Registrar Ítem en Inventario</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <input type="text" name="numeroSerie" className="form-control" placeholder="N° de Serie" value={formData.numeroSerie} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="text" name="nombre" className="form-control" placeholder="Nombre del Componente" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="text" name="ubicacion" className="form-control" placeholder="Ubicación (Ej: Bodega A)" value={formData.ubicacion} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="number" name="stockActual" className="form-control" placeholder="Stock Inicial" value={formData.stockActual} onChange={handleChange} min="0" required />
          </div>
          <div className="col-md-2">
            <input type="number" name="stockMinimo" className="form-control" placeholder="Stock Mínimo" value={formData.stockMinimo} onChange={handleChange} min="0" required />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100 fw-bold">Registrar Componente</button>
          </div>
        </form>
      </div>

      {/* Tabla de Existencias y Alertas */}
      <div className="card p-4 shadow-sm border-0">
        <h5 className="fw-bold mb-3 text-secondary">📋 Listado de Existencias en Tiempo Real</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover mt-2">
            <thead className="table-dark">
              <tr>
                <th>N° Serie</th>
                <th>Componente</th>
                <th>Ubicación</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>HU02: Alerta Estado</th>
                <th>HU03: Movimientos</th>
              </tr>
            </thead>
            <tbody>
              {inventarios.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">No hay registros en el inventario.</td>
                </tr>
              ) : (
                inventarios.map(item => {
                  // Lógica de HU02: Si el stock actual es menor o igual al mínimo, se activa la alerta visual
                  const esAlerta = item.stockActual <= item.stockMinimo;
                  
                  return (
                    <tr key={item.id} className={esAlerta ? "table-danger" : ""}>
                      <td className="fw-semibold">{item.numeroSerie}</td>
                      <td>{item.nombre}</td>
                      <td><span className="badge bg-secondary">{item.ubicacion}</span></td>
                      <td><strong className="fs-5">{item.stockActual}</strong> u.</td>
                      <td>{item.stockMinimo} u.</td>
                      <td>
                        {esAlerta ? (
                          <span className="badge bg-danger p-2">⚠️ ¡STOCK CRÍTICO! RECOMPRAR</span>
                        ) : (
                          <span className="badge bg-success p-2">✅ Stock Óptimo</span>
                        )}
                      </td>
                      <td>
                        {/* HU03: Control de movimientos físicos */}
                        <button onClick={() => handleMovimiento(item.id, 1)} className="btn btn-sm btn-success me-2 fw-bold">+ Entrada</button>
                        <button onClick={() => handleMovimiento(item.id, -1)} className="btn btn-sm btn-danger fw-bold" disabled={item.stockActual <= 0}>- Salida</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;