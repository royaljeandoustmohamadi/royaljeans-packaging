import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const paymentData = [
  { month: 'فروردین', پرداخت: 42000000, دریافت: 68000000 },
  { month: 'اردیبهشت', پرداخت: 55000000, دریافت: 72000000 },
  { month: 'خرداد', پرداخت: 38000000, دریافت: 58000000 },
  { month: 'تیر', پرداخت: 63000000, دریافت: 89000000 },
  { month: 'مرداد', پرداخت: 71000000, دریافت: 95000000 },
  { month: 'شهریور', پرداخت: 48000000, دریافت: 82000000 },
];

const recentPayments = [
  { id: 1, order: 'RJ-1024', contractor: 'تولیدی برادران احمدی', amount: 12500000, type: 'TRANSFER', status: 'PAID', date: '۱۴۰۳/۰۶/۲۰' },
  { id: 2, order: 'RJ-1022', contractor: 'پارچه‌فروشی رضوی', amount: 32000000, type: 'CHECK', status: 'PENDING', date: '۱۴۰۳/۰۶/۱۸' },
  { id: 3, order: 'RJ-1021', contractor: 'سنگشویی صادقی', amount: 8700000, type: 'CASH', status: 'PAID', date: '۱۴۰۳/۰۶/۱۵' },
  { id: 4, order: 'RJ-1020', contractor: 'تولیدی شریفی', amount: 22000000, type: 'TRANSFER', status: 'PAID', date: '۱۴۰۳/۰۶/۱۲' },
  { id: 5, order: 'RJ-1019', contractor: 'بسته‌بندی کریمی', amount: 6500000, type: 'CHECK', status: 'BOUNCED', date: '۱۴۰۳/۰۶/۱۰' },
];

const paymentTypeMap = {
  CASH: { label: 'نقدی', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  CHECK: { label: 'چک', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  TRANSFER: { label: 'انتقال', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  CARD: { label: 'کارت', color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  CREDIT: { label: 'اعتباری', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
};

const paymentStatusMap = {
  PAID: { label: 'پرداخت شده', color: '#34d399', bg: 'rgba(16,185,129,0.15)', icon: CheckCircle },
  PENDING: { label: 'در انتظار', color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', icon: Clock },
  BOUNCED: { label: 'برگشتی', color: '#f87171', bg: 'rgba(239,68,68,0.15)', icon: AlertCircle },
  CANCELLED: { label: 'لغو شده', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: AlertCircle },
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
        <div key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
          {p.name}: {(p.value / 1000000).toFixed(1)} میلیون
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

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { value: 'overview', label: 'خلاصه' },
    { value: 'payments', label: 'پرداخت‌ها' },
    { value: 'checks', label: 'چک‌ها' },
  ];

  const statCards = [
    {
      label: 'کل دریافتی این ماه',
      value: '۸۲ میلیون تومان',
      change: '+۱۲٪',
      up: true,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.15)',
      icon: TrendingUp,
    },
    {
      label: 'کل پرداختی این ماه',
      value: '۴۸ میلیون تومان',
      change: '-۸٪',
      up: false,
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.15)',
      icon: TrendingDown,
    },
    {
      label: 'چک‌های در انتظار',
      value: '۳ فقره',
      change: '۳۲ میلیون تومان',
      up: null,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.15)',
      icon: Clock,
    },
    {
      label: 'مانده حساب',
      value: '۳۴ میلیون تومان',
      change: 'سود خالص',
      up: true,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.15)',
      icon: Wallet,
    },
  ];

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 4,
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
          }}
        >
          {tabs.map((t) => (
            <div
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'var(--transition)',
                color: activeTab === t.value ? 'var(--text-primary)' : 'var(--text-muted)',
                background: activeTab === t.value ? 'var(--bg-secondary)' : 'transparent',
                fontWeight: activeTab === t.value ? 600 : 400,
                boxShadow: activeTab === t.value ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 16px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px rgba(245,158,11,0.3)',
          }}
        >
          <Plus size={13} /> ثبت پرداخت
        </button>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {statCards.map((s, i) => (
          <Card key={i} className="animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: s.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <s.icon size={18} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color:
                    s.up === true
                      ? 'var(--accent-green)'
                      : s.up === false
                      ? 'var(--accent-red)'
                      : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {s.up === true ? <TrendingUp size={11} /> : s.up === false ? <TrendingDown size={11} /> : null}
                {s.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Payments */}
      <div
        className="animate-fadeUp delay-2"
        style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 20 }}
      >
        {/* Chart */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              نمودار جریان مالی
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              ۶ ماه گذشته
            </div>
          </div>
          <div style={{ padding: '8px 16px 20px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paymentData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Vazirmatn' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="دریافت" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="پرداخت" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {[['#10b981', 'دریافتی'], ['#ef4444', 'پرداختی']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              توزیع نوع پرداخت
            </div>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            {[
              { type: 'TRANSFER', pct: 48 },
              { type: 'CHECK', pct: 32 },
              { type: 'CASH', pct: 12 },
              { type: 'CARD', pct: 8 },
            ].map(({ type, pct }) => {
              const t = paymentTypeMap[type];
              return (
                <div key={type} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '3px 8px',
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                        background: t.bg,
                        color: t.color,
                      }}
                    >
                      {t.label}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{pct}٪</span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 99,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        borderRadius: 99,
                        background: t.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Payments Table */}
      <Card className="animate-fadeUp delay-3">
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            آخرین تراکنش‌ها
          </div>
        </div>
        <div style={{ padding: '8px 0 0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['کد سفارش', 'پیمانکار', 'مبلغ', 'نوع', 'وضعیت', 'تاریخ'].map((h) => (
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
              {recentPayments.map((p) => {
                const typeInfo = paymentTypeMap[p.type];
                const statusInfo = paymentStatusMap[p.status];
                return (
                  <tr
                    key={p.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) =>
                      e.currentTarget.querySelectorAll('td').forEach((td) => (td.style.background = 'var(--bg-hover)'))
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.querySelectorAll('td').forEach((td) => (td.style.background = 'transparent'))
                    }
                  >
                    <td style={{ padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 700, color: 'var(--accent-gold)' }}>
                      {p.order}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-primary)' }}>
                      {p.contractor}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: 700, color: 'var(--accent-green)' }}>
                      {p.amount.toLocaleString('fa-IR')} تومان
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: typeInfo.bg, color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: statusInfo.bg, color: statusInfo.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      {p.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FinancePage;
