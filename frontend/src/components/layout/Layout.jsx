import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Truck,
  BarChart2,
  Settings,
  Bell,
  Search,
  Activity,
  Wallet,
  Box,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { icon: LayoutDashboard, label: 'داشبورد', path: '/', badge: null },
  { icon: ShoppingBag, label: 'سفارشات', path: '/orders', badge: null },
  { icon: Package, label: 'محصولات', path: '/products', badge: null },
  { icon: Activity, label: 'گردش کار', path: '/workflow', badge: null },
  { icon: Box, label: 'انبارداری', path: '/inventory', badge: null },
  { icon: Truck, label: 'پیمانکاران', path: '/contractors', badge: null },
  { icon: Wallet, label: 'مالی', path: '/finance', badge: null },
  { icon: BarChart2, label: 'گزارشات', path: '/reports', badge: null },
];

const notifications = [
  {
    icon: AlertCircle,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.15)',
    msg: 'موجودی نخ دوخت زیر حد مجاز رسیده',
    time: '۵ دقیقه پیش',
  },
  {
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    msg: 'سفارش RJ-1021 تحویل داده شد',
    time: '۳۰ دقیقه پیش',
  },
  {
    icon: Clock,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    msg: 'سفارش RJ-1024 تاریخ تحویل امروز است',
    time: '۱ ساعت پیش',
  },
  {
    icon: TrendingUp,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    msg: 'گزارش ماهانه آماده شد',
    time: '۲ ساعت پیش',
  },
];

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: 'مدیر سیستم',
      MANAGER: 'مدیر تولید',
      PRODUCTION: 'مسئول تولید',
      WAREHOUSE: 'انباردار',
      SALES: 'کارشناس فروش',
      ACCOUNTANT: 'حسابدار',
    };
    return labels[role] || 'کاربر';
  };

  const getPageTitle = () => {
    const map = {
      '/': ['داشبورد', 'خلاصه وضعیت سیستم'],
      '/orders': ['سفارشات', 'مدیریت و پیگیری سفارشات'],
      '/products': ['محصولات', 'کاتالوگ و مدیریت محصولات'],
      '/workflow': ['گردش کار', 'رهگیری مراحل تولید'],
      '/inventory': ['انبارداری', 'مدیریت موجودی و انبار'],
      '/contractors': ['پیمانکاران', 'مدیریت و ارزیابی پیمانکاران'],
      '/finance': ['مالی', 'مدیریت پرداخت‌ها و مالی'],
      '/reports': ['گزارشات', 'گزارشات جامع سیستم'],
      '/profile': ['پروفایل', 'مدیریت حساب کاربری'],
      '/admin': ['مدیریت', 'تنظیمات سیستم'],
      '/admin/users': ['کاربران', 'مدیریت کاربران سیستم'],
    };
    const entry = Object.entries(map).find(([key]) =>
      key === '/' ? location.pathname === '/' : location.pathname.startsWith(key)
    );
    return entry ? entry[1] : ['صفحه', ''];
  };

  const [pageTitle, pageSubtitle] = getPageTitle();
  const userInitial = user?.firstName?.[0] || user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'var(--sidebar-w)',
          height: '100vh',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
        className={sidebarOpen ? 'sidebar-mobile-open' : ''}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 4px 15px rgba(245,158,11,0.35)',
              flexShrink: 0,
            }}
          >
            RJ
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
              Royal Jeans
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              سیستم مدیریت تولید — v1.0.1
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '12px 8px 6px',
              display: 'block',
            }}
          >
            منو اصلی
          </span>

          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  color: active ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: active
                    ? 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))'
                    : 'transparent',
                  fontSize: 13.5,
                  fontWeight: 500,
                  position: 'relative',
                  marginBottom: 2,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: '60%',
                      borderRadius: '0 3px 3px 0',
                      background: 'linear-gradient(to bottom, var(--accent-gold), var(--accent-red))',
                    }}
                  />
                )}
                <item.icon size={18} />
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      marginRight: 'auto',
                      background: 'var(--accent-gold)',
                      color: '#000',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 99,
                      minWidth: 20,
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}

          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 1,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              padding: '12px 8px 6px',
              display: 'block',
            }}
          >
            تنظیمات
          </span>

          {user?.role === 'ADMIN' && (
            <div
              onClick={() => navigate('/admin/users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'var(--transition)',
                color: 'var(--text-secondary)',
                fontSize: 13.5,
                fontWeight: 500,
                marginBottom: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-hover)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Users size={18} />
              مدیریت کاربران
            </div>
          )}

          <div
            onClick={() => navigate('/admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'var(--transition)',
              color: 'var(--text-secondary)',
              fontSize: 13.5,
              fontWeight: 500,
              marginBottom: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Settings size={18} />
            تنظیمات سیستم
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 12px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onClick={() => navigate('/profile')}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.displayName || user?.email}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {getRoleLabel(user?.role)}
              </div>
            </div>
            <LogOut
              size={14}
              style={{ color: 'var(--text-muted)', marginRight: 'auto', flexShrink: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}

      {/* Main */}
      <div
        style={{
          marginRight: 'var(--sidebar-w)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            height: 'var(--header-h)',
            background: 'rgba(11,15,26,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 16,
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <button
            style={{
              display: 'none',
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mobile-menu-btn"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              {pageTitle}
            </div>
            {pageSubtitle && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
                {pageSubtitle}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ marginRight: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={15}
              style={{ position: 'absolute', right: 12, color: 'var(--text-muted)' }}
            />
            <input
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 36px 8px 14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font)',
                fontSize: 13,
                width: 220,
                outline: 'none',
                transition: 'var(--transition)',
              }}
              placeholder="جستجو در سیستم..."
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-gold)';
                e.target.style.background = 'rgba(245,158,11,0.05)';
                e.target.style.width = '260px';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.background = 'rgba(255,255,255,0.05)';
                e.target.style.width = '220px';
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  position: 'relative',
                }}
                onClick={() => setShowNotif(!showNotif)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Bell size={16} />
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--accent-red)',
                    border: '2px solid var(--bg-primary)',
                  }}
                />
              </button>

              {showNotif && (
                <div
                  style={{
                    position: 'absolute',
                    top: 46,
                    left: 0,
                    width: 320,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.2s ease both',
                  }}
                >
                  <div
                    style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      اعلان‌ها
                    </span>
                    <span
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#f87171',
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 99,
                      }}
                    >
                      {notifications.length}
                    </span>
                  </div>
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 10,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                        borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 10,
                          background: n.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <n.icon size={16} color={n.color} />
                      </div>
                      <div>
                        <div
                          style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}
                        >
                          {n.msg}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                          {n.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div
              onClick={() => navigate('/profile')}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: 'white',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: '28px 24px',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav { transform: translateX(var(--sidebar-w)); }
          nav.sidebar-mobile-open { transform: translateX(0) !important; }
          [style*="margin-right: var(--sidebar-w)"] { margin-right: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default Layout;
