// src/controllers/preciosController.js
const preciosService = require('../services/preciosService');

class PreciosController {

  async createPrecios(req, res) {
    try {
      const precio = await preciosService.createPrecios(req.body);
      res.status(201).json(precio);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPrecios(req, res) {
    try {
      const precio = await preciosService.getPrecios(req.params.id);
      if (!precio) {
        return res.status(404).json({ error: 'Precio no encontrado' });
      }
      res.json(precio);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePrecios(req, res) {
    try {
      const precio = await preciosService.updatePrecios(req.params.id, req.body);
      if (!precio) {
        return res.status(404).json({ error: 'Precio no encontrado' });
      }
      res.json(precio);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deletePrecios(req, res) {
    try {
      const precio = await preciosService.deletePrecios(req.params.id);
      if (!precio) {
        return res.status(404).json({ error: 'Precio no encontrado' });
      }
      res.json({ message: 'Precio eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async precioVigente(req, res) {
    try {
      const resultado = await preciosService.precioVigente();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async historialPrecios(req, res) {
    try {
      const resultado = await preciosService.historialPrecios();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async promedioValorCajuela(req, res) {
    try {
      const resultado = await preciosService.promedioValorCajuela();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new PreciosController();
