import * as React from 'react';

function UserRoles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path
          clipRule="evenodd"
          d="M14.501 20.503v-.406a2.1 2.1 0 012.095-2.095h3.313a2.1 2.1 0 012.095 2.095v.406a.5.5 0 01-.5.5H15a.5.5 0 01-.5-.5zM16.327 14.04a2.001 2.001 0 113.855-1.075 2.001 2.001 0 01-3.855 1.076zM1.996 18.503v-.406a2.1 2.1 0 012.095-2.095h3.313A2.1 2.1 0 019.5 18.097v.406a.5.5 0 01-.5.5H2.496a.5.5 0 01-.5-.5z"
          stroke="#323234"
        />
        <path
          clipRule="evenodd"
          d="M3.822 12.04a2 2 0 113.854-1.076 2 2 0 01-3.854 1.076z"
          stroke="#323232"
        />
        <circle cx={13} cy={5.998} r={4.002} stroke="#323232" />
        <path d="M14.346 5.205l-1.68 1.68-1.011-1.008" stroke="#323232" />
      </g>
    </svg>
  );
}

const MemoUserRoles = React.memo(UserRoles);
export default MemoUserRoles;
