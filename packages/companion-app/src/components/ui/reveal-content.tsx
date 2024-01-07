import { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import Button from '@/components/ui/button';

interface RevealContentTypes {
  defaultHeight: number;
  className?: string;
}

export default function RevealContent({
  children,
  defaultHeight,
  className,
}: React.PropsWithChildren<RevealContentTypes>) {
  let [showContent, setShowContent] = useState(false);
  let revealEl = useRef<HTMLDivElement>(null!);
  let revealChildEl = useRef<HTMLDivElement>(null!);
  function handleRevealContent() {
    if (revealEl.current.scrollHeight > defaultHeight) {
      // set timeout need to show btn feedback
      setTimeout(() => {
        setShowContent(true);
      }, 500);
    }
  }
  useEffect(() => {
    if (revealChildEl.current.clientHeight <= defaultHeight) {
      setShowContent(true);
    }
  }, [setShowContent, defaultHeight]);
  return (
    <div className={className}>
      <div
        ref={revealEl}
        style={{ height: !showContent ? `${defaultHeight}px` : 'auto' }}
        className={cn(!showContent && 'overflow-hidden')}
      >
        <div ref={revealChildEl}>{children}</div>
      </div>
      {!showContent && (
        <div className="before:content-[' '] relative from-white pt-3 before:absolute before:-top-8 before:block before:h-8 before:w-full before:bg-gradient-to-t dark:from-light-dark">
          <Button
            size="mini"
            shape="rounded"
            // variant="ghost"
            onClick={() => handleRevealContent()}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}
