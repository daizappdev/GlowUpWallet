import { Goal, Transaction, Challenge } from './types';

export const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Eras Tour Tickets', targetAmount: 800, currentAmount: 350, emoji: '🎫' },
  { id: '2', title: 'Summer Euro Trip', targetAmount: 2500, currentAmount: 1100, emoji: '✈️' },
  { id: '3', title: 'New Macbook', targetAmount: 1200, currentAmount: 200, emoji: '💻' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Starbucks', amount: 6.50, category: 'Food & Drink', date: '2023-10-24', type: 'expense' },
  { id: '2', title: 'Paycheck', amount: 1200, category: 'Income', date: '2023-10-23', type: 'income' },
  { id: '3', title: 'Zara Haul', amount: 89.99, category: 'Shopping', date: '2023-10-22', type: 'expense' },
  { id: '4', title: 'Uber', amount: 24.50, category: 'Transport', date: '2023-10-21', type: 'expense' },
  { id: '5', title: 'Spotify', amount: 10.99, category: 'Subscription', date: '2023-10-20', type: 'expense' },
];

export const CHALLENGES: Challenge[] = [
  { id: '1', title: 'No-Spend Weekend', description: 'Spend $0 on non-essentials this weekend.', difficulty: 'Medium', rewardXP: 500, active: false },
  { id: '2', title: 'Coffee at Home', description: 'Make your own coffee for 7 days straight.', difficulty: 'Easy', rewardXP: 300, active: true },
  { id: '3', title: 'Sell 3 Items', description: 'List 3 items on Depop/Vinted.', difficulty: 'Hard', rewardXP: 1000, active: false },
];
