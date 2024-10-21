import * as React from 'react';

function CloudDevice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 3h3.286C20.232 3 21 3.768 21 4.714V8M8 21H4.714A1.715 1.715 0 013 19.286V14" />
        <path
          clipRule="evenodd"
          d="M18.545 16.09h-5.091a2.455 2.455 0 00-2.455 2.456v0A2.456 2.456 0 0013.455 21h5.091A2.455 2.455 0 0021 18.545v0a2.455 2.455 0 00-2.455-2.454z"
        />
        <path d="M18.58 18.545h-2.67M13.507 18.51a.05.05 0 010 .071.05.05 0 01-.07 0 .05.05 0 010-.071.051.051 0 01.07 0M20.992 18.347l-.35-4.501A2 2 0 0018.649 12H13.35a2 2 0 00-1.994 1.845l-.35 4.501" />
        <path
          clipRule="evenodd"
          d="M5.162 4.035A2.491 2.491 0 003 6.5 2.5 2.5 0 005.5 9H11a2 2 0 100-4 3 3 0 00-5.838-.965z"
        />
      </g>
    </svg>
  );
}

const MemoCloudDevice = React.memo(CloudDevice);
export default MemoCloudDevice;
