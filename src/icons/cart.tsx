import * as React from 'react';

function Cart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 24" fill="none" {...props}>
      <g
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M18.5 21h-12a2 2 0 01-2-2V8.5A1.5 1.5 0 016 7h13a1.5 1.5 0 011.5 1.5V19a2 2 0 01-2 2z"
        />
        <path d="M14.611 12.7l-2.945 2.945-1.166-1.167M8.5 7v-.25 0A3.75 3.75 0 0112.25 3h.5a3.75 3.75 0 013.75 3.75V7" />
      </g>
    </svg>
  );
}

const MemoCart = React.memo(Cart);
export default MemoCart;
