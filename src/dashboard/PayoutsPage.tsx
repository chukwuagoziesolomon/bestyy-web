import React, { useState } from 'react';
import { Landmark, Eye, EyeOff, CreditCard, Calendar } from 'lucide-react';

const maskedCards = [
  'Opay ******2206',
  'Opay ******4040',
  'Opay ******4040',
  'Opay ******4040',
];

const transactions = Array(8).fill({
  name: 'SilverSnow',
  card: 'Opay ******2206',
  amount: 6000,
  date: '24 July, 2025',
  status: 'Accepted',
});

const PayoutsPage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [dateRange, setDateRange] = useState('8th July - 8th July 2025');

  return (
    <div style={{ fontFamily: 'Nunito Sans, sans-serif', background: '#fff', minHeight: '100vh', padding: '0 0 2rem 0' }}>
      <h1 style={{ fontWeight: 900, fontSize: 32, marginBottom: 32, letterSpacing: 0.5 }}>Payout</h1>
      {/* Balance Card */}
      <div className="dashboard-card" style={{ borderRadius: 16, padding: 32, margin: '0 auto 32px auto', maxWidth: 1200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Icon in rounded square */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            border: '1.5px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            marginRight: 24
          }}>
            <Landmark size={32} color="#222" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 900, fontSize: 32, color: '#222' }}>{showBalance ? '₦2,000,000' : '••••••••'}</span>
              <span style={{ color: '#888', fontWeight: 600, fontSize: 16 }}>Available to Withdraw</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowBalance(v => !v)}>
                {showBalance ? <Eye size={22} color="#bbb" /> : <EyeOff size={22} color="#bbb" />}
              </span>
            </div>
            <div style={{ marginTop: 10, color: '#bbb', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
              Active Cards:
              {maskedCards.map((card, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 8, color: '#888', fontWeight: 700, fontSize: 15 }}>
                  <CreditCard size={16} style={{ marginRight: 2 }} />{card}
                </span>
              ))}
            </div>
          </div>
          <button style={{ background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '16px 38px', cursor: 'pointer', boxShadow: '0 2px 8px #e5e7eb' }}>Withdraw</button>
        </div>
      </div>
      {/* Transactions History Card */}
      <div className="dashboard-card" style={{ borderRadius: 16, padding: 0, maxWidth: 1200, margin: '0 auto', overflowX: 'auto', border: '1.5px solid #f3f4f6', boxShadow: '0 2px 16px #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 32px 0 32px' }}>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: '#222', margin: 0 }}>Transactions History</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontWeight: 600, fontSize: 15, background: '#f8fafc', borderRadius: 8, padding: '8px 18px' }}>
            <Calendar size={18} style={{ marginRight: 6 }} />
            {dateRange}
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 17, fontFamily: 'inherit', marginTop: 18 }}>
          <thead>
            <tr style={{ color: '#888', fontWeight: 700, background: '#fff' }}>
              <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #D1D5DB', borderRight: '1px solid #D1D5DB' }}>ID</th>
              <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #D1D5DB', borderRight: '1px solid #D1D5DB' }}>Amount</th>
              <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #D1D5DB', borderRight: '1px solid #D1D5DB' }}>Date</th>
              <th style={{ padding: '20px 18px', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #D1D5DB' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i, arr) => (
              <tr key={i} style={{ background: '#fff' }}>
                <td style={{ padding: '24px 18px', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                  <div style={{ fontWeight: 700, color: '#222' }}>{tx.name}</div>
                  <div style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>{tx.card}</div>
                </td>
                <td style={{ padding: '24px 18px', fontWeight: 700, borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>₦ {tx.amount.toLocaleString()}</td>
                <td style={{ padding: '24px 18px', color: '#555', borderRight: '1px solid #D1D5DB', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>{tx.date}</td>
                <td style={{ padding: '24px 18px', borderBottom: i !== arr.length - 1 ? '1px solid #D1D5DB' : 'none' }}>
                  <span style={{ background: '#d1fae5', color: '#10b981', borderRadius: 8, padding: '8px 28px', fontWeight: 700, fontSize: 16 }}>Accepted</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutsPage; 