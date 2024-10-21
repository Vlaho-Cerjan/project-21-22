'use client';

import React, {useRef} from 'react';

export default function InlineModal({
  children,
  id,
  className,
  wrapperClassName,
  ...props
}: React.DetailsHTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  id?: string;
  className?: string;
  wrapperClassName?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const classes = React.useMemo(() => {
    const classesTemp = {
      classes: ['modal inlineModal'],
    };
    if (className) classesTemp.classes.push(className);
    return classesTemp.classes.join(' ');
  }, [className]);

  return (
    <div {...props} id={id || undefined} className={classes} ref={modalRef}>
      <div
        data-testid="modalContent"
        className="modalContent"
        ref={modalContentRef}
      >
        <div
          data-testid="modalWrapper"
          className={`modalWrapper ${wrapperClassName}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
