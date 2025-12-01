import React from 'react';
import { Goal, AppTheme } from '../types';

interface GoalCardProps {
  goal: Goal;
  theme: AppTheme;
  onAddFunds: (id: string, amount: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, theme, onAddFunds }) => {
  const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  let barColor = "";
  let cardStyle = "";

  switch (theme) {
    case AppTheme.Y2K:
      barColor = "bg-gradient-to-r from-y2k-pink to-y2k-blue";
      cardStyle = "border-2 border-y2k-pink shadow-[4px_4px_0px_0px_rgba(255,0,255,1)] rounded-none bg-white/50 backdrop-blur-sm";
      break;
    case AppTheme.DARK_ACADEMIA:
      barColor = "bg-[#C5A059]";
      cardStyle = "border border-[#4a3b2a] bg-[#2c241b] rounded-sm shadow-md";
      break;
    default:
      barColor = "bg-green-400";
      cardStyle = "bg-white rounded-2xl shadow-sm border border-stone-100";
      break;
  }

  return (
    <div className={`p-5 mb-4 relative overflow-hidden transition-all hover:scale-[1.01] ${cardStyle}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm">{goal.emoji}</span>
            <div>
                <h3 className="font-bold text-lg leading-tight">{goal.title}</h3>
                <p className="text-xs opacity-70">Target: ${goal.targetAmount.toLocaleString()}</p>
            </div>
        </div>
        <div className="text-right">
            <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </div>

      <div className="h-4 w-full bg-gray-200/20 rounded-full mt-3 overflow-hidden relative">
        <div 
            className={`h-full absolute top-0 left-0 transition-all duration-1000 ease-out ${barColor}`} 
            style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm font-medium opacity-80">${goal.currentAmount.toLocaleString()} saved</p>
        <button 
            onClick={() => onAddFunds(goal.id, 50)}
            className={`px-3 py-1 text-xs font-bold rounded hover:opacity-80 transition-opacity
                ${theme === AppTheme.Y2K ? 'bg-y2k-blue text-black border border-black shadow-[2px_2px_0px_0px_black]' : ''}
                ${theme === AppTheme.DARK_ACADEMIA ? 'bg-[#C5A059] text-black uppercase tracking-widest' : ''}
                ${theme === AppTheme.CLEAN_GIRL ? 'bg-stone-800 text-white rounded-full' : ''}
            `}
        >
            + $50
        </button>
      </div>
    </div>
  );
};
