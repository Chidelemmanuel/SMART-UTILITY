import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ruler, Scale, Thermometer, StickyNote, Calculator, Timer, Settings, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  onSelect: (tool: string) => void;
}

export default function Dashboard({ onSelect }: DashboardProps) {
  const tools = [
    {
      id: 'converter',
      title: 'Unit Converter',
      description: 'Length, Weight, Temp & more',
      icon: Ruler,
      color: 'bg-blue-500/10 text-blue-500',
      borderColor: 'border-blue-500/20',
    },
    {
      id: 'notes',
      title: 'Smart Notes',
      description: 'Quick thoughts & to-dos',
      icon: StickyNote,
      color: 'bg-amber-500/10 text-amber-500',
      borderColor: 'border-amber-500/20',
    },
    {
      id: 'calculator',
      title: 'Calculator',
      description: 'Basic & Scientific math',
      icon: Calculator,
      color: 'bg-emerald-500/10 text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'stopwatch',
      title: 'Stopwatch',
      description: 'Precision time tracking',
      icon: Timer,
      color: 'bg-rose-500/10 text-rose-500',
      borderColor: 'border-rose-500/20',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">All-in-one</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Utility Toolkit</h1>
        <p className="text-muted-foreground">Everything you need, right at your fingertips.</p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {tools.map((tool) => (
          <motion.div key={tool.id} variants={item}>
            <Card 
              className={`group cursor-pointer hover:shadow-xl transition-all border-2 ${tool.borderColor} bg-card/50 backdrop-blur-sm overflow-hidden relative`}
              onClick={() => onSelect(tool.id)}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <tool.icon className="w-24 h-24 -mr-8 -mt-8" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center shadow-inner`}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                  <div className="h-12 flex items-center">
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-bold">Quick Settings</h4>
            <p className="text-xs text-muted-foreground">Customize your toolkit experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
