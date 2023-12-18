import { ExportIcon } from '@/components/icons/export-icon';

interface VoteActionsTypes {
  title: string;
  action?: {
    id?: string;
    contract: {
      id: string;
      link: string;
    };
    method: string;
    inputs: string;
  }[];
}

export default function VoteActions({ title, action }: VoteActionsTypes) {
  return (
    <>
      <h4 className="mb-6 uppercase dark:text-gray-100">{title}</h4>
      {action?.map((item: any, index: number) => (
        <div key={item.id} className="mt-6">
          <div className="flex items-start gap-3">
            <span className="shrink-0 text-gray-600 dark:text-gray-400">
              {index + 1}
            </span>
            <div className="grid gap-4">
              <div className="flex items-start gap-1">
                <span className="w-20 shrink-0 text-gray-600 dark:text-gray-400">
                  Contract:
                </span>{' '}
                <a
                  href={item.contract.link}
                  className="inline-flex items-center gap-1.5 font-medium hover:underline hover:opacity-90 focus:underline focus:opacity-90 dark:text-gray-300"
                >
                  <span className="shrink-0">{item.contract.id}</span>
                  <ExportIcon className="h-auto w-3" />
                </a>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-20 shrink-0 text-gray-600 dark:text-gray-400">
                  Function:
                </span>{' '}
                <span className="font-medium dark:text-gray-300">
                  {item.method}
                </span>
              </div>
              <div className="flex items-start gap-1">
                <span className="w-20 shrink-0 text-gray-600 dark:text-gray-400">
                  Inputs:
                </span>{' '}
                <span className="word-break-all font-medium leading-relaxed dark:text-gray-300">
                  {item.inputs}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
