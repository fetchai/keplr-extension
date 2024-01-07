import cn from 'classnames';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';

const data = [
  {
    name: 'Page A',
    uv: 1200,
    pv: 800,
  },
  {
    name: 'Page B',
    uv: 2600,
    pv: 100,
  },
  {
    name: 'Page C',
    uv: 1900,
    pv: 1600,
  },
  {
    name: 'Page D',
    uv: 2280,
    pv: 1508,
  },
  {
    name: 'Page E',
    uv: 1290,
    pv: 3500,
  },
  {
    name: 'Page F',
    uv: 1690,
    pv: 3000,
  },
  {
    name: 'Page G',
    uv: 2590,
    pv: 4500,
  },
];

interface Props {
  chartWrapperClass?: string;
}

export default function OverviewChart({ chartWrapperClass }: Props) {
  const { layout } = useLayout();

  return (
    <div
      className={cn(
        'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
        {
          'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
        }
      )}
    >
      <h3 className="text-xl font-medium tracking-tighter text-white sm:text-3xl">
        74.8%
      </h3>
      <p className="mt-2 mb-1 text-xs font-medium text-gray-400 sm:text-sm">
        Compare to $1,812 last week
      </p>
      <div className={cn('h-60 w-full', chartWrapperClass)}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="natural"
              dataKey="pv"
              stroke="#1E40AF"
              strokeWidth={4}
              dot={false}
            />
            <Line
              type="natural"
              dataKey="uv"
              stroke="#374151"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
