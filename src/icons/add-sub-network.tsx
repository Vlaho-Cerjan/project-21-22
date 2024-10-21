import * as React from 'react';

function AddSubNetwork(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" {...props}>
      <g stroke="#CBCBCD" strokeWidth={1.5} strokeLinecap="round">
        <path d="M9 14.25H3" strokeLinejoin="round" />
        <path
          clipRule="evenodd"
          d="M3.232 6.383l1.22-1.934a1.5 1.5 0 011.27-.699h6.557a1.5 1.5 0 011.268.7l1.221 1.933a1.5 1.5 0 01.232.8V9a.75.75 0 01-.75.75H3.75A.75.75 0 013 9V7.184c0-.284.08-.561.232-.8z"
          strokeLinejoin="round"
        />
        <path
          d="M4.445 14.25v-4.5M7.5 14.25V9.76M14.935 6.75H3.066"
          strokeLinejoin="round"
        />
        <path d="M14.25 12v4.5M12 14.25h4.5" />
      </g>
    </svg>
  );
}

const MemoAddSubNetwork = React.memo(AddSubNetwork);
export default MemoAddSubNetwork;
