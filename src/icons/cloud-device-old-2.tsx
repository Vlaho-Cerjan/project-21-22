import * as React from 'react';

function CloudDevice(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 21 20" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13.833 4.583h1.643c.473 0 .857.384.857.857v1.643M7.881 12.917H6.316A.817.817 0 015.5 12.1V9.582" />
        <path
          clipRule="evenodd"
          d="M15.954 13.41h-4.242c-1.13 0-2.046.915-2.046 2.045v0c0 1.13.916 2.045 2.046 2.045h4.243c1.13 0 2.045-.916 2.045-2.046v0c0-1.129-.916-2.045-2.046-2.045z"
        />
        <path d="M15.982 15.454h-2.224M11.756 15.425a.041.041 0 010 .06.041.041 0 01-.06 0 .041.041 0 010-.06.043.043 0 01.06 0M17.993 15.29l-.29-3.752A1.667 1.667 0 0016.04 10h-4.414c-.871 0-1.594.67-1.662 1.537l-.29 3.751" />
        <path
          clipRule="evenodd"
          d="M4.802 3.362A2.076 2.076 0 003 5.417C3 6.567 3.933 7.5 5.083 7.5h4.584a1.666 1.666 0 100-3.333 2.5 2.5 0 00-4.865-.805z"
        />
      </g>
    </svg>
  );
}

const MemoCloudDevice = React.memo(CloudDevice);
export default MemoCloudDevice;
