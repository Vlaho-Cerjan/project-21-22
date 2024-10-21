import * as React from 'react';

function MediaAssets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...props}>
      <g
        stroke="#323234"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.79 15.2h1.263c1.162 0 2.105-.895 2.105-2V5.097a2.34 2.34 0 00-.74-1.697l-1.997-1.897A2.595 2.595 0 0010.634.8H4.632c-1.163 0-2.106.895-2.106 2v2" />
        <path d="M15.138 4.8H12.21c-.697 0-1.263-.537-1.263-1.2V.819" />
        <path
          clipRule="evenodd"
          d="M3.85 12.406V9.995c0-.142.08-.273.21-.343a.434.434 0 01.417.003l2.146 1.206a.39.39 0 01.203.34.39.39 0 01-.203.338l-2.146 1.206a.434.434 0 01-.417.004.391.391 0 01-.21-.343h0z"
        />
        <rect x={0.842} y={7.2} width={8.421} height={8} rx={3} />
      </g>
    </svg>
  );
}

const MemoMediaAssets = React.memo(MediaAssets);
export default MemoMediaAssets;
