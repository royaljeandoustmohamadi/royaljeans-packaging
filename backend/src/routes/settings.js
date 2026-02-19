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
    const supplierName = name || value;

    // Create production supplier in settings
    const item = await prisma.productionSupplier.create({
      data: { name: supplierName, value: supplierName }
    });

    // Sync with contractors table
    try {
      await prisma.contractor.upsert({
        where: { name: supplierName },
        update: { isActive: true },
        create: {
          name: supplierName,
          type: 'PRODUCTION',
          isActive: true
        }
      });
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/production-suppliers/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const supplierName = name || value;

    // Get current production supplier
    const currentSupplier = await prisma.productionSupplier.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!currentSupplier) {
      return res.status(404).json({ error: 'Production supplier not found' });
    }

    // Update production supplier
    const item = await prisma.productionSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { name: supplierName, value: supplierName }
    });

    // Sync with contractors table
    try {
      // Update existing contractor or create new one
      await prisma.contractor.upsert({
        where: { name: supplierName },
        update: {
          name: supplierName,
          type: 'PRODUCTION',
          isActive: true
        },
        create: {
          name: supplierName,
          type: 'PRODUCTION',
          isActive: true
        }
      });

      // If name changed, deactivate old contractor entry
      if (currentSupplier.name !== supplierName) {
        const oldContractor = await prisma.contractor.findUnique({
          where: { name: currentSupplier.name }
        });
        if (oldContractor && oldContractor.type === 'PRODUCTION') {
          await prisma.contractor.update({
            where: { id: oldContractor.id },
            data: { isActive: false }
          });
        }
      }
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/production-suppliers/:id', async (req, res) => {
  try {
    // Get production supplier before deactivating
    const supplier = await prisma.productionSupplier.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    // Deactivate production supplier
    await prisma.productionSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });

    // Sync with contractors table
    if (supplier) {
      try {
        const contractor = await prisma.contractor.findUnique({
          where: { name: supplier.name }
        });
        if (contractor && contractor.type === 'PRODUCTION') {
          await prisma.contractor.update({
            where: { id: contractor.id },
            data: { isActive: false }
          });
        }
      } catch (syncError) {
        console.warn('Failed to sync with contractors table:', syncError.message);
      }
    }

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
    const supplierName = name || value;

    // Create fabric supplier in settings
    const item = await prisma.fabricSupplier.create({
      data: { name: supplierName, value: supplierName }
    });

    // Sync with contractors table
    try {
      await prisma.contractor.upsert({
        where: { name: supplierName },
        update: { isActive: true },
        create: {
          name: supplierName,
          type: 'FABRIC',
          isActive: true
        }
      });
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/fabric-suppliers/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const supplierName = name || value;

    // Get current fabric supplier
    const currentSupplier = await prisma.fabricSupplier.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!currentSupplier) {
      return res.status(404).json({ error: 'Fabric supplier not found' });
    }

    // Update fabric supplier
    const item = await prisma.fabricSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { name: supplierName, value: supplierName }
    });

    // Sync with contractors table
    try {
      // Update existing contractor or create new one
      await prisma.contractor.upsert({
        where: { name: supplierName },
        update: {
          name: supplierName,
          type: 'FABRIC',
          isActive: true
        },
        create: {
          name: supplierName,
          type: 'FABRIC',
          isActive: true
        }
      });

      // If name changed, deactivate old contractor entry
      if (currentSupplier.name !== supplierName) {
        const oldContractor = await prisma.contractor.findUnique({
          where: { name: currentSupplier.name }
        });
        if (oldContractor && oldContractor.type === 'FABRIC') {
          await prisma.contractor.update({
            where: { id: oldContractor.id },
            data: { isActive: false }
          });
        }
      }
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/fabric-suppliers/:id', async (req, res) => {
  try {
    // Get fabric supplier before deactivating
    const supplier = await prisma.fabricSupplier.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    // Deactivate fabric supplier
    await prisma.fabricSupplier.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });

    // Sync with contractors table
    if (supplier) {
      try {
        const contractor = await prisma.contractor.findUnique({
          where: { name: supplier.name }
        });
        if (contractor && contractor.type === 'FABRIC') {
          await prisma.contractor.update({
            where: { id: contractor.id },
            data: { isActive: false }
          });
        }
      } catch (syncError) {
        console.warn('Failed to sync with contractors table:', syncError.message);
      }
    }

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
    const washName = name || value;

    // Create stone wash in settings
    const item = await prisma.stoneWash.create({
      data: { name: washName, value: washName }
    });

    // Sync with contractors table
    try {
      await prisma.contractor.upsert({
        where: { name: washName },
        update: { isActive: true },
        create: {
          name: washName,
          type: 'STONE_WASH',
          isActive: true
        }
      });
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stone-washes/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const washName = name || value;

    // Get current stone wash
    const currentWash = await prisma.stoneWash.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!currentWash) {
      return res.status(404).json({ error: 'Stone wash not found' });
    }

    // Update stone wash
    const item = await prisma.stoneWash.update({
      where: { id: parseInt(req.params.id) },
      data: { name: washName, value: washName }
    });

    // Sync with contractors table
    try {
      // Update existing contractor or create new one
      await prisma.contractor.upsert({
        where: { name: washName },
        update: {
          name: washName,
          type: 'STONE_WASH',
          isActive: true
        },
        create: {
          name: washName,
          type: 'STONE_WASH',
          isActive: true
        }
      });

      // If name changed, deactivate old contractor entry
      if (currentWash.name !== washName) {
        const oldContractor = await prisma.contractor.findUnique({
          where: { name: currentWash.name }
        });
        if (oldContractor && oldContractor.type === 'STONE_WASH') {
          await prisma.contractor.update({
            where: { id: oldContractor.id },
            data: { isActive: false }
          });
        }
      }
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/stone-washes/:id', async (req, res) => {
  try {
    // Get stone wash before deactivating
    const wash = await prisma.stoneWash.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    // Deactivate stone wash
    await prisma.stoneWash.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });

    // Sync with contractors table
    if (wash) {
      try {
        const contractor = await prisma.contractor.findUnique({
          where: { name: wash.name }
        });
        if (contractor && contractor.type === 'STONE_WASH') {
          await prisma.contractor.update({
            where: { id: contractor.id },
            data: { isActive: false }
          });
        }
      } catch (syncError) {
        console.warn('Failed to sync with contractors table:', syncError.message);
      }
    }

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
    const packingName = name || value;

    // Create packing name in settings
    const item = await prisma.packingName.create({
      data: { name: packingName, value: packingName }
    });

    // Sync with contractors table
    try {
      await prisma.contractor.upsert({
        where: { name: packingName },
        update: { isActive: true },
        create: {
          name: packingName,
          type: 'PACKAGING',
          isActive: true
        }
      });
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/packing-names/:id', async (req, res) => {
  try {
    const { name, value } = req.body;
    const packingName = name || value;

    // Get current packing name
    const currentPacking = await prisma.packingName.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!currentPacking) {
      return res.status(404).json({ error: 'Packing name not found' });
    }

    // Update packing name
    const item = await prisma.packingName.update({
      where: { id: parseInt(req.params.id) },
      data: { name: packingName, value: packingName }
    });

    // Sync with contractors table
    try {
      // Update existing contractor or create new one
      await prisma.contractor.upsert({
        where: { name: packingName },
        update: {
          name: packingName,
          type: 'PACKAGING',
          isActive: true
        },
        create: {
          name: packingName,
          type: 'PACKAGING',
          isActive: true
        }
      });

      // If name changed, deactivate old contractor entry
      if (currentPacking.name !== packingName) {
        const oldContractor = await prisma.contractor.findUnique({
          where: { name: currentPacking.name }
        });
        if (oldContractor && oldContractor.type === 'PACKAGING') {
          await prisma.contractor.update({
            where: { id: oldContractor.id },
            data: { isActive: false }
          });
        }
      }
    } catch (syncError) {
      console.warn('Failed to sync with contractors table:', syncError.message);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/packing-names/:id', async (req, res) => {
  try {
    // Get packing name before deactivating
    const packing = await prisma.packingName.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    // Deactivate packing name
    await prisma.packingName.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false }
    });

    // Sync with contractors table
    if (packing) {
      try {
        const contractor = await prisma.contractor.findUnique({
          where: { name: packing.name }
        });
        if (contractor && contractor.type === 'PACKAGING') {
          await prisma.contractor.update({
            where: { id: contractor.id },
            data: { isActive: false }
          });
        }
      } catch (syncError) {
        console.warn('Failed to sync with contractors table:', syncError.message);
      }
    }

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
