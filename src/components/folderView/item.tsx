import type {LegacyRef, ReactNode} from 'react';
import {forwardRef} from 'react';

interface ItemProps {
  children?: ReactNode;
}

const Item = forwardRef<HTMLDivElement, ItemProps>(
  ({children, ...props}, ref: LegacyRef<HTMLDivElement>) => {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  },
);

Item.displayName = 'Item';

export default Item;
