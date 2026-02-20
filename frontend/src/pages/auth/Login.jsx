import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }

    try {
      await login(email, password);
    } catch (_err) {
      setLocalError(error || 'ایمیل یا رمز عبور اشتباه است');
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '11px 40px 11px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font)',
    fontSize: 14,
    outline: 'none',
    transition: 'var(--transition)',
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '40px 36px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 900,
              color: 'white',
              margin: '0 auto 16px',
              boxShadow: '0 8px 25px rgba(245,158,11,0.4)',
            }}
          >
            RJ
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
            Royal Jeans
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            سیستم مدیریت تولید
          </div>
        </div>

        {/* Error */}
        {(localError || error) && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              color: '#f87171',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
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
              ایمیل
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                style={{ ...inputStyle, direction: 'ltr', textAlign: 'left' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-gold)';
                  e.target.style.background = 'rgba(245,158,11,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              رمز عبور
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور خود را وارد کنید"
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-gold)';
                  e.target.style.background = 'rgba(245,158,11,0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: isLoading
                ? 'rgba(245,158,11,0.5)'
                : 'linear-gradient(135deg, #f59e0b, #ef4444)',
              color: 'white',
              fontFamily: 'var(--font)',
              fontSize: 15,
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : '0 4px 15px rgba(245,158,11,0.35)',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                در حال ورود...
              </>
            ) : (
              'ورود به سیستم'
            )}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: 24,
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          v1.0.1 — Royal Jeans Manufacturing System
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Login;
