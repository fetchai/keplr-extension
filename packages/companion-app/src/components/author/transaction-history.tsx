import Button from '@/components/ui/button';
import TransactionHistoryCard from '@/components/author/transaction-history-card';
// static data
import { transactionHistory } from '@/data/static/author-profile';

export default function TransactionHistory() {
  return (
    <div className="block">
      <div className="mb-4 flex md:mb-5 md:justify-end xl:mb-6">
        <Button
          className="w-full shadow-button md:w-auto md:px-5"
          size="small"
          shape="rounded"
        >
          DOWNLOAD CSV
        </Button>
      </div>
      <div className="space-y-4 md:space-y-5 xl:space-y-6">
        {transactionHistory?.map((item) => (
          <TransactionHistoryCard item={item} key={item?.id} />
        ))}
      </div>
    </div>
  );
}
