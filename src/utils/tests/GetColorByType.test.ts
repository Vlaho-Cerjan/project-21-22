import {describe, expect, it} from 'vitest';
import GetColorByType from '../GetColorByType';

describe('GetColorByType - Function that returns the color of a given type', () => {
  it('should return the color of a given type (channel)', () => {
    const type = 'channel';

    const expectedColor = '#457B9D';

    const result = GetColorByType(type);

    expect(result).toEqual(expectedColor);
  });

  it('should return the color of a given type (playlist)', () => {
    const type = 'playlist';

    const expectedColor = '#FB8500';

    const result = GetColorByType(type);

    expect(result).toEqual(expectedColor);
  });

  it('should return the color of a given type (media)', () => {
    const type = 'media';

    const expectedColor = '#E63946';

    const result = GetColorByType(type);

    expect(result).toEqual(expectedColor);
  });

  it('should return the color of a given type (schedule)', () => {
    const type = 'schedule';

    const expectedColor = '#2A9D8F';

    const result = GetColorByType(type);

    expect(result).toEqual(expectedColor);
  });

  it('should return the color of a given type (default)', () => {
    const type = 'test';

    const expectedColor = '#457B9D';

    const result = GetColorByType(type);

    expect(result).toEqual(expectedColor);
  });
});
