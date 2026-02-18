const express = require('express');
const prisma = require('../utils/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate required fields
    if (!orderData.code || !orderData.name || !orderData.date) {
      return res.status(400).json({ message: 'کد، نام و تاریخ سفارش اجباری است' });
    }

    // Check if order code already exists
    const existingOrder = await prisma.order.findUnique({
      where: { code: orderData.code }
    });

    if (existingOrder) {
      return res.status(400).json({ message: 'این کد سفارش قبلاً استفاده شده است' });
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        orderId: order.id,
        action: 'CREATE',
        entity: 'Order',
        changes: orderData,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(201).json({
      message: 'سفارش با موفقیت ایجاد شد',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'خطا در ایجاد سفارش' });
  }
});

// Get all orders with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      dateFrom,
      dateTo
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const where = {};
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'خطا در دریافت سفارشات' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        auditLogs: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'خطا در دریافت سفارش' });
  }
});

// Update order
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    // If updating code, check uniqueness
    if (updateData.code && updateData.code !== existingOrder.code) {
      const codeExists = await prisma.order.findUnique({
        where: { code: updateData.code }
      });
      
      if (codeExists) {
        return res.status(400).json({ message: 'این کد سفارش قبلاً استفاده شده است' });
      }
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        orderId: order.id,
        action: 'UPDATE',
        entity: 'Order',
        changes: updateData,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      message: 'سفارش با موفقیت به‌روزرسانی شد',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی سفارش' });
  }
});

// Delete order (Admin only)
router.delete('/:id', authenticateToken, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return res.status(404).json({ message: 'سفارش یافت نشد' });
    }

    await prisma.order.delete({
      where: { id: parseInt(id) }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE',
        entity: 'Order',
        changes: existingOrder,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({ message: 'سفارش با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'خطا در حذف سفارش' });
  }
});

module.exports = router;