import React from 'react';
import { AppTheme } from '../types';

interface ThemeWrapperProps {
  theme: AppTheme;
  children: React.ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  let themeClasses = "";

  switch (theme) {
    case AppTheme.Y2K:
      themeClasses = "bg-fuchsia-100 text-blue-900 font-display selection:bg-y2k-pink selection:text-white";
      break;
    case AppTheme.DARK_ACADEMIA:
      themeClasses = "bg-[#1a1612] text-[#e5e0d8] font-serif selection:bg-dark-gold selection:text-black";
      break;
    case AppTheme.CLEAN_GIRL:
    default:
      themeClasses = "bg-stone-50 text-stone-700 font-sans selection:bg-clean-sage selection:text-white";
      break;
  }

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 ease-in-out ${themeClasses}`}>
      {children}
    </div>
  );
};
