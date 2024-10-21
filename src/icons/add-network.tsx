import * as React from 'react';

function AddNetwork(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g stroke="#CBCBCD" strokeWidth={1.5} strokeLinecap="round">
        <path
          d="M2.635 11.25H4.5A1.5 1.5 0 006 9.75v-1.5a1.5 1.5 0 011.5-1.5H9a1.5 1.5 0 001.5-1.5V2.419M9 15.75A6.75 6.75 0 1115.75 9"
          strokeLinejoin="round"
        />
        <path d="M12.75 10.5V15M10.5 12.75H15" />
      </g>
    </svg>
  );
}

const MemoAddNetwork = React.memo(AddNetwork);
export default MemoAddNetwork;
