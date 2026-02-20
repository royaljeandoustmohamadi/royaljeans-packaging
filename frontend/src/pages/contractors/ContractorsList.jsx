import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit2, Star, Filter } from 'lucide-react';
import contractorsService from '../../services/contractors.service';

const typeMap = {
  FABRIC: { label: 'پارچه', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  PRODUCTION: { label: 'تولید', bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  PACKAGING: { label: 'بسته‌بندی', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  STONE_WASH: { label: 'سنگ‌شویی', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
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

const ContractorsList = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContractors();
  }, [typeFilter]);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const data = await contractorsService.getAll(params);
      setContractors(data.contractors || []);
    } catch {
      setContractors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این پیمانکار اطمینان دارید؟')) {
      try {
        await contractorsService.delete(id);
        setContractors(contractors.filter((c) => c.id !== id));
      } catch {
        alert('خطا در حذف پیمانکار');
      }
    }
  };

  const filtered = contractors.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || '').includes(searchTerm)
  );

  const getTypeDisplay = (contractor) => {
    const typeKey = contractor.type?.slug?.toUpperCase().replace('-', '_') ||
      contractor.type?.name?.toUpperCase() ||
      contractor.type;
    return typeMap[typeKey] || { label: contractor.type?.name || contractor.type || '—', bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' };
  };

  return (
    <div>
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          <select
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font)',
              fontSize: 13,
              outline: 'none',
              cursor: 'pointer',
            }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="" style={{ background: '#111827' }}>
              همه انواع
            </option>
            <option value="FABRIC" style={{ background: '#111827' }}>
              پارچه
            </option>
            <option value="PRODUCTION" style={{ background: '#111827' }}>
              تولید
            </option>
            <option value="PACKAGING" style={{ background: '#111827' }}>
              بسته‌بندی
            </option>
            <option value="STONE_WASH" style={{ background: '#111827' }}>
              سنگ‌شویی
            </option>
          </select>
        </div>

        <button
          onClick={() => navigate('/contractors/new')}
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
          <Plus size={13} /> پیمانکار جدید
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
                  {['نام', 'نوع', 'شماره تماس', 'ارزیابی‌ها', 'وضعیت', 'عملیات'].map((h) => (
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
                      هیچ پیمانکاری یافت نشد
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => {
                    const typeDisplay = getTypeDisplay(c);
                    return (
                      <tr
                        key={c.id}
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
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {c.name}
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
                              background: typeDisplay.bg,
                              color: typeDisplay.color,
                            }}
                          >
                            {typeDisplay.label}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                            color: 'var(--text-secondary)',
                            direction: 'ltr',
                            textAlign: 'right',
                          }}
                        >
                          {c.phone || c.mobile || '—'}
                        </td>
                        <td
                          style={{
                            padding: '13px 16px',
                            fontSize: 13,
                            borderBottom: '1px solid rgba(255,255,255,0.03)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <Star size={14} color="#fbbf24" fill="#fbbf24" />
                            <span
                              style={{
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {c._count?.evaluations || c.evaluationsCount || 0} ارزیابی
                            </span>
                          </div>
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
                              background: c.isActive
                                ? 'rgba(16,185,129,0.15)'
                                : 'rgba(239,68,68,0.15)',
                              color: c.isActive ? '#34d399' : '#f87171',
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
                            {c.isActive ? 'فعال' : 'غیرفعال'}
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
                              {
                                icon: Eye,
                                onClick: () => navigate(`/contractors/${c.id}`),
                              },
                              {
                                icon: Edit2,
                                onClick: () => navigate(`/contractors/${c.id}/edit`),
                              },
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
      </Card>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ContractorsList;
