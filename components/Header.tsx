import React from 'react';
import { Sparkles, FlaskConical } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-darker/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              JSON Alchemist
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>Powered by Gemini 3 Pro</span>
          </div>
        </div>
      </div>
    </header>
  );
};
