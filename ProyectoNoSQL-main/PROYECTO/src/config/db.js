// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Proyecto';
    await mongoose.connect(uri);
    console.log('MongoDB conectado correctamente');
  } catch (err) {
    console.error('Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
