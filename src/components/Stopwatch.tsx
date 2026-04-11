import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Flag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Stopwatch() {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [laps, setLaps] = React.useState<number[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startStop = () => {
    if (isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([time, ...laps]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8 h-full">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Visual ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/20"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="754"
            animate={{ strokeDashoffset: 754 - (754 * (time % 60000)) / 60000 }}
            className="text-primary"
          />
        </svg>
        
        <div className="text-center z-10">
          <p className="text-5xl font-mono font-bold tracking-tight text-primary">
            {formatTime(time)}
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 font-semibold">
            Stopwatch
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 p-0"
          onClick={reset}
          disabled={time === 0 && !isRunning}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        <Button
          variant={isRunning ? "secondary" : "default"}
          size="lg"
          className="rounded-full w-20 h-20 p-0 shadow-xl"
          onClick={startStop}
        >
          {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full w-16 h-16 p-0"
          onClick={addLap}
          disabled={!isRunning}
        >
          <Flag className="w-6 h-6" />
        </Button>
      </div>

      <Card className="w-full max-w-md border-none bg-card/50 backdrop-blur-sm flex-1 overflow-hidden flex flex-col">
        <CardHeader className="py-4 border-bottom">
          <CardTitle className="text-sm flex items-center gap-2">
            <TimerIcon className="w-4 h-4" />
            Laps
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            <AnimatePresence initial={false}>
              {laps.map((lap, index) => (
                <motion.div
                  key={laps.length - index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-transparent hover:border-muted-foreground/10 transition-colors"
                >
                  <span className="text-xs font-bold text-muted-foreground">
                    Lap {laps.length - index}
                  </span>
                  <span className="font-mono font-medium">
                    {formatTime(lap)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {laps.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                No laps recorded
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
