import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Delete, Equal, Minus, Plus, X, Percent, RotateCcw } from 'lucide-react';

export default function Calculator() {
  const [display, setDisplay] = React.useState('0');
  const [equation, setEquation] = React.useState('');
  const [shouldReset, setShouldReset] = React.useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setShouldReset(true);
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      // Using Function constructor as a safer alternative to eval for simple math
      // In a real app, use a math library
      const result = new Function(`return ${fullEquation.replace(/x/g, '*').replace(/÷/g, '/')}`)();
      setDisplay(String(Number(result.toFixed(8))));
      setEquation('');
      setShouldReset(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setShouldReset(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setShouldReset(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const buttons = [
    { label: 'C', action: clear, variant: 'secondary' as const },
    { label: 'DEL', action: backspace, variant: 'secondary' as const, icon: Delete },
    { label: '%', action: () => setDisplay(String(parseFloat(display) / 100)), variant: 'secondary' as const },
    { label: '÷', action: () => handleOperator('/'), variant: 'primary' as const },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    { label: 'x', action: () => handleOperator('*'), variant: 'primary' as const },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    { label: '-', action: () => handleOperator('-'), variant: 'primary' as const },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    { label: '+', action: () => handleOperator('+'), variant: 'primary' as const },
    { label: '0', action: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', action: () => !display.includes('.') && handleNumber('.') },
    { label: '=', action: calculate, variant: 'primary' as const },
  ];

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-[360px] border-none shadow-2xl bg-card/50 backdrop-blur-md overflow-hidden">
        <div className="p-6 bg-muted/20 text-right space-y-1">
          <p className="text-sm text-muted-foreground h-5 font-mono">{equation}</p>
          <p className="text-4xl font-bold tracking-tighter truncate font-mono">{display}</p>
        </div>
        <CardContent className="p-4 grid grid-cols-4 gap-3">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              variant={btn.variant === 'primary' ? 'default' : btn.variant === 'secondary' ? 'secondary' : 'outline'}
              className={`h-14 text-lg font-semibold rounded-2xl transition-all active:scale-95 ${btn.className || ''} ${
                btn.variant === 'primary' ? 'bg-primary shadow-lg shadow-primary/20' : ''
              }`}
              onClick={btn.action}
            >
              {btn.icon ? <btn.icon className="w-5 h-5" /> : btn.label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
