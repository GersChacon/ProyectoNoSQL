<<<<<<< HEAD
const recolectoresService = require('../services/recolectoresService');

class RecolectoresController {
=======
// src/controllers/recolectoresController.js
const recolectoresService = require('../services/recolectoresService');

class RecolectoresController {

>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
  async createRecolectores(req, res) {
    try {
      const recolector = await recolectoresService.createRecolectores(req.body);
      res.status(201).json(recolector);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRecolectores(req, res) {
    try {
      const recolector = await recolectoresService.getRecolectores(req.params.id);
<<<<<<< HEAD

      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }

=======
      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
      res.json(recolector);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateRecolectores(req, res) {
    try {
      const recolector = await recolectoresService.updateRecolectores(req.params.id, req.body);
<<<<<<< HEAD

      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }

=======
      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
      res.json(recolector);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteRecolectores(req, res) {
    try {
      const recolector = await recolectoresService.deleteRecolectores(req.params.id);
<<<<<<< HEAD

      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }

      res.json({ message: 'Recolector desactivado correctamente' });
=======
      if (!recolector) {
        return res.status(404).json({ error: 'Recolector no encontrado' });
      }
      res.json({ message: 'Recolector eliminado correctamente' });
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async recolectoresActivos(req, res) {
    try {
      const resultado = await recolectoresService.recolectoresActivos();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async recolectoresPorNombre(req, res) {
    try {
      const resultado = await recolectoresService.recolectoresPorNombre(req.params.nombre);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async recolectoresMultiplesFincas(req, res) {
    try {
      const resultado = await recolectoresService.recolectoresMultiplesFincas();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

<<<<<<< HEAD
module.exports = new RecolectoresController();
=======
module.exports = new RecolectoresController();
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
