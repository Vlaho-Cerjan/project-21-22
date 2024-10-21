import * as React from 'react';

function VenuesNav(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 19" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 18H1" />
        <path
          clipRule="evenodd"
          d="M1.348 5.388l1.831-3.223C3.592 1.44 4.31 1 5.082 1h9.836c.772 0 1.49.44 1.903 1.165l1.831 3.223c.227.4.348.863.348 1.335V9.75c0 .69-.504 1.25-1.125 1.25H2.125C1.504 11 1 10.44 1 9.75V6.723c0-.472.12-.935.348-1.335z"
        />
        <path d="M3 18v-7M16.5 18v-7M7.5 18v-7M19 6.5H1" />
      </g>
    </svg>
  );
}

const MemoVenuesNav = React.memo(VenuesNav);
export default MemoVenuesNav;
