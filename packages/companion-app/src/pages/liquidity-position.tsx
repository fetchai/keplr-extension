import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { NextSeo } from 'next-seo';
import Button from '@/components/ui/button';
import TransactionInfo from '@/components/ui/transaction-info';
import { ChevronDown } from '@/components/icons/chevron-down';
import Alert from '@/components/ui/alert';
import CurrencySwapIcons from '@/components/ui/currency-swap-icons';
import RootLayout from '@/layouts/_root-layout';

const LiquidityPositionPage: NextPageWithLayout = () => {
  let [isExpand, setIsExpand] = useState(false);
  return (
    <>
      <NextSeo
        title="Liquidity Position"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full max-w-lg text-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white sm:mb-6 sm:text-2xl">
          My Liquidity position
        </h3>
        <Alert>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-900 dark:text-white">
            Liquidity Provider Rewards
          </h4>
          <p className="m-0 text-sm leading-relaxed tracking-tighter text-gray-600 dark:text-gray-400">
            Liquidity providers earns a 0.25% fee on all trades proportional to
            their share of the pool. Fees are added to the pool, accrue in real
            time and can be claimed by withdrawing your liquidity
          </p>
        </Alert>

        <div className="mt-6 rounded-lg bg-white p-4 shadow-card dark:bg-light-dark sm:p-6">
          <div className="rounded-lg border border-solid border-gray-200 bg-body dark:border-gray-700 dark:bg-dark">
            <div
              className="flex h-16 w-full cursor-pointer items-center justify-between p-3"
              onClick={() => setIsExpand(!isExpand)}
            >
              <CurrencySwapIcons from="BTC" to="ETH" />

              <span className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                Manage
                <ChevronDown
                  className={`transition-all ltr:ml-1.5 rtl:mr-1.5 ${
                    isExpand ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </span>
            </div>
            <AnimatePresence initial={false}>
              {isExpand && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: 'auto' },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                  <div className="border-t border-dashed border-gray-200 p-4 dark:border-gray-700 sm:p-6">
                    <div className="flex flex-col gap-3 xs:gap-[18px]">
                      <TransactionInfo
                        label="YOUR TOTAL POOL TOKEN:"
                        value="22.51"
                      />
                      <TransactionInfo
                        label="POOLED BTC:"
                        value="0.01940272 BTC"
                      />
                      <TransactionInfo
                        label="POOLED ETH:"
                        value="0.14689574 ETH"
                      />
                      <TransactionInfo label="YOUR POOL SHARE:" value="0.06%" />
                    </div>
                    <Button
                      size="large"
                      shape="rounded"
                      fullWidth={true}
                      color="gray"
                      className="mt-6 uppercase dark:bg-gray-800"
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              className="uppercase"
            >
              Add
            </Button>
            <Button
              size="large"
              shape="rounded"
              fullWidth={true}
              color="gray"
              className="uppercase dark:bg-gray-800"
            >
              Import
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

LiquidityPositionPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default LiquidityPositionPage;
