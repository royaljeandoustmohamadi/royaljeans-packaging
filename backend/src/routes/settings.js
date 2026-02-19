const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Get all settings
router.get('/all', async (req, res) => {
  try {
    const [productionSuppliers, fabricSuppliers, fabrics, stoneWashes, packingNames, styles, orderTypes, orderLevels] = await Promise.all([
      prisma.productionSupplier.findMany({ where: { isActive: true } }),
      prisma.fabricSupplier.findMany({ where: { isActive: true } }),
      prisma.fabric.findMany({ where: { isActive: true } }),
      prisma.stoneWash.findMany({ where: { isActive: true } }),
      prisma.packingName.findMany({ where: { isActive: true } }),
      prisma.style.findMany({ where: { isActive: true } }),
      prisma.orderType.findMany({ where: { isActive: true } }),
      prisma.orderLevel.findMany({ where: { isActive: true } }),
    ]);

    res.json({
      productionSuppliers,
      fabricSuppliers,
      fabrics,
      stoneWashes,
      packingNames,
      styles,
      orderTypes,
      orderLevels,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Production Suppliers
router.get('/production-suppliers', async (req, res) => {
  try {
    const items = await prisma.productionSupplier.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/production-suppliers', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.productionSupplier.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/production-suppliers/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.productionSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/production-suppliers/:id', async (req, res) => {
  try {
    await prisma.productionSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fabric Suppliers
router.get('/fabric-suppliers', async (req, res) => {
  try {
    const items = await prisma.fabricSupplier.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fabric-suppliers', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.fabricSupplier.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/fabric-suppliers/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.fabricSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/fabric-suppliers/:id', async (req, res) => {
  try {
    await prisma.fabricSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fabrics
router.get('/fabrics', async (req, res) => {
  try {
    const items = await prisma.fabric.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/fabrics', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.fabric.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/fabrics/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.fabric.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/fabrics/:id', async (req, res) => {
  try {
    await prisma.fabric.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stone Washes
router.get('/stone-washes', async (req, res) => {
  try {
    const items = await prisma.stoneWash.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stone-washes', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.stoneWash.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stone-washes/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.stoneWash.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/stone-washes/:id', async (req, res) => {
  try {
    await prisma.stoneWash.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Packing Names
router.get('/packing-names', async (req, res) => {
  try {
    const items = await prisma.packingName.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/packing-names', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.packingName.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packing-names/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.packingName.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/packing-names/:id', async (req, res) => {
  try {
    await prisma.packingName.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Styles
router.get('/styles', async (req, res) => {
  try {
    const items = await prisma.style.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/styles', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.style.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/styles/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.style.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/styles/:id', async (req, res) => {
  try {
    await prisma.style.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Types
router.get('/order-types', async (req, res) => {
  try {
    const items = await prisma.orderType.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/order-types', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.orderType.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/order-types/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.orderType.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/order-types/:id', async (req, res) => {
  try {
    await prisma.orderType.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Levels
router.get('/order-levels', async (req, res) => {
  try {
    const items = await prisma.orderLevel.findMany({ where: { isActive: true } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/order-levels', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.orderLevel.create({
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/order-levels/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const item = await prisma.orderLevel.update({
      where: { id: parseInt(req.params.id) },
      data: { name: name || value, value: name || value }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/order-levels/:id', async (req, res) => {
  try {
    await prisma.orderLevel.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
