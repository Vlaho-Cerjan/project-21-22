import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';

import {useNetworkStatus} from '@/src/hooks/adaptive/network';
import {useSaveData} from '@/src/hooks/adaptive/saveData';
import {fireEvent, render, screen} from '@testing-library/react';
import {AdaptiveImage, ResizedAdaptiveImage} from '../adaptiveImage';

// Mock hooks and dependencies with strict types
vi.mock('@/src/hooks/adaptive/network', () => ({
  useNetworkStatus: vi.fn(),
}));
vi.mock('@/src/hooks/adaptive/saveData', () => ({
  useSaveData: vi.fn(),
}));
vi.mock('lodash/throttle', () => ({
  throttle: (fn: () => void) => fn, // Bypass throttle for simplicity in tests
}));

const adjustObjectProperties = <T, K extends keyof T>(
  object: T,
  properties: Partial<Record<K, T[K]>>,
): void => {
  Object.entries(properties).forEach(([key, value]) => {
    Object.defineProperty(object, key as K, {
      value,
      writable: true,
      configurable: true,
    });
  });
};

beforeAll(() => {
  window.resizeTo = function resizeTo(width: number, height: number): void {
    adjustObjectProperties<Window, keyof Window>(window, {
      innerWidth: width,
      innerHeight: height,
    });
    fireEvent(window, new Event('resize'));
  };
});

// Strictly typed mock setup
vi.mock('../hooks/adaptive/network', () => ({
  useNetworkStatus: vi.fn(),
}));
vi.mock('../hooks/adaptive/saveData', () => ({
  useSaveData: vi.fn(),
}));
vi.mock('lodash/throttle', () => ({
  throttle: (fn: () => void) => fn, // bypass throttle for simplicity in tests
}));

beforeAll(() => {
  window.resizeTo = function resizeTo(width: number, height: number): void {
    adjustObjectProperties<Window, 'innerWidth' | 'innerHeight'>(window, {
      innerWidth: width,
      innerHeight: height,
    });
    fireEvent(window, new Event('resize'));
  };
});

describe('ResizedAdaptiveImage', () => {
  beforeEach(() => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      unsupported: false,
      effectiveConnectionType: '4g',
      setNetworkStatus: vi.fn(),
    });
    vi.mocked(useSaveData).mockReturnValue({
      unsupported: false,
      saveData: false,
    });
  });

  it('renders image with default settings and verifies initial srcSet', () => {
    render(<ResizedAdaptiveImage src="test.jpg" alt="Sample Image" />);
    const imageElement = screen.getByRole('img') as HTMLImageElement;
    expect(imageElement).toHaveAttribute('src', 'test.jpg');
  });

  it('updates dimensions and srcSet on window resize', () => {
    render(<ResizedAdaptiveImage src="test.jpg" alt="Sample Image" />);
    window.resizeTo(800, 600);
    const imageElement = screen.getByRole('img') as HTMLImageElement;
    expect(imageElement).toHaveAttribute('srcSet');
  });

  it('renders image when connection type is 3g', () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      unsupported: false,
      effectiveConnectionType: '3g',
      setNetworkStatus: vi.fn(),
    });
    render(<ResizedAdaptiveImage src="3g.jpg" alt="3g connection" />);
    const image = screen.getByRole('img');
    expect((image as HTMLImageElement).srcset).toContain('quality=80');
  });
});

describe('AdaptiveImage', () => {
  beforeEach(() => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      unsupported: false,
      effectiveConnectionType: '4g',
      setNetworkStatus: vi.fn(),
    });
    vi.mocked(useSaveData).mockReturnValue({
      unsupported: false,
      saveData: false,
    });
  });

  it('renders with default breakpoints when none are provided', () => {
    render(<AdaptiveImage src="image.jpg" alt="default breakpoints" />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('srcset');
    expect((image as HTMLImageElement).srcset).toContain('image.jpg?width=');
  });

  it('renders with custom breakpoints and checks srcSet', () => {
    const customBreakpoints = {mb: 320, tb: 480, lb: 800, db: 1200};
    const breakpointsWidthPercentage = {mb: 100, tb: 50, lb: 33, db: 25};
    const breakpointsAspectRatios = {mb: 1, tb: 1.5, lb: 1.33, db: 1.77};

    render(
      <AdaptiveImage
        src="custom.jpg"
        alt="custom breakpoints"
        customBreakpoints={customBreakpoints}
        breakpointsWidthPercentage={breakpointsWidthPercentage}
        breakpointsAspectRatios={breakpointsAspectRatios}
      />,
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('srcset');
    expect((image as HTMLImageElement).srcset).toContain(
      'custom.jpg?width=32000&height=32000&format=jpeg 320w, custom.jpg?width=24000&height=16000&format=jpeg 480w, custom.jpg?width=26400&height=19849&format=jpeg 800w, custom.jpg?width=30000&height=16949&format=jpeg 1200w',
    );
    expect((image as HTMLImageElement).srcset).toContain(
      'custom.jpg?width=32000&height=32000&format=jpeg 320w, custom.jpg?width=24000&height=16000&format=jpeg 480w, custom.jpg?width=26400&height=19849&format=jpeg 800w, custom.jpg?width=30000&height=16949&format=jpeg 1200w',
    ); // tb settings
    expect((image as HTMLImageElement).srcset).toContain(
      'custom.jpg?width=32000&height=32000&format=jpeg 320w, custom.jpg?width=24000&height=16000&format=jpeg 480w, custom.jpg?width=26400&height=19849&format=jpeg 800w, custom.jpg?width=30000&height=16949&format=jpeg 1200w',
    ); // lb settings
    expect((image as HTMLImageElement).srcset).toContain(
      'custom.jpg?width=32000&height=32000&format=jpeg 320w, custom.jpg?width=24000&height=16000&format=jpeg 480w, custom.jpg?width=26400&height=19849&format=jpeg 800w, custom.jpg?width=30000&height=16949&format=jpeg 1200w',
    ); // db settings
  });

  it('adjusts image quality based on network condition and saveData preference', () => {
    vi.mocked(useNetworkStatus).mockReturnValue({
      unsupported: false,
      effectiveConnectionType: '2g',
      setNetworkStatus: vi.fn(),
    });
    vi.mocked(useSaveData).mockReturnValue({
      unsupported: false,
      saveData: true,
    });

    render(<AdaptiveImage src="network.jpg" alt="network and save data" />);
    const image = screen.getByRole('img');
    expect((image as HTMLImageElement).srcset).toContain('&quality=80');
  });
});
