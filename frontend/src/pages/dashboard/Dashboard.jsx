import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShoppingBag,
  Package,
  Truck,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Download,
} from 'lucide-react';
import ordersService from '../../services/orders.service';
import contractorsService from '../../services/contractors.service';

const chartData = [
  { name: 'فروردین', سفارشات: 42, تولید: 38 },
  { name: 'اردیبهشت', سفارشات: 58, تولید: 52 },
  { name: 'خرداد', سفارشات: 47, تولید: 45 },
  { name: 'تیر', سفارشات: 73, تولید: 65 },
  { name: 'مرداد', سفارشات: 68, تولید: 70 },
  { name: 'شهریور', سفارشات: 89, تولید: 82 },
];

const pieData = [
  { name: 'سالم', value: 52, color: '#10b981' },
  { name: 'اقتصادی', value: 28, color: '#3b82f6' },
  { name: 'نمونه', value: 12, color: '#8b5cf6' },
  { name: 'استوک', value: 8, color: '#f59e0b' },
];

const weeklyData = [
  { d: 'ش', v: 820 },
  { d: 'ی', v: 650 },
  { d: 'د', v: 910 },
  { d: 'س', v: 780 },
  { d: 'چ', v: 1020 },
  { d: 'پ', v: 880 },
  { d: 'ج', v: 340 },
];

const statusMap = {
  PENDING: { label: 'در انتظار', cls: 'badge-gray' },
  CONFIRMED: { label: 'تایید شده', cls: 'badge-blue' },
  IN_PROGRESS: { label: 'در حال تولید', cls: 'badge-yellow' },
  READY: { label: 'آماده تحویل', cls: 'badge-purple' },
  DELIVERED: { label: 'تحویل شده', cls: 'badge-green' },
  CANCELLED: { label: 'لغو شده', cls: 'badge-red' },
  pending: { label: 'در انتظار', cls: 'badge-gray' },
  in_progress: { label: 'در حال تولید', cls: 'badge-yellow' },
  processing: { label: 'در حال پردازش', cls: 'badge-yellow' },
  completed: { label: 'تکمیل شده', cls: 'badge-green' },
  cancelled: { label: 'لغو شده', cls: 'badge-red' },
};

const priorityMap = {
  URGENT: { label: 'فوری', color: '#f87171' },
  HIGH: { label: 'بالا', color: '#fbbf24' },
  NORMAL: { label: 'عادی', color: '#60a5fa' },
  LOW: { label: 'پایین', color: 'var(--text-muted)' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(17,24,39,0.95)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '10px 14px',
        fontFamily: 'var(--font)',
      }}
    >
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 14, fontWeight: 700, color: p.color }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const Badge = ({ cls, children }) => {
  const styles = {
    'badge-gray': { background: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
    'badge-blue': { background: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    'badge-yellow': { background: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    'badge-purple': { background: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    'badge-green': { background: 'rgba(16,185,129,0.15)', color: '#34d399' },
    'badge-red': { background: 'rgba(239,68,68,0.15)', color: '#f87171' },
  };
  const s = styles[cls] || styles['badge-gray'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        ...s,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
        }}
      />
      {children}
    </span>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalContractors: 0,
    activeContractors: 0,
    totalQuantity: 0,
    completionRate: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [progWidths, setProgWidths] = useState([0, 0, 0, 0]);

  useEffect(() => {
    fetchStats();
    setTimeout(() => setProgWidths([78, 62, 91, 45]), 600);
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResponse, contractorsResponse] = await Promise.all([
        ordersService.getAll({ limit: 100 }),
        contractorsService.getAll(),
      ]);

      const orders = ordersResponse.orders || [];
      const contractors = contractorsResponse.contractors || [];

      const pending = orders.filter(
        (o) => o.status === 'pending' || o.status === 'PENDING'
      ).length;
      const processing = orders.filter(
        (o) =>
          o.status === 'processing' ||
          o.status === 'in_progress' ||
          o.status === 'IN_PROGRESS' ||
          o.status === 'CONFIRMED'
      ).length;
      const completed = orders.filter(
        (o) => o.status === 'completed' || o.status === 'DELIVERED' || o.status === 'READY'
      ).length;
      const totalQuantity = orders.reduce((sum, o) => sum + (o.totalCount || o.quantity || 0), 0);
      const completionRate =
        orders.length > 0 ? Math.round((completed / orders.length) * 100) : 0;
      const activeContractors = contractors.filter((c) => c.isActive).length;

      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        processingOrders: processing,
        completedOrders: completed,
        totalContractors: contractors.length,
        activeContractors,
        totalQuantity,
        completionRate,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (_e) {
      // use fallback data
    }
  };

  const statCards = [
    {
      cls: 'stat-card-1',
      icon: ShoppingBag,
      iconBg: 'rgba(59,130,246,0.2)',
      iconColor: '#60a5fa',
      value: stats.totalOrders.toLocaleString('fa-IR'),
      label: 'کل سفارشات',
      change: '+۱۲٪',
      up: true,
    },
    {
      cls: 'stat-card-2',
      icon: Package,
      iconBg: 'rgba(16,185,129,0.2)',
      iconColor: '#34d399',
      value: stats.totalQuantity.toLocaleString('fa-IR'),
      label: 'محصول تولید شده',
      change: '+۸٪',
      up: true,
    },
    {
      cls: 'stat-card-3',
      icon: Truck,
      iconBg: 'rgba(139,92,246,0.2)',
      iconColor: '#a78bfa',
      value: stats.activeContractors,
      label: 'پیمانکار فعال',
      change: stats.totalContractors > 0 ? `از ${stats.totalContractors}` : '—',
      up: true,
    },
    {
      cls: 'stat-card-4',
      icon: Wallet,
      iconBg: 'rgba(245,158,11,0.2)',
      iconColor: '#fbbf24',
      value: `${stats.completionRate}٪`,
      label: 'نرخ تکمیل سفارشات',
      change: '+۲۳٪',
      up: true,
    },
  ];

  return (
    <div>
      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((s, i) => (
          <div
            key={i}
            className={`animate-fadeUp delay-${i + 1}`}
            style={{
              borderRadius: 'var(--radius)',
              padding: 20,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              ...(s.cls === 'stat-card-1' && {
                background: 'linear-gradient(135deg, #1e3a5f, #1a2744)',
                border: '1px solid rgba(59,130,246,0.2)',
              }),
              ...(s.cls === 'stat-card-2' && {
                background: 'linear-gradient(135deg, #1a2e1e, #152018)',
                border: '1px solid rgba(16,185,129,0.2)',
              }),
              ...(s.cls === 'stat-card-3' && {
                background: 'linear-gradient(135deg, #2d1a3e, #1f1228)',
                border: '1px solid rgba(139,92,246,0.2)',
              }),
              ...(s.cls === 'stat-card-4' && {
                background: 'linear-gradient(135deg, #3b1f0a, #2a1508)',
                border: '1px solid rgba(245,158,11,0.2)',
              }),
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: s.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <s.icon size={20} color={s.iconColor} />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>
              {s.label}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                marginTop: 10,
                color: s.up ? 'var(--accent-green)' : 'var(--accent-red)',
              }}
            >
              {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div
        className="animate-fadeUp delay-3"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Area Chart */}
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px 0',
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                روند سفارشات و تولید
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                ۶ ماه گذشته
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                ماهانه
              </div>
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                <Download size={13} />
              </button>
            </div>
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gSfr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gTol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Vazirmatn' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="سفارشات"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#gSfr)"
                />
                <Area
                  type="monotone"
                  dataKey="تولید"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#gTol)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              {[
                ['#f59e0b', 'سفارشات'],
                ['#3b82f6', 'تولید'],
              ].map(([c, l]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div
                    style={{ width: 10, height: 10, borderRadius: 3, background: c }}
                  />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              توزیع دسته‌بندی
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              کیفیت محصولات
            </div>
          </div>
          <div
            style={{
              padding: '16px 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx={75}
                cy={75}
                innerRadius={50}
                outerRadius={72}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
            <div style={{ width: '100%', marginTop: 8 }}>
              {pieData.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: d.color,
                      }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.value}٪</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        className="animate-fadeUp delay-4"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
      >
        {/* Recent Orders */}
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px 0',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              سفارشات اخیر
            </div>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              مشاهده همه <ChevronRight size={12} />
            </button>
          </div>
          <div style={{ padding: '8px 0 0' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['کد', 'مشتری', 'وضعیت', 'اولویت'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'right',
                          fontSize: 11,
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          padding: '10px 16px',
                          borderBottom: '1px solid var(--border)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: '24px 16px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          fontSize: 13,
                        }}
                      >
                        داده‌ای یافت نشد
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((o) => {
                      const statusKey = o.status?.toUpperCase() || o.status;
                      const sm = statusMap[statusKey] || statusMap[o.status] || statusMap['pending'];
                      const pm = priorityMap[o.priority?.toUpperCase()] || priorityMap['NORMAL'];
                      return (
                        <tr
                          key={o.id}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.querySelectorAll('td').forEach(
                              (td) => (td.style.background = 'var(--bg-hover)')
                            );
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.querySelectorAll('td').forEach(
                              (td) => (td.style.background = 'transparent')
                            );
                          }}
                        >
                          <td
                            style={{
                              padding: '13px 16px',
                              fontSize: 13,
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              fontWeight: 700,
                              color: 'var(--accent-gold)',
                            }}
                          >
                            {o.orderNumber || o.code || `#${o.id}`}
                          </td>
                          <td
                            style={{
                              padding: '13px 16px',
                              fontSize: 13,
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              color: 'var(--text-primary)',
                              fontWeight: 500,
                            }}
                          >
                            {(o.customerName || o.name || '').substring(0, 12)}
                            {(o.customerName || o.name || '').length > 12 ? '...' : ''}
                          </td>
                          <td
                            style={{
                              padding: '13px 16px',
                              fontSize: 13,
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                            }}
                          >
                            <Badge cls={sm.cls}>{sm.label}</Badge>
                          </td>
                          <td
                            style={{
                              padding: '13px 16px',
                              fontSize: 13,
                              borderBottom: '1px solid rgba(255,255,255,0.03)',
                              color: pm.color,
                              fontWeight: 600,
                            }}
                          >
                            {pm.label}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Production Lines Progress */}
          <div
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              flex: 1,
            }}
          >
            <div style={{ padding: '18px 20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                پیشرفت خطوط تولید
              </div>
            </div>
            <div style={{ padding: '16px 20px 20px' }}>
              {[
                { name: 'خط تولید A', pct: progWidths[0], color: '#f59e0b' },
                { name: 'خط تولید B', pct: progWidths[1], color: '#3b82f6' },
                { name: 'خط تولید C', pct: progWidths[2], color: '#10b981' },
                { name: 'خط تولید D', pct: progWidths[3], color: '#8b5cf6' },
              ].map((p) => (
                <div key={p.name} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>
                      {p.pct}٪
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${p.pct}%`,
                        borderRadius: 99,
                        background: `linear-gradient(to left, ${p.color}, ${p.color}88)`,
                        transition: 'width 1s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Bar Chart */}
          <div
            style={{
              background: 'var(--bg-card)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              flex: 1,
            }}
          >
            <div style={{ padding: '18px 20px 0' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                تولید هفتگی
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                این هفته
              </div>
            </div>
            <div style={{ padding: '8px 16px 16px' }}>
              <ResponsiveContainer width="100%" height={110}>
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="d"
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Vazirmatn' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="v"
                    name="تعداد"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    background={{ fill: 'rgba(255,255,255,0.02)', radius: [4, 4, 0, 0] }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
