import {useEffect, useState} from 'react';

const useMediaCapabilitiesDecodingInfo = (
  mediaDecodingConfig: MediaDecodingConfiguration,
  initialMediaCapabilitiesInfo?: MediaCapabilitiesDecodingInfo | object,
) => {
  const supported =
    typeof navigator !== 'undefined' && 'mediaCapabilities' in navigator;
  const [mediaCapabilitiesInfo, setMediaCapabilitiesInfo] = useState(
    initialMediaCapabilitiesInfo,
  );

  useEffect(() => {
    if (supported) {
      navigator.mediaCapabilities
        .decodingInfo(mediaDecodingConfig)
        .then(setMediaCapabilitiesInfo)
        .catch((error) => console.error(error));
    }
  }, [mediaDecodingConfig]);

  return {supported, mediaCapabilitiesInfo};
};

export {useMediaCapabilitiesDecodingInfo};
