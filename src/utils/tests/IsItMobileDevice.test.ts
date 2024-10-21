import {describe, expect, it} from 'vitest';
import IsItMobile from '../IsItMobileDevice';

describe('IsItMobileDevice - Function that checks if the device is mobile or width is less than 768 pixels', () => {
  it('should return true if the device is mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Android',
      writable: true,
    });
    const result = IsItMobile();
    expect(result).toBe(true);
  });

  it('should return true if the width is less than 768', () => {
    Object.defineProperty(window, 'innerWidth', {
      value: 767,
      writable: true,
    });
    const result = IsItMobile();
    expect(result).toBe(true);
  });

  it('should return false if the device is not mobile and the width is greater than 768', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Windows',
      writable: true,
    });
    Object.defineProperty(window, 'innerWidth', {
      value: 769,
      writable: true,
    });
    const result = IsItMobile();
    expect(result).toBe(false);
  });
});
