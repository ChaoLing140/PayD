import { useState, useEffect } from 'react';

export const CountdownTimer = ({ targetDate }: { targetDate: Date | null }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      return true;
    };

    if (!updateTimeLeft()) return;

    const interval = setInterval(() => {
      if (!updateTimeLeft()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!targetDate) return null;

  const segments = [
    { key: 'days', label: 'Days', value: String(timeLeft.days) },
    { key: 'hours', label: 'Hrs', value: timeLeft.hours.toString().padStart(2, '0') },
    { key: 'minutes', label: 'Min', value: timeLeft.minutes.toString().padStart(2, '0') },
    { key: 'seconds', label: 'Sec', value: timeLeft.seconds.toString().padStart(2, '0') },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
      role="timer"
      aria-live="polite"
      aria-label="Time remaining until the next scheduled payroll run"
    >
      {segments.map((segment) => (
        <div
          key={segment.key}
          className="flex min-w-[4.5rem] flex-col items-center rounded-xl border border-hi bg-black/15 px-3 py-2"
        >
          <span className="text-2xl font-mono font-black text-accent">{segment.value}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted">{segment.label}</span>
        </div>
      ))}
    </div>
  );
};
