import { Wallet } from 'lucide-react';

const FinancePage = () => (
  <div
    className="card animate-fadeUp"
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 60,
      textAlign: 'center',
    }}
  >
    <div style={{ marginBottom: 12 }}>
      <Wallet size={48} color="var(--accent-gold)" style={{ margin: '0 auto' }} />
    </div>
    <div
      style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}
    >
      مالی در دست توسعه
    </div>
    <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
      این بخش شامل مدیریت پرداخت‌ها، رهگیری چک و اقساط خواهد بود
    </div>
  </div>
);

export default FinancePage;
