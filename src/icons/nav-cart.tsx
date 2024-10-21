import * as React from 'react';

function NavCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          clipRule="evenodd"
          d="M18 21H6a2 2 0 01-2-2V8.5A1.5 1.5 0 015.5 7h13A1.5 1.5 0 0120 8.5V19a2 2 0 01-2 2z"
        />
        <path d="M14.111 12.7l-2.945 2.945L10 14.477M8 7v-.25 0A3.75 3.75 0 0111.75 3h.5A3.75 3.75 0 0116 6.75V7" />
      </g>
    </svg>
  );
}

const MemoNavCart = React.memo(NavCart);
export default MemoNavCart;
