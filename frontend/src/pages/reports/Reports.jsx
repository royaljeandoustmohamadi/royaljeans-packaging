import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Download,
  Filter,
  Package,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import ordersService from '../../services/orders.service';
import contractorsService from '../../services/contractors.service';
import api from '../../services/api';

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

const statusMap = {
  pending: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  in_progress: { label: 'در حال تولید', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  processing: { label: 'در حال پردازش', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  completed: { label: 'تکمیل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  cancelled: { label: 'لغو شده', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  PENDING: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  IN_PROGRESS: { label: 'در حال تولید', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  DELIVERED: { label: 'تحویل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  CANCELLED: { label: 'لغو شده', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', status: '' });

  useEffect(() => {
    loadInitialData();
    loadStatistics();
  }, []);

  const loadInitialData = async () => {
    try {
      await contractorsService.getAll();
    } catch (_e) {
      // ignore
    }
  };

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const r = await ordersService.getAll({ limit: 1000 });
      const orders = r.orders || [];
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (o) => o.status === 'pending' || o.status === 'PENDING'
      ).length;
      const processingOrders = orders.filter(
        (o) =>
          o.status === 'processing' ||
          o.status === 'in_progress' ||
          o.status === 'IN_PROGRESS'
      ).length;
      const completedOrders = orders.filter(
        (o) => o.status === 'completed' || o.status === 'DELIVERED'
      ).length;
      const totalQuantity = orders.reduce((s, o) => s + (o.totalCount || o.quantity || 0), 0);
      const averageQuantity = totalOrders > 0 ? Math.round(totalQuantity / totalOrders) : 0;
      setReportData({
        orders,
        statistics: {
          totalOrders,
          pendingOrders,
          processingOrders,
          completedOrders,
          totalQuantity,
          averageQuantity,
          completionRate:
            totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
        },
      });
    } catch (_e) {
      setReportData(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const exportToExcel = async (type) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      const response = await api.get(`/reports/excel/${type}?${params.toString()}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (_e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const { statistics = {}, orders = [] } = reportData || {};

  const filteredOrders = orders.filter((o) => {
    if (filters.startDate && new Date(o.orderDate || o.date) < new Date(filters.startDate))
      return false;
    if (filters.endDate && new Date(o.orderDate || o.date) > new Date(filters.endDate))
      return false;
    if (filters.status && o.status !== filters.status) return false;
    return true;
  });

  const monthlyData = [
    { name: 'فروردین', سفارشات: 42 },
    { name: 'اردیبهشت', سفارشات: 58 },
    { name: 'خرداد', سفارشات: 47 },
    { name: 'تیر', سفارشات: 73 },
    { name: 'مرداد', سفارشات: 68 },
    { name: 'شهریور', سفارشات: statistics.totalOrders || 89 },
  ];

  const statItems = [
    {
      label: 'کل سفارشات',
      value: statistics.totalOrders || 0,
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.15)',
      icon: Package,
    },
    {
      label: 'تکمیل شده',
      value: statistics.completedOrders || 0,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.15)',
      icon: CheckCircle,
    },
    {
      label: 'کل تولید',
      value: (statistics.totalQuantity || 0).toLocaleString(),
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,0.15)',
      icon: TrendingUp,
    },
    {
      label: 'در انتظار',
      value: statistics.pendingOrders || 0,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.15)',
      icon: Clock,
    },
  ];

  if (statsLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent-gold)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
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
        <div />
        <button
          onClick={() => exportToExcel('orders')}
          disabled={loading}
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
            opacity: loading ? 0.7 : 1,
          }}
        >
          <Download size={13} /> خروجی Excel
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {statItems.map((s, i) => (
          <Card key={i} className="animate-fadeUp" style={{ animationDelay: `${i * 0.05}s` }}>
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
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <s.icon size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart + Filters */}
      <div
        className="animate-fadeUp delay-2"
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}
      >
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              نمودار ماهانه سفارشات
            </div>
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />
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
                <Bar dataKey="سفارشات" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Filters */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              <Filter size={16} color="var(--accent-gold)" /> فیلترها
            </div>
          </div>
          <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'تاریخ شروع', field: 'startDate', type: 'date' },
              { label: 'تاریخ پایان', field: 'endDate', type: 'date' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  {label}
                </div>
                <input
                  type={type}
                  value={filters[field]}
                  onChange={(e) => handleFilterChange(field, e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                وضعیت
              </div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(17,24,39,0.9)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font)',
                  fontSize: 13,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ background: '#111827' }}>
                  همه وضعیت‌ها
                </option>
                <option value="pending" style={{ background: '#111827' }}>
                  در انتظار
                </option>
                <option value="processing" style={{ background: '#111827' }}>
                  در حال پردازش
                </option>
                <option value="completed" style={{ background: '#111827' }}>
                  تکمیل شده
                </option>
                <option value="cancelled" style={{ background: '#111827' }}>
                  لغو شده
                </option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={() => setFilters({ startDate: '', endDate: '', status: '' })}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                پاک کردن
              </button>
              <button
                onClick={loadStatistics}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white',
                  border: 'none',
                }}
              >
                اعمال
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="animate-fadeUp delay-3">
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            آخرین سفارشات
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {filteredOrders.length} سفارش
          </div>
        </div>
        <div style={{ padding: '8px 0 0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['کد سفارش', 'مشتری', 'تاریخ', 'تعداد', 'وضعیت', 'پیمانکار'].map((h) => (
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '48px 16px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: 14,
                    }}
                  >
                    <Package size={48} style={{ margin: '0 auto 8px', display: 'block', color: 'var(--text-muted)' }} />
                    هیچ سفارشی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredOrders.slice(0, 10).map((o) => {
                  const status = statusMap[o.status] || statusMap['pending'];
                  return (
                    <tr key={o.id}>
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
                        }}
                      >
                        {o.customerName || o.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {new Date(o.orderDate || o.date || o.createdAt).toLocaleDateString(
                          'fa-IR'
                        )}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                        }}
                      >
                        {o.totalCount || o.quantity || 0}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '4px 10px',
                            borderRadius: 99,
                            fontSize: 11,
                            fontWeight: 600,
                            background: status.bg,
                            color: status.color,
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
                          {status.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {o.fabricSupplier || o.productionSupplier || o.contractor?.name || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Buttons */}
      <div
        className="animate-fadeUp delay-4"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginTop: 20,
        }}
      >
        {[
          { label: 'گزارش موجودی', type: 'inventory', color: '#3b82f6' },
          { label: 'گزارش پیمانکاران', type: 'contractors', color: '#10b981' },
          { label: 'خلاصه عملکرد', type: 'summary', color: '#8b5cf6' },
        ].map(({ label, type, color }) => (
          <button
            key={type}
            onClick={() => exportToExcel(type)}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: 'var(--bg-card)',
              color: color,
              border: `1px solid ${color}30`,
              transition: 'var(--transition)',
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <Download size={14} /> {label}
          </button>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Reports;
