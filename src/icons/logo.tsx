import * as React from 'react';

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 104 25" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0h4v19.5H0V0zm79 2v3.5h2.5l.5 4h-3V14a1.5 1.5 0 001.5 1.5v4H80a5 5 0 01-4.998-4.86L75 14.5v-5h-2v-4h2V2h4zm3.5 13.5v4h-2v-4h2zM56 5.5v.674a7 7 0 110 12.653V25h-4V5.5h4zm3 4a3 3 0 100 6 3 3 0 000-6zm28.971 10L83 5.5h4.314l2.743 8.657L92.8 5.5h4.314l-4.971 14H87.97zM28 5.5a7 7 0 110 14H12.5a7 7 0 110-14H28zm0 4H12.5a3 3 0 100 6H28a3 3 0 100-6zm15.5-4a7 7 0 110 14 7 7 0 010-14zm0 4a3 3 0 100 6 3 3 0 000-6zm26.75 10a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm30.868-13.472h-.774V8.2h-.57V6.028H99V5.5h2.118v.528zm.775 2.172h-.574V5.5h.574l.767 1.514.77-1.514h.57v2.7h-.57V6.667l-.516.986h-.508l-.513-.986V8.2z"
        fill="#323234"
      />
    </svg>
  );
}

const MemoLogo = React.memo(Logo);
export default MemoLogo;
