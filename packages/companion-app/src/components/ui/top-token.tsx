import { TopTokensData } from '@/data/static/token-data';

export default function TopToken() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-large">
      <h3 className="mb-6 text-base font-medium uppercase">Top Token</h3>
      <div className="mb-5 grid grid-cols-3 gap-4 text-sm text-gray-500">
        <div className="col-span-2">Name</div>
        <div>Volume</div>
      </div>
      {TopTokensData.map((token, index) => (
        <div
          className="mb-5 grid grid-cols-3 gap-4 text-sm text-gray-900 last:mb-0"
          key={index}
        >
          <div className="col-span-2 flex items-center gap-2">
            {token.icon}
            <span>{token.name}</span>
          </div>
          <div>{token.volume}</div>
        </div>
      ))}
    </div>
  );
}
