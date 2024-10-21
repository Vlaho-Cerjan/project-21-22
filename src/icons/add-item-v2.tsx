import * as React from 'react';

function AddItemV2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 22 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 19v-4M12 19H2" />
        <path
          clipRule="evenodd"
          d="M1.309 4.51l1.628-2.578A2 2 0 014.628 1h12.744a2 2 0 011.69.932l1.63 2.579A2 2 0 0121 5.579V8a1 1 0 01-1 1H2a1 1 0 01-1-1V5.579a2 2 0 01.309-1.068z"
        />
        <path d="M2.927 19V9M19 12V9M9 19V9.012M19 17h-4" />
      </g>
    </svg>
  );
}

const MemoAddItemV2 = React.memo(AddItemV2);
export default MemoAddItemV2;
