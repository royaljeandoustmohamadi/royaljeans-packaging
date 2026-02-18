const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users (Admin/Manager only)
router.get('/', authenticateToken, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow users to view their own profile unless they're admin/manager
    if (req.user.role === 'USER' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'دسترسی غیرمجاز' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'خطا در دریافت کاربر' });
  }
});

// Update user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, isActive } = req.body;

    // Only allow users to update their own profile unless they're admin
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'دسترسی غیرمجاز' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // Only admin can change role and active status
    const updateData = { fullName };
    
    if (req.user.role === 'ADMIN') {
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email }
        });
        
        if (emailExists) {
          return res.status(400).json({ message: 'این ایمیل قبلاً استفاده شده است' });
        }
        updateData.email = email;
      }
      
      if (role) updateData.role = role;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'کاربر با موفقیت به‌روزرسانی شد',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی کاربر' });
  }
});

// Change password
router.put('/:id/password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Only allow users to change their own password unless they're admin
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'دسترسی غیرمجاز' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'رمز عبور فعلی و جدید اجباری است' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'رمز عبور جدید باید حداقل 6 کاراکتر باشد' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    // If not admin, verify current password
    if (req.user.role !== 'ADMIN') {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'رمز عبور فعلی اشتباه است' });
      }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword }
    });

    res.json({ message: 'رمز عبور با موفقیت تغییر کرد' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'خطا در تغییر رمز عبور' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, authorize('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'نمی‌توانید حساب خود را حذف کنید' });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'کاربر با موفقیت حذف شد' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'خطا در حذف کاربر' });
  }
});

module.exports = router;