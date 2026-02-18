const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all contractors
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const where = {};
    if (type) where.type = type;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const contractors = await prisma.contractor.findMany({
      where,
      include: {
        evaluations: {
          include: {
            evaluator: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            evaluations: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ contractors });
  } catch (error) {
    console.error('Get contractors error:', error);
    res.status(500).json({ message: 'خطا در دریافت پیمانکاران' });
  }
});

// Create contractor
router.post('/', authenticateToken, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { name, type, phone, address, notes } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'نام و نوع پیمانکار اجباری است' });
    }

    const validTypes = ['FABRIC', 'PRODUCTION', 'PACKAGING', 'STONE_WASH'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'نوع پیمانکار نامعتبر است' });
    }

    // Check if contractor name already exists
    const existingContractor = await prisma.contractor.findUnique({
      where: { name }
    });

    if (existingContractor) {
      return res.status(400).json({ message: 'این نام پیمانکار قبلاً استفاده شده است' });
    }

    const contractor = await prisma.contractor.create({
      data: {
        name,
        type,
        phone,
        address,
        notes
      }
    });

    res.status(201).json({
      message: 'پیمانکار با موفقیت ایجاد شد',
      contractor
    });
  } catch (error) {
    console.error('Create contractor error:', error);
    res.status(500).json({ message: 'خطا در ایجاد پیمانکار' });
  }
});

// Get contractor by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) },
      include: {
        evaluations: {
          include: {
            evaluator: {
              select: {
                id: true,
                fullName: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            evaluations: true
          }
        }
      }
    });

    if (!contractor) {
      return res.status(404).json({ message: 'پیمانکار یافت نشد' });
    }

    res.json({ contractor });
  } catch (error) {
    console.error('Get contractor error:', error);
    res.status(500).json({ message: 'خطا در دریافت پیمانکار' });
  }
});

// Update contractor
router.put('/:id', authenticateToken, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, phone, address, notes, isActive } = req.body;

    // Check if contractor exists
    const existingContractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingContractor) {
      return res.status(404).json({ message: 'پیمانکار یافت نشد' });
    }

    // If updating name, check uniqueness
    if (name && name !== existingContractor.name) {
      const nameExists = await prisma.contractor.findUnique({
        where: { name }
      });
      
      if (nameExists) {
        return res.status(400).json({ message: 'این نام پیمانکار قبلاً استفاده شده است' });
      }
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['FABRIC', 'PRODUCTION', 'PACKAGING', 'STONE_WASH'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'نوع پیمانکار نامعتبر است' });
      }
    }

    const contractor = await prisma.contractor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
        phone,
        address,
        notes,
        isActive
      }
    });

    res.json({
      message: 'پیمانکار با موفقیت به‌روزرسانی شد',
      contractor
    });
  } catch (error) {
    console.error('Update contractor error:', error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی پیمانکار' });
  }
});

// Delete contractor
router.delete('/:id', authenticateToken, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) }
    });

    if (!contractor) {
      return res.status(404).json({ message: 'پیمانکار یافت نشد' });
    }

    await prisma.contractor.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'پیمانکار با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete contractor error:', error);
    res.status(500).json({ message: 'خطا در حذف پیمانکار' });
  }
});

// Create contractor evaluation
router.post('/:id/evaluations', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, quality, timing, price, cooperation, comments } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'امتیاز کلی باید بین 1 تا 5 باشد' });
    }

    // Check if contractor exists
    const contractor = await prisma.contractor.findUnique({
      where: { id: parseInt(id) }
    });

    if (!contractor) {
      return res.status(404).json({ message: 'پیمانکار یافت نشد' });
    }

    const evaluation = await prisma.contractorEvaluation.create({
      data: {
        contractorId: parseInt(id),
        evaluatedBy: req.user.id,
        rating,
        quality,
        timing,
        price,
        cooperation,
        comments
      },
      include: {
        evaluator: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        contractor: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'ارزیابی با موفقیت ثبت شد',
      evaluation
    });
  } catch (error) {
    console.error('Create evaluation error:', error);
    res.status(500).json({ message: 'خطا در ثبت ارزیابی' });
  }
});

// Get contractor evaluations
router.get('/:id/evaluations', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [evaluations, total] = await Promise.all([
      prisma.contractorEvaluation.findMany({
        where: { contractorId: parseInt(id) },
        skip,
        take: parseInt(limit),
        include: {
          evaluator: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contractorEvaluation.count({
        where: { contractorId: parseInt(id) }
      })
    ]);

    res.json({
      evaluations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get evaluations error:', error);
    res.status(500).json({ message: 'خطا در دریافت ارزیابی‌ها' });
  }
});

module.exports = router;