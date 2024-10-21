import {throttle} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNetworkStatus} from '../hooks/adaptive/network';
import {useSaveData} from '../hooks/adaptive/saveData';

interface ResizedAdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'auto' | 'high' | 'low';
}

interface AdaptiveImageProps extends ResizedAdaptiveImageProps {
  customBreakpoints?: {
    mb: number;
    tb: number;
    lb: number;
    db: number;
  };
  breakpointsWidthPercentage?: {
    mb: number;
    tb: number;
    lb: number;
    db: number;
  };
  breakpointsAspectRatios?: {
    mb: number;
    tb: number;
    lb: number;
    db: number;
  };
}

export const ResizedAdaptiveImage: React.FC<ResizedAdaptiveImageProps> = ({
  src,
  alt,
  className,
  loading,
  fetchPriority,
}) => {
  const {unsupported: networkSupport, effectiveConnectionType} =
    useNetworkStatus();
  const {unsupported: dataSupport, saveData} = useSaveData();
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0}); // Default dimensions based on an initial aspect ratio

  // Throttled resize handler
  const handleResize = useCallback(
    throttle(() => {
      if (imageRef.current) {
        const currentWidth = imageRef.current.clientWidth;
        const currentHeight = imageRef.current.clientHeight;
        setDimensions({
          width: currentWidth + 1,
          height: currentHeight + 1,
        });
      }
    }, 200),
    [imageRef],
  );

  useEffect(() => {
    // Set initial dimensions based on client width
    if (imageRef.current) {
      const initialWidth = imageRef.current.clientWidth;
      const initialHeight = imageRef.current.clientHeight;
      setDimensions({
        width: initialWidth + 1,
        height: initialHeight + 1,
      });
    }

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const generateSrcSet = (type: string) => {
    const qualitySuffix =
      (!dataSupport && saveData) ||
      (!networkSupport && effectiveConnectionType !== '4g')
        ? '&quality=80'
        : '';
    return `${src}?width=${dimensions.width}&height=${dimensions.height}&format=${type}${qualitySuffix} ${dimensions.width}w`;
  };

  return (
    <div ref={imageRef} className="imgContainer resizeAdaptiveImgContainer">
      {dimensions.width > 0 && (
        <picture>
          <source type="image/avif" srcSet={generateSrcSet('avif')} />
          <source type="image/webp" srcSet={generateSrcSet('webp')} />
          <source type="image/jpeg" srcSet={generateSrcSet('jpeg')} />
          <img
            src={`${src}`}
            srcSet={generateSrcSet('jpeg')}
            alt={alt}
            className={className}
            loading={loading}
            fetchPriority={fetchPriority}
          />
        </picture>
      )}
    </div>
  );
};

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  src,
  alt,
  className,
  loading,
  fetchPriority,
  customBreakpoints,
  breakpointsWidthPercentage,
  breakpointsAspectRatios,
}) => {
  const {unsupported: networkSupport, effectiveConnectionType} =
    useNetworkStatus();
  const {unsupported: dataSupport, saveData} = useSaveData();
  const imageRef = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState({width: 0, height: 0}); // Default dimensions based on an initial aspect ratio

  useEffect(() => {
    // Set initial dimensions based on client width
    if (imageRef.current) {
      const initialWidth = imageRef.current.clientWidth;
      const initialHeight = imageRef.current.clientHeight;
      setDimensions({
        width: initialWidth + 1,
        height: initialHeight + 1,
      });
    }
  }, []);

  const generateSrcSet = (type: string) => {
    const qualitySuffix =
      (!dataSupport && saveData) ||
      (!networkSupport && effectiveConnectionType !== '4g')
        ? '&quality=80'
        : '';
    return Object.entries(
      customBreakpoints || {
        mb: 768, // Mobile
        tb: 992, // Tablet
        lb: 1200, // Laptop
        db: 1600, // Desktop
      },
    )
      .map(([breakpoint, width]) => {
        const calcWidth = breakpointsWidthPercentage
          ? breakpointsWidthPercentage[
              breakpoint as keyof typeof breakpointsWidthPercentage
            ] * width
          : width;
        const height = breakpointsAspectRatios
          ? Math.floor(
              calcWidth /
                breakpointsAspectRatios[
                  breakpoint as keyof typeof breakpointsWidthPercentage
                ],
            )
          : Math.floor(calcWidth / (16 / 9));
        return `${src}?width=${calcWidth}&height=${height}&format=${type}${qualitySuffix} ${width}w`;
      })
      .join(', ');
  };

  return (
    <div ref={imageRef} className="imgContainer resizeAdaptiveImgContainer">
      {dimensions.width > 0 && (
        <picture>
          <source type="image/avif" srcSet={generateSrcSet('avif')} />
          <source type="image/webp" srcSet={generateSrcSet('webp')} />
          <source type="image/jpeg" srcSet={generateSrcSet('jpeg')} />
          <img
            src={`${src}?width=${dimensions.width}&height=${dimensions.height}`}
            srcSet={generateSrcSet('jpeg')}
            alt={alt}
            className={className}
            loading={loading}
            fetchPriority={fetchPriority}
          />
        </picture>
      )}
    </div>
  );
};
