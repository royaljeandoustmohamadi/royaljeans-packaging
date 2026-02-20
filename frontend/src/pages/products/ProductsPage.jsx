import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit2, Filter } from 'lucide-react';
import api from '../../services/api';

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

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header Actions */}
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
                width: 220,
                outline: 'none',
              }}
              placeholder="جستجوی محصول..."
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
          <Plus size={13} /> محصول جدید
        </button>
      </div>

      <Card className="animate-fadeUp">
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
                  {['کد محصول', 'نام محصول', 'دسته‌بندی', 'استایل', 'وضعیت', 'عملیات'].map(
                    (h) => (
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
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
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
                      {loading ? 'در حال بارگذاری...' : 'هیچ محصولی یافت نشد'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr
                      key={p.id}
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
                        {p.code || `P-${p.id}`}
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
                        {p.name}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {p.category?.name || '—'}
                      </td>
                      <td
                        style={{
                          padding: '13px 16px',
                          fontSize: 13,
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {p.style?.name || '—'}
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
                            background: p.isActive
                              ? 'rgba(16,185,129,0.15)'
                              : 'rgba(239,68,68,0.15)',
                            color: p.isActive ? '#34d399' : '#f87171',
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
                          {p.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
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
                            { icon: Eye, onClick: () => {} },
                            { icon: Edit2, onClick: () => {} },
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
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProductsPage;
