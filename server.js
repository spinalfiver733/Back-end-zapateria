const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const inventarioRoutes = require('./routes/inventario');
const ventasRoutes = require('./routes/ventas'); // Importa las rutas de ventas
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventasRoutes); // Agrega las rutas de ventas
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend conectado exitosamente" });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Inicialización de la base de datos
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('Base de datos sincronizada');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    process.exit(1);
  }
}

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await initializeDatabase();
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
  process.exit(1);
});