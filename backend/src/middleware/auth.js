const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'توکن احراز هویت مورد نیاز است' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, fullName: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'کاربر معتبر نیست' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'توکن نامعتبر است' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'دسترسی غیرمجاز' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'شما دسترسی لازم برای این عملیات را ندارید' });
    }

    next();
  };
};

module.exports = { authenticateToken, authorize };