import * as React from 'react';

function AddRegistration(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21H3M3.927 21V10.942M9 21V10.95M9 16h2" />
        <circle cx={18} cy={18} r={4} />
        <path
          clipRule="evenodd"
          d="M2.276 7.478a2.339 2.339 0 00-.163 1.806 2.46 2.46 0 004.72-.1.144.144 0 01.276 0 2.463 2.463 0 004.753-.001.144.144 0 01.276 0 2.463 2.463 0 004.753 0 .144.144 0 01.276 0 2.46 2.46 0 004.72.1c.19-.599.132-1.25-.163-1.806l-1.707-3.379A2 2 0 0018.232 3H5.768a2 2 0 00-1.785 1.098l-1.707 3.38z"
        />
        <path d="M16.75 18h2.5M18 19.25v-2.5" />
      </g>
    </svg>
  );
}

const MemoAddRegistration = React.memo(AddRegistration);
export default MemoAddRegistration;
