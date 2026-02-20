import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit2,
  MoreVertical,
} from 'lucide-react';
import ordersService from '../../services/orders.service';

const statusMap = {
  PENDING: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  CONFIRMED: { label: 'تایید شده', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  IN_PROGRESS: { label: 'در حال تولید', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  READY: { label: 'آماده تحویل', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  DELIVERED: { label: 'تحویل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  CANCELLED: { label: 'لغو شده', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  pending: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  in_progress: { label: 'در حال تولید', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  processing: { label: 'در حال پردازش', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  completed: { label: 'تکمیل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  cancelled: { label: 'لغو شده', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};

const priorityMap = {
  URGENT: { label: 'فوری', color: '#f87171' },
  HIGH: { label: 'بالا', color: '#fbbf24' },
  NORMAL: { label: 'عادی', color: '#60a5fa' },
  LOW: { label: 'پایین', color: '#475569' },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status?.toUpperCase()] || statusMap[status] || statusMap['PENDING'];
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
        background: s.bg,
        color: s.color,
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
      {s.label}
    </span>
  );
};

const tabs = [
  { value: 'all', label: 'همه' },
  { value: 'active', label: 'فعال' },
  { value: 'pending', label: 'در انتظار' },
  { value: 'done', label: 'تحویل شده' },
];

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAll();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      try {
        await ordersService.delete(id);
        setOrders(orders.filter((o) => o.id !== id));
      } catch {
        alert('خطا در حذف سفارش');
      }
    }
  };

  const filterByTab = (order) => {
    const status = order.status?.toUpperCase() || order.status || '';
    switch (activeTab) {
      case 'active':
        return ['IN_PROGRESS', 'CONFIRMED', 'READY', 'processing', 'in_progress'].includes(
          status
        );
      case 'pending':
        return ['PENDING', 'pending'].includes(status);
      case 'done':
        return ['DELIVERED', 'completed'].includes(status);
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.orderNumber || o.code || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (o.customerName || o.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && filterByTab(o);
  });

  const getOrderId = (o) => o.orderNumber || o.code || `#${o.id}`;
  const getCustomer = (o) => o.customerName || o.name || '—';
  const getProduct = (o) =>
    o.items?.[0]?.product?.name || o.product?.name || o.name || '—';
  const getQty = (o) =>
    o.items?.reduce((s, it) => s + (it.quantity || 0), 0) ||
    o.totalCount ||
    o.quantity ||
    '—';
  const getAmount = (o) =>
    o.totalAmount
      ? Number(o.totalAmount).toLocaleString('fa-IR')
      : o.amount || '—';
  const getDate = (o) => {
    const d = o.orderDate || o.date || o.createdAt;
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fa-IR');
  };

  return (
    <div>
      {/* Tabs + Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
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
                color:
                  activeTab === t.value ? 'var(--text-primary)' : 'var(--text-muted)',
                background:
                  activeTab === t.value ? 'var(--bg-secondary)' : 'transparent',
                fontWeight: activeTab === t.value ? 600 : 400,
                boxShadow: activeTab === t.value ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '8px 32px 8px 12px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font)',
                fontSize: 13,
                width: 200,
                outline: 'none',
              }}
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <Filter size={13} /> فیلتر
          </button>
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
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <Download size={13} /> خروجی Excel
          </button>
          <button
            onClick={() => navigate('/orders/new')}
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
            <Plus size={13} /> سفارش جدید
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="animate-fadeUp"
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 60,
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
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {[
                    'کد سفارش',
                    'مشتری',
                    'محصول',
                    'تعداد',
                    'مبلغ (تومان)',
                    'تاریخ',
                    'وضعیت',
                    'اولویت',
                    'عملیات',
                  ].map((h) => (
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
                      colSpan={9}
                      style={{
                        padding: '48px 16px',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: 14,
                      }}
                    >
                      هیچ سفارشی یافت نشد
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const pm =
                      priorityMap[o.priority?.toUpperCase()] || priorityMap['NORMAL'];
                    return (
                      <tr
                        key={o.id}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          e.currentTarget
                            .querySelectorAll('td')
                            .forEach((td) => (td.style.background = 'var(--bg-hover)'));
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget
                            .querySelectorAll('td')
                            .forEach((td) => (td.style.background = 'transparent'));
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
                          {getOrderId(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {getCustomer(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {getProduct(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {getQty(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            fontWeight: 500,
                            color: 'var(--accent-green)',
                          }}
                        >
                          {getAmount(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {getDate(o)}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                          }}
                        >
                          <StatusBadge status={o.status} />
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
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                          }}
                        >
                          <div style={{ display: 'flex', gap: 6 }}>
                            {[
                              {
                                icon: Eye,
                                onClick: () => navigate(`/orders/${o.id}`),
                              },
                              {
                                icon: Edit2,
                                onClick: () => navigate(`/orders/${o.id}/edit`),
                              },
                              { icon: MoreVertical, onClick: () => {} },
                            ].map(({ icon: Icon, onClick }, idx) => (
                              <button
                                key={idx}
                                onClick={onClick}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: 6,
                                  background: 'rgba(255,255,255,0.05)',
                                  border: '1px solid var(--border)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  color: 'var(--text-secondary)',
                                  transition: 'var(--transition)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(255,255,255,0.1)';
                                  e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(255,255,255,0.05)';
                                  e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                              >
                                <Icon size={12} />
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default OrdersList;
