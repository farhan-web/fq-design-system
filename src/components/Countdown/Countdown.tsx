import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';

import './Countdown.css';

export type CountdownVariant = 'danger' | 'warning' | 'neutral';
export type CountdownDisplay = 'boxed' | 'unboxed' | 'unboxed-small';

export interface CountdownProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  /** Target date/time to count down to */
  targetDate?: Date;
  /** Remaining seconds (alternative to targetDate) */
  seconds?: number;
  variant?: CountdownVariant;
  /** Display mode: boxed (pill segments), unboxed (plain text), unboxed-small (plain text, smaller) */
  display?: CountdownDisplay;
  /** Show hours segment */
  showHours?: boolean;
  /** Show centiseconds (.xx) after seconds */
  showMilliseconds?: boolean;
  onExpire?: () => void;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function getRemainingSeconds(target: Date): number {
  return Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
}

export const Countdown = forwardRef<HTMLSpanElement, CountdownProps>(
  (
    {
      targetDate,
      seconds: initialSeconds,
      variant = 'danger',
      display = 'boxed',
      showHours = false,
      showMilliseconds = false,
      onExpire,
      className,
      ...props
    },
    ref,
  ) => {
    const getInitial = () =>
      targetDate ? getRemainingSeconds(targetDate) : (initialSeconds ?? 0);

    const [remaining, setRemaining] = useState(getInitial);
    const [centis, setCentis] = useState(0);
    const centisRef = useRef(0);

    useEffect(() => {
      setRemaining(getInitial());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetDate, initialSeconds]);

    useEffect(() => {
      if (remaining <= 0) {
        onExpire?.();
        return;
      }
      const id = setInterval(() => {
        setRemaining((prev) => {
          const next = targetDate ? getRemainingSeconds(targetDate) : prev - 1;
          if (next <= 0) {
            clearInterval(id);
            onExpire?.();
            return 0;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remaining > 0]);

    useEffect(() => {
      if (!showMilliseconds || remaining <= 0) return;
      const id = setInterval(() => {
        if (targetDate) {
          const ms = Math.max(0, targetDate.getTime() - Date.now());
          setCentis(Math.floor((ms % 1000) / 10));
        } else {
          centisRef.current = (centisRef.current - 1 + 100) % 100;
          setCentis(centisRef.current);
        }
      }, 10);
      return () => clearInterval(id);
    }, [showMilliseconds, remaining, targetDate]);

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    const expired = remaining === 0;

    const cls = [
      'fq-countdown',
      `fq-countdown--${variant}`,
      display !== 'boxed' ? `fq-countdown--${display}` : '',
      expired ? 'fq-countdown--expired' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        {...props}
        ref={ref}
        className={cls}
        role="timer"
        aria-live="off"
        aria-label={
          expired
            ? 'Expired'
            : showHours
              ? `${hours}h ${minutes}m ${secs}s remaining`
              : `${minutes}m ${secs}s remaining`
        }
      >
        {showHours && (
          <>
            <span className="fq-countdown__segment">{pad(hours)}</span>
            <span className="fq-countdown__sep" aria-hidden="true">
              :
            </span>
          </>
        )}
        <span className="fq-countdown__segment">{pad(minutes)}</span>
        <span className="fq-countdown__sep" aria-hidden="true">
          :
        </span>
        <span className="fq-countdown__segment">{pad(secs)}</span>
        {showMilliseconds && (
          <>
            <span className="fq-countdown__sep" aria-hidden="true">
              .
            </span>
            <span className="fq-countdown__segment fq-countdown__segment--centis">
              {pad(centis)}
            </span>
          </>
        )}
      </span>
    );
  },
);

Countdown.displayName = 'Countdown';
