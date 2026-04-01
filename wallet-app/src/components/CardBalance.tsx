import React, { useMemo } from 'react';
import './CardBalance.css';
import { calculateDailyPoints, formatPoints, getDaysSinceSeasonStart } from '../utils/points';

const CardBalance: React.FC = () => {
  const limit = 1500;
  
  // Generating a random balance for demonstration
  const balance = useMemo(() => Math.floor(Math.random() * 1400) + 10, []);
  const available = limit - balance;

  // Calculate points for the current day of the season
  const today = new Date();
  const seasonDay = useMemo(() => getDaysSinceSeasonStart(today), [today]);
  const dailyPoints = useMemo(() => calculateDailyPoints(seasonDay), [seasonDay]);

  return (
    <div className="balance-grid">
      <div className="balance-column-left">
        <div className="card balance-card">
          <span className="card-label">Card Balance</span>
          <span className="balance-amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="balance-available">${available.toLocaleString('en-US', { minimumFractionDigits: 2 })} Available</span>
        </div>
        <div className="card points-card">
          <span className="card-label">Daily Points</span>
          <span className="points-amount">{formatPoints(dailyPoints)}</span>
        </div>
      </div>
      <div className="balance-column-right">
        <div className="card payment-card">
          <span className="card-label">No Payment Due</span>
          <p className="payment-desc">You've paid your September balance.</p>
          <div className="check-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardBalance;
