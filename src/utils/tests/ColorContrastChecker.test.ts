import {describe, expect, it} from 'vitest';
import ColorContrastChecker, {getLuminance} from '../ColorContrastChecker';

describe('ColorContrastChecker - Function that check if the contrast is good enough between given foreground and background color', () => {
  it('should return true if the contrast ration is equal or above 4.5 for chosen colors', () => {
    const foregroundColor = '#000000';
    const backgroundColor = '#FFFFFF';

    const result = ColorContrastChecker(foregroundColor, backgroundColor);

    expect(result).toEqual(true);
  });

  it('should return false if the contrast ration is below 4.5 for chosen colors', () => {
    const foregroundColor = '#000000';
    const backgroundColor = '#000000';

    const result = ColorContrastChecker(foregroundColor, backgroundColor);

    expect(result).toEqual(false);
  });

  it('should work even with short Hex color codes', () => {
    const foregroundColor = '#000';
    const backgroundColor = '#FFF';

    const result = ColorContrastChecker(foregroundColor, backgroundColor);

    expect(result).toEqual(true);
  });

  it('should test the GetLuminance function with rgb code', () => {
    const color = 'rgb(0, 0, 0)';

    const result = getLuminance(color);

    expect(result).toEqual(0);
  });
});
