import * as React from 'react';

function Profile(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g stroke="#323232" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M5 20c0-2.5 2-4.4 4.4-4.4h5.1c2.5 0 4.4 2 4.4 4.4"
          strokeWidth={1.482}
        />
        <path
          d="M15 5.2c1.7 1.7 1.7 4.4 0 6-1.7 1.6-4.4 1.7-6 0-1.6-1.7-1.7-4.4 0-6 1.7-1.6 4.3-1.6 6 0"
          strokeWidth={1.5}
        />
      </g>
    </svg>
  );
}

const MemoProfile = React.memo(Profile);
export default MemoProfile;
