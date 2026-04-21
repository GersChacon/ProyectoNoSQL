// src/controllers/pagosController.js
const pagosService = require('../services/pagosService');

class PagosController {

  async createPagos(req, res) {
    try {
      const pago = await pagosService.createPagos(req.body);
      res.status(201).json(pago);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getPagos(req, res) {
    try {
      const pago = await pagosService.getPagos(req.params.id);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
      res.json(pago);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePagos(req, res) {
    try {
      const pago = await pagosService.updatePagos(req.params.id, req.body);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
      res.json(pago);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deletePagos(req, res) {
    try {
      const pago = await pagosService.deletePagos(req.params.id);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
      res.json({ message: 'Pago eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async pagosPorRecolector(req, res) {
    try {
      const resultado = await pagosService.pagosPorRecolector(req.params.recolector_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async totalPagadoPorCorte(req, res) {
    try {
      const resultado = await pagosService.totalPagadoPorCorte(req.params.corte_id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async pagosPendientes(req, res) {
    try {
      const resultado = await pagosService.pagosPendientes();
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new PagosController();
