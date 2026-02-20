import { useState } from 'react';
import { User, Mail, Phone, Shield, Lock, Save, Edit3 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import userService from '../../services/user.service';

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

const readOnlyInputStyle = {
  ...inputStyle,
  background: 'rgba(255,255,255,0.02)',
  cursor: 'not-allowed',
  color: 'var(--text-muted)',
};

const roleLabels = {
  ADMIN: 'مدیر سیستم',
  MANAGER: 'مدیر تولید',
  PRODUCTION: 'مسئول تولید',
  WAREHOUSE: 'انباردار',
  SALES: 'کارشناس فروش',
  ACCOUNTANT: 'حسابدار',
};

const roleColors = {
  ADMIN: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  MANAGER: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
  PRODUCTION: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
  WAREHOUSE: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  SALES: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
  ACCOUNTANT: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
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

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const userInitial =
    user?.firstName?.[0] || user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';
  const roleColor = roleColors[user?.role] || roleColors['PRODUCTION'];

  const showMsg = (msg, isError = false) => {
    if (isError) setErrorMsg(msg);
    else setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 3000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await userService.updateProfile(user.id, profileData);
      updateUser(response.user);
      showMsg('پروفایل با موفقیت به‌روزرسانی شد');
    } catch (err) {
      showMsg(err.response?.data?.message || 'خطا در به‌روزرسانی پروفایل', true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMsg('رمزهای عبور جدید مطابقت ندارند', true);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMsg('رمز عبور جدید باید حداقل ۶ کاراکتر باشد', true);
      return;
    }
    setIsChangingPassword(true);
    try {
      await userService.changePassword(user.id, passwordData.currentPassword, passwordData.newPassword);
      showMsg('رمز عبور با موفقیت تغییر کرد');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showMsg(err.response?.data?.message || 'خطا در تغییر رمز عبور', true);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const tabs = [
    { value: 'profile', label: 'اطلاعات شخصی', icon: Edit3 },
    { value: 'password', label: 'تغییر رمز عبور', icon: Lock },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20 }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: 'white',
                margin: '0 auto 16px',
                boxShadow: '0 4px 20px rgba(139,92,246,0.3)',
              }}
            >
              {userInitial}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.displayName || user?.email}
            </div>
            {user?.nickname && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                @{user.nickname}
              </div>
            )}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 12px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 600,
                background: roleColor.bg,
                color: roleColor.color,
              }}
            >
              <Shield size={12} />
              {roleLabels[user?.role] || 'کاربر'}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
            {[
              { icon: Mail, label: user?.email || '—' },
              { icon: Phone, label: user?.phone || 'شماره تماس ثبت نشده' },
              { icon: User, label: `عضو از ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '—'}` },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 0',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}
              >
                <Icon size={14} color="var(--text-muted)" />
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    direction: i === 0 ? 'ltr' : 'rtl',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tab Nav */}
        <Card>
          <div style={{ padding: '8px' }}>
            {tabs.map((t) => (
              <div
                key={t.value}
                onClick={() => setActiveTab(t.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  color: activeTab === t.value ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: activeTab === t.value ? 'rgba(245,158,11,0.1)' : 'transparent',
                  fontSize: 13,
                  fontWeight: activeTab === t.value ? 600 : 400,
                }}
              >
                <t.icon size={16} />
                {t.label}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Content */}
      <div>
        {(successMsg || errorMsg) && (
          <div
            style={{
              background: successMsg ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${successMsg ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 10,
              padding: '10px 16px',
              fontSize: 13,
              color: successMsg ? '#34d399' : '#f87171',
              marginBottom: 16,
            }}
          >
            {successMsg || errorMsg}
          </div>
        )}

        {activeTab === 'profile' && (
          <Card>
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              اطلاعات شخصی
            </div>
            <form onSubmit={handleProfileSubmit} style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {/* Display Name (readonly) */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    نام اصلی
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      value={user?.displayName || ''}
                      readOnly
                      style={readOnlyInputStyle}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>فقط مدیر سیستم می‌تواند تغییر دهد</div>
                </div>

                {/* Nickname */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    نام مستعار
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Edit3 size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      value={profileData.nickname}
                      onChange={(e) => setProfileData((p) => ({ ...p, nickname: e.target.value }))}
                      placeholder="نام مستعار"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    شماره تماس
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      value={profileData.phone}
                      onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="09121234567"
                      style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                    />
                  </div>
                </div>

                {/* Email (readonly) */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                    ایمیل
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      value={user?.email || ''}
                      readOnly
                      style={{ ...readOnlyInputStyle, direction: 'ltr', textAlign: 'left' }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>ایمیل قابل تغییر نیست</div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                  درباره من
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="توضیحاتی درباره خودتان بنویسید..."
                  rows={4}
                  style={{ ...inputStyle, padding: '10px 14px', resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white',
                  border: 'none',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? 'در حال ذخیره...' : <><Save size={14} /> ذخیره تغییرات</>}
              </button>
            </form>
          </Card>
        )}

        {activeTab === 'password' && (
          <Card>
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid var(--border)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              تغییر رمز عبور
            </div>
            <form onSubmit={handlePasswordSubmit} style={{ padding: 20, maxWidth: 400 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                برای تغییر رمز عبور، رمز عبور فعلی و جدید خود را وارد کنید. رمز عبور باید حداقل ۶ کاراکتر باشد.
              </div>

              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => {
                const labels = ['رمز عبور فعلی', 'رمز عبور جدید', 'تکرار رمز عبور جدید'];
                return (
                  <div key={field} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                      {labels[i]}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="password"
                        value={passwordData[field]}
                        onChange={(e) => setPasswordData((p) => ({ ...p, [field]: e.target.value }))}
                        placeholder="••••••••"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--accent-gold)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={isChangingPassword}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: 'white',
                  border: 'none',
                  opacity: isChangingPassword ? 0.7 : 1,
                }}
              >
                {isChangingPassword ? 'در حال تغییر...' : <><Lock size={14} /> تغییر رمز عبور</>}
              </button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
