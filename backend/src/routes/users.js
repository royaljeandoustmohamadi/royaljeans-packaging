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
        displayName: true,
        nickname: true,
        avatar: true,
        phone: true,
        bio: true,
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
        displayName: true,
        nickname: true,
        avatar: true,
        phone: true,
        bio: true,
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
    const { displayName, nickname, avatar, phone, bio, role, isActive } = req.body;

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

    // Build update data based on user role
    const updateData = {};

    // Non-admin users can only update their own editable fields (not email, role, isActive)
    if (req.user.role !== 'ADMIN') {
      if (nickname !== undefined) updateData.nickname = nickname;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (phone !== undefined) updateData.phone = phone;
      if (bio !== undefined) updateData.bio = bio;
    } else {
      // Admin can update all fields
      if (displayName !== undefined) updateData.displayName = displayName;
      if (nickname !== undefined) updateData.nickname = nickname;
      if (avatar !== undefined) updateData.avatar = avatar;
      if (phone !== undefined) updateData.phone = phone;
      if (bio !== undefined) updateData.bio = bio;
      if (role) updateData.role = role;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        nickname: true,
        avatar: true,
        phone: true,
        bio: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'خطا در به‌روزرسانی پروفایل' });
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