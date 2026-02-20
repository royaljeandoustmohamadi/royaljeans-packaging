import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Package, Plus } from 'lucide-react';

const inventoryItems = [
  {
    name: 'پارچه دنیم ۱۴ اونس',
    cat: 'پارچه',
    qty: 2840,
    unit: 'متر',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
    low: false,
  },
  {
    name: 'دکمه فلزی طلایی',
    cat: 'اتصالات',
    qty: 18500,
    unit: 'عدد',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    low: false,
  },
  {
    name: 'نخ دوخت آبی',
    cat: 'ملزومات',
    qty: 42,
    unit: 'قرقره',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.15)',
    low: true,
  },
  {
    name: 'پارچه دنیم ۱۲ اونس',
    cat: 'پارچه',
    qty: 1200,
    unit: 'متر',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    low: false,
  },
];

const weeklyData = [
  { d: 'شنبه', ورود: 1200, خروج: 800 },
  { d: 'یکشنبه', ورود: 900, خروج: 1100 },
  { d: 'دوشنبه', ورود: 1500, خروج: 700 },
  { d: 'سه‌شنبه', ورود: 600, خروج: 1300 },
  { d: 'چهارشنبه', ورود: 1100, خروج: 900 },
  { d: 'پنجشنبه', ورود: 800, خروج: 600 },
];

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

const Card = ({ children, style }) => (
  <div
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {children}
  </div>
);

const InventoryPage = () => {
  const statCards = [
    {
      label: 'کل موجودی پارچه',
      val: '۴,۰۴۰ متر',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.15)',
    },
    {
      label: 'اقلام زیر حد مجاز',
      val: '۳ قلم',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.15)',
    },
    {
      label: 'ارزش کل انبار',
      val: '۲.۱B تومان',
      color: '#10b981',
      bg: 'rgba(16,185,129,0.15)',
    },
  ];

  return (
    <div>
      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <Card
            key={i}
            className="animate-fadeUp"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Box size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
                  {s.val}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div
        className="animate-fadeUp delay-2"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
      >
        {/* Materials List */}
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 20px 0',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              موجودی مواد اولیه
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
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white',
                border: 'none',
              }}
            >
              <Plus size={12} /> ورود کالا
            </button>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            {inventoryItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom:
                    i < inventoryItems.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: item.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Package size={16} color={item.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.cat}</div>
                </div>
                {item.low && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background: 'rgba(239,68,68,0.15)',
                      color: '#f87171',
                    }}
                  >
                    کم موجود
                  </span>
                )}
                <div style={{ textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: item.low ? 'var(--accent-red)' : 'var(--text-primary)',
                    }}
                  >
                    {item.qty.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.unit}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Chart */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              گردش انبار — هفته جاری
            </div>
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            <ResponsiveContainer width="100%" height={260}>
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
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="ورود" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="خروج" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InventoryPage;
