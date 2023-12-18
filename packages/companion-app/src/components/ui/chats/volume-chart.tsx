import { useState } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { VolumeData } from '@/data/static/volume';

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value * 1000), 'd');
  return (
    <g transform={`translate(${x},${y})`} className="text-sm text-gray-500">
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

export default function VolumeChart() {
  let [date, setDate] = useState(1624147200);
  let [volume, setVolume] = useState('547792029');
  const formattedDate = format(new Date(date * 1000), 'MMMM d, yyyy');
  const dailyVolume = numberAbbr(volume);

  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
        Volume 24h
      </h3>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        {dailyVolume}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {formattedDate}
      </div>
      <div className="mt-5 h-56 sm:mt-8 md:mt-16 lg:mt-8 lg:h-64 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={VolumeData}
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
                setVolume(
                  data.activePayload &&
                    data.activePayload[0].payload.dailyVolumeUSD
                );
              }
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomAxis />}
              interval={0}
              tickMargin={5}
            />
            <Tooltip
              content={<></>}
              cursor={{ strokeWidth: 0, fill: '#dffdff' }}
            />
            <Bar type="monotone" dataKey="dailyVolumeUSD" fill="#1FC7D4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
