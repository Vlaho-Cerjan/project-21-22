import {renderHook} from '@testing-library/react';
import {expect, test} from 'vitest';

const mediaDecodingConfig = {
  type: 'file',
  audio: {
    contentType: 'audio/mp3',
    channels: 2,
    bitrate: 132700,
    samplerate: 5200,
  },
};

describe('useMediaCapabilitiesDecodingInfo', () => {
  test('should return supported flag on unsupported platforms', async () => {
    const {useMediaCapabilitiesDecodingInfo} = await import(
      '../mediaCapabilities'
    );
    const {result} = renderHook(() =>
      // @ts-expect-error - mediaDecodingConfig is missing
      useMediaCapabilitiesDecodingInfo(mediaDecodingConfig),
    );

    expect(result.current.supported).toEqual(false);
  });

  test('should return supported flag on unsupported platforms and no config given', async () => {
    const {useMediaCapabilitiesDecodingInfo} = await import(
      '../mediaCapabilities'
    );
    // @ts-expect-error - mediaDecodingConfig is missing
    const {result} = renderHook(() => useMediaCapabilitiesDecodingInfo());

    expect(result.current.supported).toEqual(false);
  });

  test('should return initialMediaCapabilitiesInfo for unsupported', async () => {
    const initialMediaCapabilitiesInfo = {
      supported: true,
      smooth: false,
      powerEfficient: true,
    };

    const {useMediaCapabilitiesDecodingInfo} = await import(
      '../mediaCapabilities'
    );
    const {result} = renderHook(() =>
      useMediaCapabilitiesDecodingInfo(
        // @ts-expect-error - mediaDecodingConfig is missing
        mediaDecodingConfig,
        initialMediaCapabilitiesInfo,
      ),
    );

    // @ts-expect-error - mediaDecodingConfig is missing
    expect(result.current.mediaCapabilitiesInfo.supported).toBe(true);
    // @ts-expect-error - mediaDecodingConfig is missing
    expect(result.current.mediaCapabilitiesInfo.smooth).toEqual(false);
    // @ts-expect-error - mediaDecodingConfig is missing
    expect(result.current.mediaCapabilitiesInfo.powerEfficient).toEqual(true);
  });

  test('should return supported flag when no config given', async () => {
    const originalError = console.error;
    console.error = vi.fn();

    const mockDecodingInfo = vi.fn().mockImplementation(() =>
      Promise.resolve({
        supported: true,
      }),
    );

    // @ts-expect-error - navigator.mediaCapabilities is not supported
    global.navigator.mediaCapabilities = {
      decodingInfo: mockDecodingInfo,
    };

    const {useMediaCapabilitiesDecodingInfo} = await import(
      '../mediaCapabilities'
    );

    try {
      // @ts-expect-error - mediaDecodingConfig is missing
      const {result} = renderHook(() => useMediaCapabilitiesDecodingInfo());

      expect(result.current.supported).toEqual(true);
    } finally {
      console.error = originalError;
    }
  });
});
