const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalQuantity = orders.reduce((sum, order) => sum + (order.totalCount || 0), 0);
    
    res.json({
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      totalQuantity,
      averageQuantity: totalOrders > 0 ? Math.round(totalQuantity / totalOrders) : 0,
      completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'خطا در دریافت آمار' });
  }
});

// Export orders to Excel
router.get('/excel/orders', async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let whereClause = {};
    
    if (startDate) {
      whereClause.date = { ...whereClause.date, gte: new Date(startDate) };
    }
    if (endDate) {
      whereClause.date = { ...whereClause.date, lte: new Date(endDate) };
    }
    if (status) {
      whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: { creator: { select: { displayName: true } } },
      orderBy: { date: 'desc' },
    });

    // Create Excel-compatible data
    const excelData = orders.map(order => ({
      'کد سفارش': order.code,
      'نام سفارش': order.name,
      'تاریخ': new Date(order.date).toLocaleDateString('fa-IR'),
      'تعداد کل': order.totalCount || 0,
      'تعداد بسته‌بندی': order.packingCount || 0,
      'نوع پارچه': order.fabric || '',
      'شستشو': order.stoneWash || '',
      'استایل': order.style || '',
      'تأمین‌کننده پارچه': order.fabricSupplier || '',
      'تأمین‌کننده تولید': order.productionSupplier || '',
      'موجودی پارچه': order.stockFabric || 0,
      'موجودی شستشو': order.stockWash || 0,
      'موجودی تولید': order.stockProduction || 0,
      'موجودی بسته‌بندی': order.stockPackaging || 0,
      'قابل فروش': order.saleableCount || 0,
      'ضایعات': order.waste || 0,
      'وضعیت': order.status === 'pending' ? 'در انتظار' :
                  order.status === 'processing' ? 'در حال پردازش' :
                  order.status === 'completed' ? 'تکمیل شده' : 'لغو شده',
      'ایجاد کننده': order.creator?.displayName || '',
      'تاریخ ایجاد': new Date(order.createdAt).toLocaleDateString('fa-IR'),
    }));

    res.json({
      success: true,
      data: excelData,
      count: excelData.length,
    });
  } catch (error) {
    console.error('Error exporting orders:', error);
    res.status(500).json({ message: 'خطا در خروجی گرفتن' });
  }
});

// Export inventory report
router.get('/excel/inventory', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' },
    });

    const excelData = orders.map(order => ({
      'کد سفارش': order.code,
      'نام': order.name,
      'پارچه': order.stockFabric || 0,
      'شستشو': order.stockWash || 0,
      'تولید': order.stockProduction || 0,
      'بسته‌بندی': order.stockPackaging || 0,
      'قابل فروش': order.saleableCount || 0,
      'شستشوی متفاوت': order.differentWash || 0,
      'ضایعات': order.waste || 0,
      'موجودی منفی': order.stockMinus || 0,
      'موجودی مثبت': order.stockPlus || 0,
      'بسته‌بندی منفی': order.stockPackagingMinus || 0,
    }));

    res.json({
      success: true,
      data: excelData,
      count: excelData.length,
    });
  } catch (error) {
    console.error('Error exporting inventory:', error);
    res.status(500).json({ message: 'خطا در خروجی گرفتن' });
  }
});

// Export contractors report
router.get('/excel/contractors', async (req, res) => {
  try {
    const contractors = await prisma.contractor.findMany({
      include: {
        evaluations: {
          include: { evaluator: { select: { displayName: true } } },
        },
      },
    });

    const excelData = contractors.map(contractor => {
      const avgRating = contractor.evaluations.length > 0
        ? (contractor.evaluations.reduce((sum, e) => sum + e.rating, 0) / contractor.evaluations.length).toFixed(1)
        : '-';
      
      const typeText = contractor.type === 'FABRIC' ? 'تأمین پارچه' :
                       contractor.type === 'PRODUCTION' ? 'تولید' :
                       contractor.type === 'PACKAGING' ? 'بسته‌بندی' :
                       contractor.type === 'STONE_WASH' ? 'شستشو' : contractor.type;

      return {
        'نام پیمانکار': contractor.name,
        'نوع': typeText,
        'شماره تماس': contractor.phone || '',
        'آدرس': contractor.address || '',
        'فعال': contractor.isActive ? 'بله' : 'خیر',
        'امتیاز میانگین': avgRating,
        'تعداد ارزیابی': contractor.evaluations.length,
        'یادداشت‌ها': contractor.notes || '',
      };
    });

    res.json({
      success: true,
      data: excelData,
      count: excelData.length,
    });
  } catch (error) {
    console.error('Error exporting contractors:', error);
    res.status(500).json({ message: 'خطا در خروجی گرفتن' });
  }
});

// Export summary report
router.get('/excel/summary', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const contractors = await prisma.contractor.findMany();
    const users = await prisma.user.findMany();

    // Order statistics by status
    const statusStats = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Contractor type statistics
    const contractorStats = contractors.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});

    const summaryData = [
      {
        'عنوان': 'آمار کلی',
        'مقدار': '',
      },
      {
        'عنوان': 'کل سفارشات',
        'مقدار': orders.length.toString(),
      },
      {
        'عنوان': 'کل پیمانکاران',
        'مقدار': contractors.length.toString(),
      },
      {
        'عنوان': 'کل کاربران',
        'مقدار': users.length.toString(),
      },
      {
        'عنوان': '',
        'مقدار': '',
      },
      {
        'عنوان': 'آمار سفارشات',
        'مقدار': '',
      },
      {
        'عنوان': 'در انتظار',
        'مقدار': statusStats.pending.toString(),
      },
      {
        'عنوان': 'در حال پردازش',
        'مقدار': statusStats.processing.toString(),
      },
      {
        'عنوان': 'تکمیل شده',
        'مقدار': statusStats.completed.toString(),
      },
      {
        'عنوان': 'لغو شده',
        'مقدار': statusStats.cancelled.toString(),
      },
      {
        'عنوان': '',
        'مقدار': '',
      },
      {
        'عنوان': 'آمار پیمانکاران',
        'مقدار': '',
      },
      {
        'عنوان': `تأمین پارچه (${contractorStats.FABRIC || 0})`,
        'مقدار': '',
      },
      {
        'عنوان': `تولید (${contractorStats.PRODUCTION || 0})`,
        'مقدار': '',
      },
      {
        'عنوان': `بسته‌بندی (${contractorStats.PACKAGING || 0})`,
        'مقدار': '',
      },
      {
        'عنوان': `شستشو (${contractorStats.STONE_WASH || 0})`,
        'مقدار': '',
      },
    ];

    res.json({
      success: true,
      data: summaryData,
      count: summaryData.length,
    });
  } catch (error) {
    console.error('Error exporting summary:', error);
    res.status(500).json({ message: 'خطا در خروجی گرفتن' });
  }
});

module.exports = router;