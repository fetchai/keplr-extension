import { useState } from 'react';
import { Close } from '@/components/icons/close';

interface AlertProps {}

export default function Alert({
  children,
}: React.PropsWithChildren<AlertProps>) {
  let [isHidden, setIsHidden] = useState(false);

  if (!isHidden) {
    return (
      <div className="relative rounded-lg bg-white py-4 shadow-card ltr:pl-4 ltr:pr-8 rtl:pr-4 rtl:pl-8 dark:bg-light-dark sm:py-6 sm:ltr:pr-10 sm:ltr:pl-6 sm:rtl:pl-10 sm:rtl:pr-6">
        {children}

        <div
          className="absolute top-2 cursor-pointer p-2 text-gray-900 transition-all hover:scale-105 ltr:right-2 rtl:left-2 dark:text-white"
          onClick={() => setIsHidden(!isHidden)}
        >
          <Close className="h-auto w-3" />
        </div>
      </div>
    );
  } else {
    return null;
  }
}
