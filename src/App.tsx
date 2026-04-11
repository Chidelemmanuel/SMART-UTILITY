/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Ruler, 
  StickyNote, 
  Calculator as CalcIcon, 
  Timer,
  ChevronLeft,
  Menu,
  X,
  Settings,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Dashboard from '@/src/components/Dashboard';
import UnitConverter from '@/src/components/UnitConverter';
import Notes from '@/src/components/Notes';
import Calculator from '@/src/components/Calculator';
import Stopwatch from '@/src/components/Stopwatch';

type View = 'dashboard' | 'converter' | 'notes' | 'calculator' | 'stopwatch';

export default function App() {
  const [currentView, setCurrentView] = React.useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'converter', label: 'Unit Converter', icon: Ruler },
    { id: 'notes', label: 'Smart Notes', icon: StickyNote },
    { id: 'calculator', label: 'Calculator', icon: CalcIcon },
    { id: 'stopwatch', label: 'Stopwatch', icon: Timer },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onSelect={(id) => setCurrentView(id as View)} />;
      case 'converter': return <UnitConverter />;
      case 'notes': return <Notes />;
      case 'calculator': return <Calculator />;
      case 'stopwatch': return <Stopwatch />;
      default: return <Dashboard onSelect={(id) => setCurrentView(id as View)} />;
    }
  };

  const currentTitle = navItems.find(item => item.id === currentView)?.label || 'Toolkit';

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-foreground font-sans selection:bg-primary/20">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">Toolkit</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-1 py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as View);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentView === item.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                <Info className="w-5 h-5" />
                About
              </button>
            </div>
          </ScrollArea>

          <div className="p-6 border-t">
            <div className="p-4 rounded-2xl bg-muted/50 border border-muted flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                EZ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Emmanuel Ozochi</p>
                <p className="text-[10px] text-muted-foreground truncate">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            {currentView !== 'dashboard' && (
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('dashboard')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <h2 className="font-bold text-lg">{currentTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

