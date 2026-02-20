import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight, User, Phone, MapPin, FileText } from 'lucide-react';
import contractorsService from '../../services/contractors.service';

const typeOptions = [
  { value: 'FABRIC', label: 'تأمین پارچه', desc: 'شرکت‌هایی که پارچه و مواد اولیه را تأمین می‌کنند' },
  { value: 'PRODUCTION', label: 'تولید', desc: 'کارگاه‌ها و کارخانه‌هایی که عملیات تولید را انجام می‌دهند' },
  { value: 'PACKAGING', label: 'بسته‌بندی', desc: 'شرکت‌هایی که خدمات بسته‌بندی و آماده‌سازی نهایی ارائه می‌دهند' },
  { value: 'STONE_WASH', label: 'شستشو', desc: 'مراکز شستشو و آب‌کشی که عملیات شستشوی نهایی را انجام می‌دهند' },
];

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '10px 36px 10px 14px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font)',
  fontSize: 13,
  outline: 'none',
  transition: 'var(--transition)',
};

const ContractorCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'FABRIC',
    phone: '',
    address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type) {
      setError('نام و نوع پیمانکار اجباری است');
      return;
    }

    try {
      setLoading(true);
      await contractorsService.create(formData);
      setSuccess(true);
      setTimeout(() => navigate('/contractors'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ایجاد پیمانکار');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = typeOptions.find((t) => t.value === formData.type);

  return (
    <div className="animate-fadeUp">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => navigate('/contractors')}
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
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || success}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '9px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading || success ? 'not-allowed' : 'pointer',
            background:
              success
                ? 'rgba(16,185,129,0.3)'
                : loading
                ? 'rgba(245,158,11,0.5)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)',
            color: 'white',
            border: 'none',
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              در حال ذخیره...
            </>
          ) : success ? (
            '✓ ذخیره شد'
          ) : (
            <>
              <Save size={14} /> ذخیره پیمانکار
            </>
          )}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            color: '#f87171',
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Form */}
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
              padding: '18px 20px',
              borderBottom: '1px solid var(--border)',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            اطلاعات پایه
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}
            >
              {/* Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  نام پیمانکار <span style={{ color: 'var(--accent-red)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={15}
                    style={{
                      position: 'absolute',
                      right: 11,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="نام کامل پیمانکار"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    marginBottom: 6,
                    fontWeight: 500,
                  }}
                >
                  شماره تماس
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={15}
                    style={{
                      position: 'absolute',
                      right: 11,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="09121234567"
                    style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                نوع پیمانکار <span style={{ color: 'var(--accent-red)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {typeOptions.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => handleChange('type', t.value)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      border: `1px solid ${
                        formData.type === t.value
                          ? 'rgba(245,158,11,0.5)'
                          : 'var(--border)'
                      }`,
                      background:
                        formData.type === t.value
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(255,255,255,0.03)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color:
                          formData.type === t.value
                            ? 'var(--accent-gold)'
                            : 'var(--text-primary)',
                        marginBottom: 3,
                      }}
                    >
                      {t.label}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {t.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                آدرس
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin
                  size={15}
                  style={{
                    position: 'absolute',
                    right: 11,
                    top: 12,
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="آدرس کامل پیمانکار"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                یادداشت‌ها
              </label>
              <div style={{ position: 'relative' }}>
                <FileText
                  size={15}
                  style={{
                    position: 'absolute',
                    right: 11,
                    top: 12,
                    color: 'var(--text-muted)',
                  }}
                />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="یادداشت‌ها، توضیحات اضافی، یا نکات مهم..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    padding: '10px 36px 10px 14px',
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              نوع انتخاب شده
            </div>
            {selectedType && (
              <div style={{ padding: 16 }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--accent-gold)',
                      marginBottom: 4,
                    }}
                  >
                    {selectedType.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {selectedType.desc}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              background: 'rgba(59,130,246,0.05)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 'var(--radius)',
              padding: 16,
              fontSize: 12,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#60a5fa',
                marginBottom: 8,
                fontSize: 13,
              }}
            >
              💡 راهنما
            </div>
            پس از ثبت پیمانکار، می‌توانید آن را در سفارشات به مراحل مختلف تولید اختصاص دهید و
            ارزیابی‌های دوره‌ای انجام دهید.
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ContractorCreate;
