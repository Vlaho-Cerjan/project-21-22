import * as React from 'react';

function CloudDevice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.5 10.833H4.168a1.667 1.667 0 01-1.617-2.07l.833-3.334A1.667 1.667 0 015 4.167H7.5" />
        <path d="M7.5 15.833H4.167c-.92 0-1.667-.746-1.667-1.666v-5" />
        <circle cx={13.75} cy={13.75} r={1.25} />
        <path d="M12.5 5H15" />
        <rect x={10} y={2.5} width={7.5} height={15} rx={2} />
        <path d="M12.793 10.417h0-.001 0v0M12.793 8.75h0-.001 0v0M14.875 10.417h0v0M14.875 8.75h0v0" />
      </g>
    </svg>
  );
}

const MemoCloudDevice = React.memo(CloudDevice);
export default MemoCloudDevice;
