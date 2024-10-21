import * as React from 'react';

function ProjectPlayerDevices(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 100 33" fill="none" {...props}>
      <g fillRule="evenodd" clipRule="evenodd">
        <path
          d="M22.774 11.674h54.452c9.774 0 17.365 2.458 22.774 3.88-.003 8.769-.003 11.49 0 11.66.047 3.224-5.576 4.835-16.872 4.835H16.872C5.577 32.05-.048 30.438 0 27.214c.003-.17.003-2.891 0-11.66 5.41-1.422 13-3.88 22.774-3.88z"
          fill="url(#prefix__paint0_linear_2317_10106)"
        />
        <path
          opacity={0.958}
          d="M99.998 20.988c0 .661 0 .964.002 1.017.047 3.203-5.576 4.805-16.872 4.805H16.872C5.577 26.81-.048 25.208 0 22.005c.001-.053.002-.356.002-1.017.117 3.11 5.74 4.665 16.87 4.665h66.256c11.13 0 16.752-1.555 16.87-4.665z"
          fill="#1E1E1E"
        />
        <path
          d="M22.774.031h54.452c14.66 0 16.754 2.717 17.897 5.046l4.76 9.702c.074.274.113.522.117.776.047 3.224-5.577 4.852-16.872 4.852H16.872C5.577 20.407-.047 18.779 0 15.555c.004-.254 0-.582.779-2.186 1.341-2.764 4.098-8.292 4.098-8.292C6.02 2.748 8.114.03 22.774.03z"
          fill="url(#prefix__paint1_linear_2317_10106)"
        />
        <path
          opacity={0.961}
          d="M31.45 5.658h2.139l-2.026 6.016H29.2l2.251-6.016zm5.991 2.911c-.983 0-1.899.434-2.04.97-.133.536.583.97 1.596.97h9.241c1.013 0 1.861-.434 1.896-.97.036-.536-.731-.97-1.715-.97h-8.978zm9.055-1.164c2.2 0 3.951.955 3.912 2.134-.038 1.18-1.976 2.135-4.33 2.135h-9.36c-2.354 0-4.009-.956-3.667-2.135.377-1.179 2.492-2.134 4.692-2.134h8.753zm4.739 2.134c.019-1.179 1.804-2.134 3.988-2.134s4.08.955 4.222 2.134c.123 1.18-1.683 2.135-4.019 2.135-2.335 0-4.212-.956-4.191-2.135zm2.274 0c.01.536.856.97 1.892.97 1.037 0 1.848-.434 1.81-.97-.041-.536-.892-.97-1.899-.97-1.006 0-1.813.434-1.803.97zm9.482 1.994l.195 1.887H60.78l-.635-6.015h2.213l.04.216c1.56-.441 3.597-.192 4.953.6 1.374.793 1.649 1.919.615 2.711-1.074.793-3.157 1.042-4.975.6zm-.351-1.994c.076.536.952.97 1.96.97 1.007 0 1.744-.434 1.64-.97-.111-.536-1-.97-1.978-.97-.979 0-1.703.434-1.622.97zm6.448-1.935h-.37l.175.577h-.403l-.171-.577h-.364l-.06-.2h1.13l.063.2zm.659.577h-.362l-.198-.776h.446l.368.416.143-.416h.443l.215.776h-.359l-.11-.41-.102.295h-.328l-.262-.296.105.41z"
          fill="url(#prefix__paint2_linear_2317_10106)"
        />
      </g>
      <defs>
        <linearGradient
          id="prefix__paint0_linear_2317_10106"
          x1={0}
          y1={23.733}
          x2={100}
          y2={23.733}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#666" />
          <stop offset={0.092} stopColor="#2A2A2A" />
          <stop offset={0.502} stopColor="#404040" />
          <stop offset={0.816} stopColor="#3B3B3B" />
          <stop offset={0.942} stopColor="#2A2A2A" />
          <stop offset={1} stopColor="#666" />
        </linearGradient>
        <linearGradient
          id="prefix__paint1_linear_2317_10106"
          x1={0}
          y1={0.031}
          x2={0}
          y2={20.407}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4C4C4C" />
          <stop offset={0.196} stopColor="#3A3A3A" />
          <stop offset={0.632} stopColor="#272727" />
          <stop offset={1} stopColor="#202020" />
        </linearGradient>
        <linearGradient
          id="prefix__paint2_linear_2317_10106"
          x1={29.198}
          y1={5.658}
          x2={29.198}
          y2={13.42}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0.792} />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const MemoProjectPlayerDevices = React.memo(ProjectPlayerDevices);
export default MemoProjectPlayerDevices;
