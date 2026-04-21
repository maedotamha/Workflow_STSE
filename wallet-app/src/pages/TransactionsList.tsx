import React from 'react';
import transactionsData from '../data/transactions.json';
import type { Transaction } from '../types/transaction';
import './TransactionsList.css';
import CardBalance from '../components/CardBalance';

import TransactionItem from '../components/TransactionItem';

const TransactionsList: React.FC = () => {
  const transactions: Transaction[] = transactionsData as Transaction[];

  return (
    <div className="transactions-container">
      <CardBalance />

      <div className="transactions-section">
        <h3 className="section-title">Latest Transactions</h3>
        <div className="transactions-card">
          {transactions.slice(0, 10).map((transaction, index) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              isLast={index === 9} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;
