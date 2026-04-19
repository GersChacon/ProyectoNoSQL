require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

const asignacionesRoutes    = require('./routes/asignacionesRoutes');
const auditoriaRoutes       = require('./routes/auditoriaRoutes');
const cortesRoutes          = require('./routes/cortesRoutes');
const fincasRoutes          = require('./routes/fincasRoutes');
const notificacionesRoutes  = require('./routes/notificacionesRoutes');
const pagosRoutes           = require('./routes/pagosRoutes');
const preciosRoutes         = require('./routes/preciosRoutes');
const recoleccionesRoutes   = require('./routes/recoleccionesRoutes');
const recolectoresRoutes    = require('./routes/recolectoresRoutes');
const reportesRoutes        = require('./routes/reportesRoutes');
const rolesRoutes           = require('./routes/rolesRoutes');
const usuariosRoutes        = require('./routes/usuariosRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', asignacionesRoutes);
app.use('/api', auditoriaRoutes);
app.use('/api', cortesRoutes);
app.use('/api', fincasRoutes);
app.use('/api', notificacionesRoutes);
app.use('/api', pagosRoutes);
app.use('/api', preciosRoutes);
app.use('/api', recoleccionesRoutes);
app.use('/api', recolectoresRoutes);
app.use('/api', reportesRoutes);
app.use('/api', rolesRoutes);
app.use('/api', usuariosRoutes);

app.use(express.static(path.join(__dirname, 'Publico')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Publico', 'index.html'));
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
