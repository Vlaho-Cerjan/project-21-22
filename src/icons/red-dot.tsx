import * as React from 'react';

function RedDot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 26 26" fill="none" {...props}>
      <g filter="url(#prefix__filter0_d_0_1211)">
        <circle cx={13} cy={12} r={7} fill="#FF506E" />
        <circle cx={13} cy={12} r={8} stroke="#fff" strokeWidth={2} />
      </g>
      <defs>
        <filter
          id="prefix__filter0_d_0_1211"
          x={0}
          y={0}
          width={26}
          height={26}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={1} />
          <feGaussianBlur stdDeviation={2} />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0235294 0 0 0 0.32 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_0_1211"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_0_1211"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}

const MemoRedDot = React.memo(RedDot);
export default MemoRedDot;
