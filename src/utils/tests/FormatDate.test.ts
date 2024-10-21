import {describe, expect, it} from 'vitest';
import {FormatDate, FormatDateWithTime} from '../FormatDate';

describe('FormatDate - Function that formats dates (Jan 1, 24)', () => {
  it('should format a date', () => {
    const date = new Date('2024-01-01');

    const expectedDateString = 'Jan 1, 24';

    const result = FormatDate(date);

    expect(result).toEqual(expectedDateString);
  });

  it('should format a date with time', () => {
    const date = new Date('2024-01-01T12:00:00');

    const expectedDateString = 'Jan 1, 24, 12:00 PM';

    const result = FormatDateWithTime(date);

    expect(result).toEqual(expectedDateString);
  });
});
