export enum AppTheme {
  CLEAN_GIRL = 'Clean Girl',
  Y2K = 'Y2K',
  DARK_ACADEMIA = 'Dark Academia'
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  emoji: string;
  deadline?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardXP: number;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export type Tab = 'dashboard' | 'budget' | 'goals' | 'learn';
