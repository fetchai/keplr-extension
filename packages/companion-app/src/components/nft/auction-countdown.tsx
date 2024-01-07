import React from 'react';
import cn from 'classnames';
import Countdown, { zeroPad } from 'react-countdown';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';

function CountdownDisplayWrapper({ days, hours, minutes, seconds }: any) {
  const { layout } = useLayout();

  return (
    <div
      className={cn(
        'flex items-center text-base font-medium -tracking-wider text-gray-900 dark:text-gray-100 xs:text-lg md:text-xl xl:text-xl 2xl:text-2xl',
        {
          'gap-3 md:gap-2.5 lg:gap-6 xl:gap-5 ':
            layout !== LAYOUT_OPTIONS.RETRO,
          'gap-4 lg:gap-2.5 rtl:lg:gap-1.5 3xl:gap-5':
            layout === LAYOUT_OPTIONS.RETRO,
        }
      )}
    >
      {!!days && (
        <div className="shrink-0 3xl:w-20">
          <span className="">{zeroPad(days)}</span>
          <span
            className={cn({
              'md:hidden': layout !== LAYOUT_OPTIONS.RETRO,
              'lg:hidden': layout === LAYOUT_OPTIONS.RETRO,
            })}
          >
            d
          </span>
          <span
            className={cn(
              'hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 ',
              {
                'md:block': layout !== LAYOUT_OPTIONS.RETRO,
                'lg:block': layout === LAYOUT_OPTIONS.RETRO,
              }
            )}
          >
            Days
          </span>
        </div>
      )}
      <div className="shrink-0 3xl:w-20">
        <span className="">{zeroPad(hours)}</span>
        <span
          className={cn({
            'md:hidden': layout !== LAYOUT_OPTIONS.RETRO,
            'lg:hidden': layout === LAYOUT_OPTIONS.RETRO,
          })}
        >
          h
        </span>
        <span
          className={cn(
            'hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400',
            {
              'md:block': layout !== LAYOUT_OPTIONS.RETRO,
              'lg:block': layout === LAYOUT_OPTIONS.RETRO,
            }
          )}
        >
          Hours
        </span>
      </div>
      <div className="shrink-0 3xl:w-20">
        <span className="">{zeroPad(minutes)}</span>
        <span
          className={cn({
            'md:hidden': layout !== LAYOUT_OPTIONS.RETRO,
            'lg:hidden': layout === LAYOUT_OPTIONS.RETRO,
          })}
        >
          m
        </span>
        <span
          className={cn(
            'hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 ',
            {
              'md:block': layout !== LAYOUT_OPTIONS.RETRO,
              'lg:block': layout === LAYOUT_OPTIONS.RETRO,
            }
          )}
        >
          Minutes
        </span>
      </div>
      <div className="shrink-0 3xl:w-20">
        <span className="">{zeroPad(seconds)}</span>
        <span
          className={cn({
            'md:hidden': layout !== LAYOUT_OPTIONS.RETRO,
            'lg:hidden': layout === LAYOUT_OPTIONS.RETRO,
          })}
        >
          s
        </span>
        <span
          className={cn(
            'hidden truncate pt-2.5 text-sm -tracking-wide text-gray-600 dark:text-gray-400 ',
            {
              'md:block': layout !== LAYOUT_OPTIONS.RETRO,
              'lg:block': layout === LAYOUT_OPTIONS.RETRO,
            }
          )}
        >
          Seconds
        </span>
      </div>
    </div>
  );
}

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return null;
  } else {
    return (
      <CountdownDisplayWrapper
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default function AuctionCountdown({
  date,
}: {
  date: string | number | Date | undefined;
}) {
  return <Countdown date={date} renderer={renderer} />;
}
