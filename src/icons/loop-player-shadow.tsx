import * as React from 'react';

function ProjectPlayerShadow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 145 42" fill="none" {...props}>
      <g opacity={0.475} filter="url(#prefix__filter0_f_2317_10120)">
        <ellipse
          cx={72.5}
          cy={21.05}
          rx={64}
          ry={12.007}
          fill="url(#prefix__paint0_radial_2317_10120)"
        />
      </g>
      <defs>
        <radialGradient
          id="prefix__paint0_radial_2317_10120"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0 3.37201 -357.437 0 72.5 21.05)"
        >
          <stop />
          <stop offset={1} stopOpacity={0.01} />
        </radialGradient>
        <filter
          id="prefix__filter0_f_2317_10120"
          x={0.345}
          y={0.888}
          width={144.31}
          height={40.323}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            stdDeviation={4.077}
            result="effect1_foregroundBlur_2317_10120"
          />
        </filter>
      </defs>
    </svg>
  );
}

const MemoProjectPlayerShadow = React.memo(ProjectPlayerShadow);
export default MemoProjectPlayerShadow;
