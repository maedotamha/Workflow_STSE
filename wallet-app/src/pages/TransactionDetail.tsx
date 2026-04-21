import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import transactionsData from '../data/transactions.json';
import type { Transaction } from '../types/transaction';
import './TransactionDetail.css';

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const transaction = (transactionsData as Transaction[]).find(t => t.id === id);

  if (!transaction) {
    return <div className="error">Transaction not found</div>;
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </header>

      <div className="amount-section">
        <h1 className="detail-amount">${transaction.amount.toFixed(2)}</h1>
        <p className="detail-merchant">{transaction.name}</p>
        <p className="detail-date">{transaction.date}, 12:47</p>
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span className="summary-label">Status: {transaction.pending ? 'Pending' : 'Approved'}</span>
          <span className="summary-value"></span>
        </div>
        <div className="summary-row sub">
          <span className="summary-subtext">RBC Bank Debit Card</span>
        </div>
        <div className="divider"></div>
        <div className="summary-row total">
          <span className="summary-label">Total</span>
          <span className="summary-value">${transaction.amount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
