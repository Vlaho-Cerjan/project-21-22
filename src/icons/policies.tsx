import * as React from 'react';

function Policies(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.95 6.674L7.263 9.992 5.051 8.001" />
        <path
          clipRule="evenodd"
          d="M14.311 3.137c-2.186-.155-4.175-.939-5.745-2.15a.955.955 0 00-1.132 0c-1.57 1.21-3.56 1.995-5.745 2.15-.455.032-.8.382-.8.793v3.464c0 3.493 2.805 6.77 6.647 7.748.301.076.628.076.929 0 3.84-.98 6.646-4.254 6.646-7.748V3.93c0-.41-.345-.761-.8-.793z"
        />
      </g>
    </svg>
  );
}

const MemoPolicies = React.memo(Policies);
export default MemoPolicies;
