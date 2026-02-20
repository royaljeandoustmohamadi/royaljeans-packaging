import { useState } from 'react';
import { Package, Scissors, Shirt, Wind, Box, RefreshCw } from 'lucide-react';

const workflowStages = [
  { id: 1, name: 'پارچه', icon: Package, slug: 'fabric', status: 'done', qty: 300 },
  { id: 2, name: 'برش', icon: Scissors, slug: 'cutting', status: 'done', qty: 295 },
  { id: 3, name: 'دوخت', icon: Shirt, slug: 'sewing', status: 'active', qty: 280 },
  { id: 4, name: 'سنگشویی', icon: Wind, slug: 'wash', status: 'pending', qty: 0 },
  { id: 5, name: 'بسته‌بندی', icon: Box, slug: 'packaging', status: 'pending', qty: 0 },
];

const stageHistory = [
  {
    color: '#10b981',
    action: 'تکمیل مرحله برش',
    detail: 'خروجی: ۲۹۵ عدد | ضایعات: ۵',
    time: 'دیروز ۱۴:۳۰',
  },
  {
    color: '#10b981',
    action: 'تکمیل مرحله پارچه',
    detail: 'پیمانکار: پارچه‌فروشی رضوی',
    time: '۳ روز پیش',
  },
  {
    color: '#f59e0b',
    action: 'شروع مرحله برش',
    detail: 'پیمانکار: تولیدی شریفی',
    time: '۴ روز پیش',
  },
  {
    color: '#3b82f6',
    action: 'تایید سفارش',
    detail: 'توسط مدیر تولید',
    time: '۵ روز پیش',
  },
];

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

const WorkflowPage = () => {
  const [stages, setStages] = useState(workflowStages);

  const getCircleStyle = (status) => {
    if (status === 'done')
      return {
        background: 'rgba(16,185,129,0.2)',
        border: '2px solid var(--accent-green)',
        color: 'var(--accent-green)',
      };
    if (status === 'active')
      return {
        background: 'rgba(245,158,11,0.2)',
        border: '2px solid var(--accent-gold)',
        color: 'var(--accent-gold)',
        boxShadow: '0 0 15px rgba(245,158,11,0.3)',
      };
    return {
      background: 'var(--bg-card)',
      border: '2px solid var(--border)',
      color: 'var(--text-muted)',
    };
  };

  const getLineStyle = (idx) => {
    if (idx === 0) return {};
    const prev = stages[idx - 1];
    const cur = stages[idx];
    if (prev.status === 'done' && cur.status !== 'pending')
      return {
        background: 'linear-gradient(to right, var(--accent-green), var(--accent-gold))',
      };
    if (prev.status === 'done') return { background: 'var(--accent-green)' };
    return { background: 'var(--border)' };
  };

  return (
    <div>
      {/* Order Header */}
      <div
        className="animate-fadeUp"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(59,130,246,0.05))',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 'var(--radius)',
          padding: 20,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent-gold)' }}
          >
            RJ-1024
          </div>
          <div
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            بازار بزرگ تهران — شلوار جین کلاسیک
          </div>
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 4,
              flexWrap: 'wrap',
            }}
          >
            {[
              ['تعداد', '۲۴۰ عدد'],
              ['تاریخ سفارش', '۱۴۰۳/۰۶/۱۵'],
              ['تحویل', '۱۴۰۳/۰۶/۲۵'],
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {k}:{' '}
                <span
                  style={{
                    color:
                      k === 'تحویل' ? 'var(--accent-red)' : 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <span
          className="active-pulse"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '8px 16px',
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 600,
            background: 'rgba(245,158,11,0.15)',
            color: '#fbbf24',
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
          در حال تولید
        </span>
      </div>

      {/* Workflow Steps */}
      <Card style={{ marginBottom: 20 }} className="animate-fadeUp delay-1">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 20px 0',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            مراحل گردش کار
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
            <RefreshCw size={12} /> بروزرسانی مرحله
          </button>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              overflowX: 'auto',
              padding: '8px 0',
            }}
          >
            {stages.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  minWidth: 90,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {i > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 18,
                      right: '50%',
                      left: '-50%',
                      height: 2,
                      zIndex: 0,
                      ...getLineStyle(i),
                    }}
                  />
                )}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    transition: 'var(--transition)',
                    position: 'relative',
                    ...getCircleStyle(s.status),
                  }}
                >
                  <s.icon size={16} />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 8,
                    textAlign: 'center',
                    color:
                      s.status === 'active'
                        ? 'var(--accent-gold)'
                        : s.status === 'done'
                        ? 'var(--accent-green)'
                        : 'var(--text-muted)',
                    fontWeight: s.status === 'active' ? 600 : 400,
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}
                >
                  {s.qty > 0 ? `${s.qty} عدد` : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stage Details + History */}
      <div
        className="animate-fadeUp delay-2"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
      >
        {/* Stage Detail */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              جزئیات مرحله فعلی: دوخت
            </div>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            {[
              ['پیمانکار', 'تولیدی برادران احمدی'],
              ['تاریخ شروع', '۱۴۰۳/۰۶/۱۷'],
              ['تاریخ پیش‌بینی', '۱۴۰۳/۰۶/۲۱'],
              ['ورودی', '۲۹۵ عدد'],
              ['خروجی تا کنون', '۱۸۰ عدد'],
              ['ضایعات', '۳ عدد (۱٪)'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{k}</span>
                <span
                  style={{
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontSize: 13,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  پیشرفت کلی سفارش
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--accent-gold)',
                  }}
                >
                  ۶۱٪
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
                    width: '61%',
                    borderRadius: 99,
                    background: 'linear-gradient(to left, #f59e0b, #ef4444)',
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* History */}
        <Card>
          <div style={{ padding: '18px 20px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              تاریخچه تغییرات
            </div>
          </div>
          <div style={{ padding: '8px 20px 16px' }}>
            {stageHistory.map((h, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 12, marginBottom: 14 }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: h.color,
                      flexShrink: 0,
                    }}
                  />
                  {i < stageHistory.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        flex: 1,
                        background: 'var(--border)',
                        marginTop: 4,
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 12,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {h.action}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      marginTop: 4,
                    }}
                  >
                    {h.detail}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{h.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowPage;
