import { motion } from 'framer-motion';

interface VotePollTypes {
  title: string;
  accepted?: {
    vote: number;
    percentage: number;
  };
  rejected?: {
    vote: number;
    percentage: number;
  };
}

export default function VotePoll({ title, accepted, rejected }: VotePollTypes) {
  return (
    <motion.div layout className="mb-6">
      <h4 className="mb-3 uppercase dark:text-gray-100">{title}</h4>
      <div className="mb-3">
        <svg width="100%" height="8">
          <rect x="0" y="0" width="100%" height="8" fill="#FA606A" />
          <rect
            x="0"
            y="0"
            height="8"
            fill="#28D294"
            width={`${accepted?.percentage}%`}
          />
        </svg>
      </div>
      <div className="flex items-start justify-between">
        <div className="text-green-500 ltr:text-left rtl:text-right">
          <h5 className="mb-1 font-medium uppercase sm:mb-2 sm:text-base">
            Accepted
          </h5>
          <p>
            {accepted?.vote} ({accepted?.percentage}%)
          </p>
        </div>
        <div className="text-red-500 ltr:text-right rtl:text-left">
          <h5 className="mb-1 font-medium uppercase sm:mb-2 sm:text-base">
            Rejected
          </h5>
          <p>
            {rejected?.vote} ({rejected?.percentage}%)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
