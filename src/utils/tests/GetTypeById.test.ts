import {describe, expect, it} from 'vitest';
import {GetTypeById} from '../GetTypeById';

describe('GetTypeById - Function that returns the type data of a given id', () => {
  it('should return the type data of a given id', () => {
    const id = 'music_videos';

    const expectedData = {
      id: 'music_videos',
      name: 'Music Videos',
    };

    const result = GetTypeById(id);

    expect(result).toEqual(expectedData);
  });
});
