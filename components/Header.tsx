
import React from 'react';
import Logo from './Logo';

interface HeaderProps {
  isAdmin: boolean;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onMenuToggle }) => {
  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-3rem)] max-w-7xl z-[100] px-2 md:px-4">
      <header className="h-20 md:h-28 flex items-center justify-between px-4 md:px-10 bg-white/70 dark:bg-surface-dark/80 backdrop-blur-3xl border border-slate-200 dark:border-border-dark rounded-2xl md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all">
        <div className="flex flex-1 items-center gap-2 md:gap-10">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>

          {/* Logo Scaling */}
          <div className="flex items-center">
            <Logo size={window.innerWidth < 768 ? 60 : 120} showText={false} className="!items-start" />
          </div>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:flex w-full max-w-lg items-center bg-slate-100/50 dark:bg-background-dark/50 px-4 md:px-6 py-2.5 md:py-4 rounded-xl md:rounded-2xl border border-slate-200/50 dark:border-border-dark/50 group focus-within:ring-4 focus-within:ring-primary/20 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-xl md:text-2xl group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder={isAdmin ? "Search global clusters..." : "Search docs..."}
              className="bg-transparent border-none focus:ring-0 text-xs md:text-sm w-full dark:text-white placeholder:text-slate-400 px-2 md:px-4 font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-10">
          <div className="flex items-center gap-2 md:gap-6">
            <button className="relative p-2 md:p-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl transition-all hover:scale-110 active:scale-95 border border-transparent">
              <span className="material-symbols-outlined text-2xl md:text-3xl">notifications</span>
              <span className="absolute top-2 md:top-4 right-2 md:right-4 size-2.5 md:size-3 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
            <button className="hidden xs:block p-2 md:p-4 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl transition-all hover:scale-110 active:scale-95 border border-transparent">
              <span className="material-symbols-outlined text-2xl md:text-3xl">settings</span>
            </button>
          </div>

          <div className="h-10 md:h-12 w-px bg-slate-200 dark:bg-border-dark mx-1 md:mx-2"></div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg uppercase tracking-widest border border-emerald-500/20 shadow-sm">Live System</span>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 opacity-60">ID: US-EAST-1A</p>
            </div>
            <div 
              className="size-10 md:size-16 rounded-xl md:rounded-2xl border-2 border-primary/20 bg-cover bg-center cursor-pointer hover:border-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/10"
              style={{ backgroundImage: `url(https://picsum.photos/100?random=${isAdmin ? 'a' : 'u'})` }}
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
