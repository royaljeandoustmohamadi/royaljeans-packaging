import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Edit, Trash2, Download, Calendar, User, Package } from 'lucide-react';
import ordersService from '../../services/orders.service';

const statusMap = {
  PENDING: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  CONFIRMED: { label: 'تایید شده', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  IN_PROGRESS: { label: 'در حال تولید', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  READY: { label: 'آماده تحویل', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  DELIVERED: { label: 'تحویل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  CANCELLED: { label: 'لغو شده', bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  pending: { label: 'در انتظار', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  completed: { label: 'تکمیل شده', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
};

const Card = ({ title, children }) => (
  <div
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      marginBottom: 16,
    }}
  >
    {title && (
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </div>
    )}
    <div style={{ padding: '16px 20px' }}>{children}</div>
  </div>
);

const InfoRow = ({ label, value, valueStyle }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '9px 0',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
    }}
  >
    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', ...valueStyle }}>
      {value ?? '—'}
    </span>
  </div>
);

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getById(id);
      setOrder(response.order);
    } catch (_err) {
      setError('خطا در دریافت جزئیات سفارش');
      setTimeout(() => navigate('/orders'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      try {
        await ordersService.delete(id);
        navigate('/orders');
      } catch (_err) {
        setError('خطا در حذف سفارش');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
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

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          textAlign: 'center',
          color: '#f87171',
        }}
      >
        {error}
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = statusMap[order.status?.toUpperCase()] || statusMap[order.status] || statusMap['PENDING'];

  return (
    <div className="animate-fadeUp">
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/orders')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 13,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <ArrowRight size={14} /> بازگشت
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-gold)' }}>
              {order.orderNumber || order.code || `#${order.id}`}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {order.customerName || order.name || '—'}
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 12px',
              borderRadius: 99,
              fontSize: 12,
              fontWeight: 600,
              background: statusInfo.bg,
              color: statusInfo.color,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
            {statusInfo.label}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate(`/orders/${id}/edit`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 13,
              cursor: 'pointer',
              background: 'rgba(59,130,246,0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.2)',
            }}
          >
            <Edit size={13} /> ویرایش
          </button>
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 13,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <Download size={13} /> PDF
          </button>
          <button
            onClick={handleDelete}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              fontSize: 13,
              cursor: 'pointer',
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            <Trash2 size={13} /> حذف
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Basic Info */}
        <Card title="اطلاعات پایه">
          <InfoRow label="کد سفارش" value={order.orderNumber || order.code || `#${order.id}`} valueStyle={{ color: 'var(--accent-gold)' }} />
          <InfoRow label="نام مشتری" value={order.customerName || order.name} />
          <InfoRow
            label="تاریخ سفارش"
            value={order.orderDate || order.date ? new Date(order.orderDate || order.date).toLocaleDateString('fa-IR') : null}
          />
          <InfoRow label="کل تعداد" value={order.totalCount || order.quantity} />
          <InfoRow label="اولویت" value={
            { URGENT: 'فوری', HIGH: 'بالا', NORMAL: 'عادی', LOW: 'پایین' }[order.priority?.toUpperCase()] || order.priority
          } />
        </Card>

        {/* Product Details */}
        <Card title="مشخصات محصول">
          <InfoRow label="نوع پارچه" value={order.fabric} />
          <InfoRow label="شستشو" value={order.stoneWash} />
          <InfoRow label="استایل" value={order.style} />
          <InfoRow label="تأمین‌کننده پارچه" value={order.fabricSupplier} />
          <InfoRow label="تأمین‌کننده تولید" value={order.productionSupplier} />
        </Card>

        {/* Stock Info */}
        <Card title="اطلاعات موجودی">
          {[
            ['موجودی پارچه', order.stockFabric],
            ['موجودی شستشو', order.stockWash],
            ['موجودی تولید', order.stockProduction],
            ['موجودی بسته‌بندی', order.stockPackaging],
            ['قابل فروش', order.saleableCount],
            ['ضایعات', order.waste, { color: 'var(--accent-red)' }],
          ].map(([label, value, style]) => (
            <InfoRow key={label} label={label} value={value ?? 0} valueStyle={style} />
          ))}
        </Card>

        {/* Meta */}
        <Card title="اطلاعات تکمیلی">
          <InfoRow label="نوع (BU)" value={order.bu} />
          <InfoRow label="سطح (BV)" value={order.bv} />
          <InfoRow label="تکمیل‌کننده" value={order.finisher} />
          <InfoRow label="کنترل‌کننده" value={order.controller} />
          <InfoRow
            label="تاریخ ایجاد"
            value={order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : null}
          />
          <InfoRow label="ایجاد شده توسط" value={order.creator?.fullName || order.creator?.displayName} />
          {order.description && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>توضیحات</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {order.description}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Size Distribution */}
      {(order.size30_healthy || order.size32_healthy) && (
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            marginTop: 4,
          }}
        >
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            توزیع سایزها
          </div>
          <div style={{ padding: '16px 20px' }}>
            {[
              { title: 'سایزهای سالم', color: '#10b981', bg: 'rgba(16,185,129,0.1)', prefix: 'healthy' },
              { title: 'سایزهای اقتصادی', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', prefix: 'economy' },
            ].map(({ title, color, bg, prefix }) => (
              <div key={prefix} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 8 }}>{title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[30, 31, 32, 33, 34, 36, 38, 40].map((size) => (
                    <div
                      key={size}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 8,
                        background: bg,
                        border: `1px solid ${color}30`,
                        textAlign: 'center',
                        minWidth: 60,
                      }}
                    >
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>سایز {size}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color }}>
                        {order[`size${size}_${prefix}`] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessories */}
      {(order.accessories_button || order.accessories_rivet) && (
        <div
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            marginTop: 16,
          }}
        >
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            ملزومات
          </div>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              ['دکمه', order.accessories_button],
              ['ریوت', order.accessories_rivet],
              ['کارت جیب', order.accessories_pocketCard],
              ['کارت سایز', order.accessories_sizeCard],
              ['آویز', order.accessories_hanger],
              ['نوار', order.accessories_band],
              ['چرم', order.accessories_leather],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{value || 0}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          padding: '12px 0',
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <User size={13} />
          ایجاد شده توسط: {order.creator?.fullName || order.creator?.displayName || 'نامشخص'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} />
          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Package size={13} />
          کل تعداد: {order.totalCount || 0}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
