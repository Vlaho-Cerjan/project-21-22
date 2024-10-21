import type {FuseResultMatch} from 'fuse.js';

import {describe, expect, it} from 'vitest';
import ItemMatches from '../ItemMatcher';

describe('ItemMatcher - Function that returns filtered matches based on a key (string)', () => {
  it('shoud return an empty array if the array of matches is empty', () => {
    const matchedItems: FuseResultMatch[] = [];

    expect(ItemMatches(matchedItems, 'itemName')).toStrictEqual([]);
  });

  it('should return matched items from array', () => {
    const matchedItems: FuseResultMatch[] = [
      {
        key: 'name',
        refIndex: 0,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
      {
        key: 'name',
        refIndex: 1,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
    ];

    expect(ItemMatches(matchedItems, 'name')).toStrictEqual(matchedItems);
  });

  it('should return a filtered array of matches that match the key', () => {
    const matchedItems: FuseResultMatch[] = [
      {
        key: 'name',
        refIndex: 0,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
      {
        key: 'name',
        refIndex: 1,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
      {
        key: 'otherName',
        refIndex: 2,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
    ];

    expect(ItemMatches(matchedItems, 'name')).toStrictEqual(
      matchedItems.slice(0, 2),
    );
  });

  it('should return a filtered array of matches that match the array of keys', () => {
    const matchedItems: FuseResultMatch[] = [
      {
        key: 'name',
        refIndex: 0,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
      {
        key: 'name',
        refIndex: 1,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
      {
        key: 'otherName',
        refIndex: 2,
        indices: [
          [0, 1],
          [2, 3],
        ],
      },
    ];

    expect(ItemMatches(matchedItems, ['name', 'otherName'])).toStrictEqual(
      matchedItems,
    );
  });
});
