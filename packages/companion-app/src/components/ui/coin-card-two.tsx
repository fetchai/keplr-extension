import Image from '@/components/ui/image';
import { ArrowUp } from '@/components/icons/arrow-up';
import { Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { StaticImageData } from 'next/image';

type CoinCardProps = {
  id: string;
  name: string;
  symbol: string;
  logo: StaticImageData;
  balance: string;
  usdBalance: string;
  change: string;
  isChangePositive: boolean;
  color?: string;
};

export function CoinCard({
  name,
  symbol,
  logo,
  balance,
  usdBalance,
  change,
  isChangePositive,
  color = '#FDEDD4',
}: CoinCardProps) {
  return (
    <div
      className="relative flex flex-col rounded-lg px-8 py-8 xl:flex-row xl:py-0 3xl:justify-center "
      style={{ backgroundColor: color }}
    >
      <div className="relative h-20 w-16 rtl:order-2 lg:h-24 xl:h-32 3xl:h-36">
        <Image src={logo} alt={name} fill priority />
      </div>
      <div className="content mt-2 xl:px-8">
        <div className="mt-8 mb-2 text-sm font-medium tracking-wider text-gray-900 lg:text-lg 2xl:text-xl 3xl:text-2xl">
          {balance}
          <span className="uppercase"> {symbol}</span>
        </div>
        <div className="flex items-center justify-between text-xs font-medium 2xl:text-sm">
          <span className="tracking-wider text-gray-600">{usdBalance} USD</span>
          <span
            className={`flex items-center  ${
              isChangePositive ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <span
              className={`ltr:mr-2 rtl:ml-2 ${
                !isChangePositive ? 'rotate-180' : ''
              }`}
            >
              <ArrowUp />
            </span>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CoinSliderProps {
  coins: CoinCardProps[];
}

export default function CoinSlider({ coins }: CoinSliderProps) {
  const sliderBreakPoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1700: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1900: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  };

  return (
    <div>
      <Swiper
        modules={[Scrollbar, A11y]}
        spaceBetween={24}
        slidesPerView={1}
        scrollbar={{ draggable: true }}
        breakpoints={sliderBreakPoints}
        observer={true}
        dir="ltr"
      >
        {coins.map((coin) => (
          <SwiperSlide key={coin.id}>
            <CoinCard
              id={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              logo={coin.logo}
              balance={coin.balance}
              usdBalance={coin.usdBalance}
              change={coin.change}
              isChangePositive={coin.isChangePositive}
              color={coin.color}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
