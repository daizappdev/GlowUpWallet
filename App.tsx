import React, { useState, useEffect } from 'react';
import { ThemeWrapper } from './components/ThemeWrapper';
import { AppTheme, Tab, Goal, Transaction, Challenge } from './types';
import { LayoutDashboard, Wallet, Target, Sparkles, UserCircle, Plus } from 'lucide-react';
import { GoalCard } from './components/GoalCard';
import { INITIAL_GOALS, INITIAL_TRANSACTIONS, CHALLENGES } from './constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getFinancialAdvice, generateDailyTip } from './services/geminiService';

// -- Sub-components defined here for simplicity of import handling in this specific task --

const Navbar = ({ activeTab, setActiveTab, theme }: { activeTab: Tab, setActiveTab: (t: Tab) => void, theme: AppTheme }) => {
  const getIcon = (id: Tab) => {
    switch (id) {
      case 'dashboard': return <LayoutDashboard size={20} />;
      case 'budget': return <Wallet size={20} />;
      case 'goals': return <Target size={20} />;
      case 'learn': return <Sparkles size={20} />;
    }
  };

  return (
    <nav className={`fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto md:w-64 md:h-screen border-t md:border-r md:border-t-0 z-50 
      ${theme === AppTheme.Y2K ? 'bg-white border-y2k-pink border-2' : ''}
      ${theme === AppTheme.DARK_ACADEMIA ? 'bg-[#1a1612] border-[#4a3b2a]' : ''}
      ${theme === AppTheme.CLEAN_GIRL ? 'bg-white/80 backdrop-blur-md border-gray-200' : ''}
    `}>
      <div className="flex md:flex-col justify-around md:justify-start items-center h-16 md:h-full md:pt-10 md:gap-6 px-2">
        <div className="hidden md:block mb-8 px-6 w-full">
           <h1 className="text-2xl font-bold tracking-tight">GlowUp<br/>Wallet</h1>
        </div>
        
        {(['dashboard', 'budget', 'goals', 'learn'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col md:flex-row md:px-6 md:py-3 items-center gap-1 md:gap-3 w-full transition-all
              ${activeTab === tab ? 'opacity-100 font-bold scale-105' : 'opacity-60 hover:opacity-80'}
            `}
          >
            {getIcon(tab)}
            <span className="text-[10px] md:text-sm capitalize">{tab}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const SettingsPanel = ({ currentTheme, setTheme }: { currentTheme: AppTheme, setTheme: (t: AppTheme) => void }) => {
    const themes = Object.values(AppTheme);
    return (
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {themes.map(t => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition-all
                     ${currentTheme === t 
                        ? 'border-current opacity-100 shadow-md transform -translate-y-1' 
                        : 'border-transparent opacity-50 hover:opacity-75'}
                    `}
                >
                    {t}
                </button>
            ))}
        </div>
    )
}

// -- Main App Component --

export default function App() {
  const [theme, setTheme] = useState<AppTheme>(AppTheme.CLEAN_GIRL);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
  const [dailyTip, setDailyTip] = useState<string>("");
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([
      { role: 'model', text: "Hey bestie! I'm your GlowUp Guide. Ask me anything about budgeting, savings, or how to afford that dream trip!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Load daily tip on mount
    generateDailyTip(theme).then(setDailyTip);
  }, []);

  const handleAddFunds = (id: string, amount: number) => {
    setGoals(goals.map(g => {
        if (g.id === id) {
            const newAmount = g.currentAmount + amount;
            if (newAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
                // Celebration logic could go here
                alert(`✨ Goal Reached: ${g.title}! So proud of you! ✨`);
            }
            return { ...g, currentAmount: newAmount };
        }
        return g;
    }));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text: chatInput }];
    setChatHistory(newHistory);
    setChatInput("");
    setIsTyping(true);

    const response = await getFinancialAdvice(chatInput, `User Goals: ${goals.map(g=>g.title).join(', ')}. Theme Preference: ${theme}`);
    
    setChatHistory([...newHistory, { role: 'model', text: response }]);
    setIsTyping(false);
  };

  const calculateTotalSaved = () => goals.reduce((acc, curr) => acc + curr.currentAmount, 0);

  // Visualization Data
  const categories = transactions.reduce((acc, curr) => {
      if (curr.type === 'expense') {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      }
      return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.keys(categories).map(cat => ({ name: cat, value: categories[cat] }));
  const PIE_COLORS = theme === AppTheme.Y2K 
    ? ['#FF00FF', '#00FFFF', '#FFFF00', '#0000FF'] 
    : theme === AppTheme.DARK_ACADEMIA 
        ? ['#C5A059', '#4a3b2a', '#8b7355', '#2c241b']
        : ['#A3B18A', '#D4A373', '#E9EDC9', '#CCD5AE'];

  // -- Views --

  const renderDashboard = () => (
    <div className="space-y-6 animate-fadeIn">
        <header className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-display font-bold">Good Morning! ☀️</h2>
                <p className="opacity-70 text-sm mt-1">{dailyTip}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-current opacity-10 flex items-center justify-center">
                <UserCircle />
            </div>
        </header>

        <div className={`p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden
            ${theme === AppTheme.Y2K ? 'bg-y2k-blue border-4 border-y2k-pink text-black' : ''}
            ${theme === AppTheme.DARK_ACADEMIA ? 'bg-[#2c241b] border border-[#4a3b2a] text-[#C5A059]' : ''}
            ${theme === AppTheme.CLEAN_GIRL ? 'bg-stone-800 text-stone-50' : ''}
        `}>
            <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Total Saved</p>
            <h1 className="text-5xl font-bold font-display">${calculateTotalSaved().toLocaleString()}</h1>
            {theme === AppTheme.Y2K && <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 rotate-12">💸</div>}
        </div>

        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold">Active Goals</h3>
                <button onClick={() => setActiveTab('goals')} className="text-sm underline opacity-60">View All</button>
            </div>
            {goals.slice(0, 2).map(g => (
                <GoalCard key={g.id} goal={g} theme={theme} onAddFunds={handleAddFunds} />
            ))}
        </div>

        <div>
            <h3 className="text-xl font-bold mb-4">Daily Challenges</h3>
            <div className="grid gap-3">
                {challenges.map(c => (
                    <div key={c.id} className={`p-4 border rounded-xl flex items-center justify-between
                         ${c.active ? 'border-current bg-current/5' : 'opacity-60 border-transparent bg-gray-500/5'}
                    `}>
                        <div>
                            <h4 className="font-bold">{c.title}</h4>
                            <p className="text-xs opacity-70">{c.description}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold block">+{c.rewardXP} XP</span>
                            <button className="text-xs underline">{c.active ? 'Active' : 'Join'}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderBudget = () => (
    <div className="space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-display font-bold">Spending Aesthetic</h2>
        
        <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: theme === AppTheme.DARK_ACADEMIA ? '#2c241b' : '#fff',
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }} 
                        itemStyle={{ color: theme === AppTheme.DARK_ACADEMIA ? '#e5e0d8' : '#333' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-bold opacity-50">OCTOBER</span>
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 hover:bg-black/5 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                            ${theme === AppTheme.Y2K ? 'bg-pink-200' : 'bg-gray-200'}
                        `}>
                            {t.category === 'Food & Drink' ? '☕️' : t.category === 'Shopping' ? '🛍️' : '💸'}
                        </div>
                        <div>
                            <p className="font-bold">{t.title}</p>
                            <p className="text-xs opacity-60">{t.date}</p>
                        </div>
                    </div>
                    <span className={`font-mono font-bold ${t.type === 'income' ? 'text-green-500' : ''}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </span>
                </div>
            ))}
        </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6 animate-fadeIn">
         <div className="flex justify-between items-center">
            <h2 className="text-3xl font-display font-bold">Manifesting...</h2>
            <button className="w-10 h-10 rounded-full border border-current flex items-center justify-center hover:bg-current hover:text-white transition-colors">
                <Plus size={20} />
            </button>
         </div>

         <div className="grid gap-4">
             {goals.map(g => (
                 <GoalCard key={g.id} goal={g} theme={theme} onAddFunds={handleAddFunds} />
             ))}
         </div>

         <div className="p-6 rounded-2xl border-dashed border-2 border-current opacity-50 flex flex-col items-center justify-center text-center py-12">
            <p className="font-bold mb-2">Create New Goal</p>
            <p className="text-sm">Save for a car, apartment, or just a rainy day.</p>
         </div>
    </div>
  );

  const renderLearn = () => (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] flex flex-col animate-fadeIn">
        <h2 className="text-3xl font-display font-bold mb-4">GlowUp Guide ✨</h2>
        
        <div className={`flex-1 overflow-y-auto mb-4 p-4 rounded-2xl space-y-4
            ${theme === AppTheme.CLEAN_GIRL ? 'bg-white shadow-inner' : 'bg-black/10'}
        `}>
            {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm
                        ${msg.role === 'user' 
                            ? (theme === AppTheme.Y2K ? 'bg-y2k-pink text-white rounded-br-none' : 'bg-stone-800 text-white rounded-br-none') 
                            : (theme === AppTheme.Y2K ? 'bg-white border border-y2k-blue rounded-bl-none' : 'bg-white/80 shadow-sm rounded-bl-none text-current')}
                    `}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white/50 p-3 rounded-2xl text-xs italic opacity-70">
                        Typing...
                    </div>
                </div>
            )}
        </div>

        <form onSubmit={handleChatSubmit} className="relative">
            <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask for a tip, joke, or advice..."
                className={`w-full p-4 pr-12 rounded-xl focus:outline-none focus:ring-2 bg-transparent border
                    ${theme === AppTheme.Y2K ? 'border-y2k-pink focus:ring-y2k-blue placeholder-pink-300' : ''}
                    ${theme === AppTheme.DARK_ACADEMIA ? 'border-[#4a3b2a] focus:ring-[#C5A059]' : ''}
                    ${theme === AppTheme.CLEAN_GIRL ? 'border-stone-200 focus:ring-stone-400 bg-white' : ''}
                `}
            />
            <button 
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="absolute right-3 top-3 p-1 rounded-full hover:bg-black/5 disabled:opacity-30"
            >
                <Sparkles size={20} />
            </button>
        </form>
    </div>
  );

  return (
    <ThemeWrapper theme={theme}>
        <div className="flex min-h-screen">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
            
            <main className="flex-1 p-6 md:p-12 mb-16 md:mb-0 max-w-4xl mx-auto w-full">
                <div className="flex justify-end mb-4">
                    <SettingsPanel currentTheme={theme} setTheme={setTheme} />
                </div>
                
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'budget' && renderBudget()}
                {activeTab === 'goals' && renderGoals()}
                {activeTab === 'learn' && renderLearn()}
            </main>
        </div>
    </ThemeWrapper>
  );
}
