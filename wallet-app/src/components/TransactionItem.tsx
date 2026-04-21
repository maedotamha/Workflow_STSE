import React from 'react';
import { Link } from 'react-router-dom';
import type { Transaction } from '../types/transaction';
import { formatTransactionDate } from '../utils/date';

interface TransactionItemProps {
  transaction: Transaction;
  isLast: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, isLast }) => {
  return (
    <Link 
      to={`/transaction/${transaction.id}`} 
      className={`transaction-item ${isLast ? 'last' : ''}`}
    >
      <div className="transaction-icon-wrapper">
        <div className={`transaction-icon ${transaction.icon}`}>
          {transaction.icon === 'apple' ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05 1.61-3.1 1.61-1.12 0-1.46-.68-2.73-.68-1.27 0-1.63.66-2.71.68-1.07.02-2.12-.66-3.13-1.63-2.07-2.02-3.16-5.46-3.16-8.29 0-2.83 1.14-4.88 3.12-4.88 1.05 0 1.93.63 2.58.63.63 0 1.68-.66 2.87-.66 1.49 0 2.6.76 3.32 1.81-3.05 1.83-2.5 5.61.1 7.03-.68 1.76-1.55 3.51-2.28 4.39zM12.01 4.54c-.16-2.16 1.63-3.95 3.39-4.54.12 2.21-1.77 4.14-3.39 4.54z"/>
            </svg>
          ) : <span>{transaction.name[0]}</span>}
        </div>
      </div>
      <div className="transaction-info">
        <div className="transaction-top">
          <span className="transaction-name">{transaction.name}</span>
          <span className={`transaction-amount ${transaction.type === 'Credit' ? 'credit' : ''}`}>
            {transaction.type === 'Credit' ? '+' : ''}${transaction.amount.toFixed(2)}
          </span>
        </div>
        <div className="transaction-bottom">
          <span className="transaction-desc">
            {transaction.pending && <strong>Pending - </strong>}
            {transaction.description}
          </span>
          <div className="transaction-meta">
            <span className="transaction-date">
              {transaction.authorizedUser && <span className="authorized-user">{transaction.authorizedUser} - </span>}
              {formatTransactionDate(transaction.date)}
            </span>
            <svg className="chevron-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TransactionItem;
