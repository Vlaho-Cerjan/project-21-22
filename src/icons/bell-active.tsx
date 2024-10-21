import * as React from 'react';

function BellActive(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M13.6 20h-3.2"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.057 5.089A5.002 5.002 0 007 10v2.504a.855.855 0 01-.472.764l-.503.251a1.854 1.854 0 00.829 3.513h10.292a1.854 1.854 0 00.829-3.512l-.503-.251a.857.857 0 01-.472-.765v-1.472"
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.121 3.879A3 3 0 1113.88 8.12 3 3 0 0118.12 3.88z"
        fill="#FF506E"
      />
    </svg>
  );
}

const MemoBellActive = React.memo(BellActive);
export default MemoBellActive;
