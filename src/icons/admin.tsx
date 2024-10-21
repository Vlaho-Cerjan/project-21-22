import * as React from 'react';

function Admin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 21 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.835 9.167V6.665h-2.501l-3.507 3.507a3.752 3.752 0 102.501 2.501l.786-.786v-1.149h.917v-.917h1.15l.654-.647" />
        <path d="M2.997 8.333V6.666a4.168 4.168 0 014.168-4.169h6.67a4.168 4.168 0 014.168 4.169v6.669a4.168 4.168 0 01-4.168 4.168h-1.668M6.749 13.543a.208.208 0 10.001.417.208.208 0 00-.001-.417" />
      </g>
    </svg>
  );
}

const MemoAdmin = React.memo(Admin);
export default MemoAdmin;
