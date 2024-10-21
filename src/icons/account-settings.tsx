import * as React from 'react';

function AccountSettings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15v1M18 20v1M15.4 16.5l.9.5M19.7 19l.9.5M15.4 19.5l.9-.5M19.7 17l.9-.5M19.4 16.6c.8.8.8 2 0 2.8-.8.8-2 .8-2.8 0-.8-.8-.8-2 0-2.8.8-.8 2-.8 2.8 0M15 5.2c1.7 1.7 1.7 4.4 0 6-1.7 1.6-4.4 1.7-6 0-1.6-1.7-1.7-4.4 0-6 1.7-1.6 4.3-1.6 6 0M4 20c0-2.5 2-4.5 4.5-4.5h2.6" />
      </g>
    </svg>
  );
}

const MemoAccountSettings = React.memo(AccountSettings);
export default MemoAccountSettings;
