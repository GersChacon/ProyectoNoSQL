<<<<<<< HEAD
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
=======
// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
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

app.use(bodyParser.json());

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

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, 'Publico')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Publico', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
=======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
