<<<<<<< HEAD
const fincasService = require('../services/fincasService');

class FincasController {
=======
// src/controllers/fincasController.js
const fincasService = require('../services/fincasService');

class FincasController {

>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
  async createFincas(req, res) {
    try {
      const finca = await fincasService.createFincas(req.body);
      res.status(201).json(finca);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getFincas(req, res) {
    try {
      const finca = await fincasService.getFincas(req.params.id);
<<<<<<< HEAD

      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }

=======
      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
      res.json(finca);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateFincas(req, res) {
    try {
      const finca = await fincasService.updateFincas(req.params.id, req.body);
<<<<<<< HEAD

      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }

=======
      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
      res.json(finca);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteFincas(req, res) {
    try {
      const finca = await fincasService.deleteFincas(req.params.id);
<<<<<<< HEAD

      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }

      res.json({ message: 'Finca desactivada correctamente' });
=======
      if (!finca) {
        return res.status(404).json({ error: 'Finca no encontrada' });
      }
      res.json({ message: 'Finca eliminada correctamente' });
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async fincasActivas(req, res) {
    try {
      const resultado = await fincasService.fincasActivas();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async fincasPorProvincia(req, res) {
    try {
      const resultado = await fincasService.fincasPorProvincia(req.params.provincia);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async promedioTamano(req, res) {
    try {
      const resultado = await fincasService.promedioTamano();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

<<<<<<< HEAD
module.exports = new FincasController();
=======
module.exports = new FincasController();
>>>>>>> e0b7f66a48977a48d14cf7b2a034215f6b1ddb00
