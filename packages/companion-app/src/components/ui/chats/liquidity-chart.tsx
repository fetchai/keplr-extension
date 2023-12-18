import { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LiquidityData } from '@/data/static/liquidity';

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value * 1000), 'd');
  return (
    <g
      transform={`translate(${x},${y})`}
      className="text-xs text-gray-500 md:text-sm"
    >
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor">
        {date}
      </text>
    </g>
  );
}

const numberAbbr = (number: any) => {
  if (number < 1e3) return number;
  if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
  if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
  if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
};

export default function LiquidityChart() {
  let [date, setDate] = useState(1624147200);
  let [liquidity, setLiquidity] = useState('547792029');
  const formattedDate = format(new Date(date * 1000), 'MMMM d, yyyy');
  const dailyLiquidity = numberAbbr(liquidity);

  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
        Liquidity
      </h3>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        {dailyLiquidity}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {formattedDate}
      </div>
      <div className="mt-5 h-64 sm:mt-8 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={LiquidityData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(data) => {
              if (data.isTooltipActive) {
                setDate(
                  data.activePayload && data.activePayload[0].payload.date
                );
                setLiquidity(
                  data.activePayload &&
                    data.activePayload[0].payload.dailyVolumeUSD
                );
              }
            }}
          >
            <defs>
              <linearGradient
                id="liquidity-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#bc9aff" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7645D9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomAxis />}
              interval={0}
              tickMargin={5}
            />
            <Tooltip content={<></>} cursor={{ stroke: '#7645D9' }} />
            <Area
              type="linear"
              dataKey="dailyVolumeUSD"
              stroke="#7645D9"
              strokeWidth={1.5}
              fill="url(#liquidity-gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
