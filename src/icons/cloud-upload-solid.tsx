import * as React from 'react';

function CloudUploadSolid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 54 54" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.49 42.75h27.27c4.338 0 7.875-3.537 7.875-7.875S46.098 27 41.76 27h-.978v-2.25c0-7.448-6.053-13.5-13.5-13.5-6.699 0-12.252 4.9-13.305 11.302-5.348.272-9.612 4.657-9.612 10.073 0 5.591 4.534 10.125 10.125 10.125H18h-3.51z"
        fill="#007DFF"
      />
      <path
        d="M14.49 42.75h27.27c4.338 0 7.875-3.537 7.875-7.875S46.098 27 41.76 27h-.978v-2.25c0-7.448-6.053-13.5-13.5-13.5-6.699 0-12.252 4.9-13.305 11.302-5.348.272-9.612 4.657-9.612 10.073 0 5.591 4.534 10.125 10.125 10.125zm0 0H18"
        stroke="#007DFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27 38.25V22.5M22.124 27L27 22.124 31.875 27"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoCloudUploadSolid = React.memo(CloudUploadSolid);
export default MemoCloudUploadSolid;
