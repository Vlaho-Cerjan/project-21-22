import {describe, expect, it} from 'vitest';
import type {EnumState} from '../enumSlice';
import {enumReducer} from '../enumSlice';

const enumPayload = {
  enumData: {
    test: {
      test: 'test',
    },
  } as EnumState,
  venueType: {
    test: 'test',
  },
  status: 'fulfilled',
};

describe('Enum Reducer', () => {
  it('should return the initial state', () => {
    expect(enumReducer(undefined, {type: ''})).toEqual({
      enumData: null,
      venueType: null,
      status: 'pending',
    });
  });

  it('should handle setEnum', () => {
    expect(
      enumReducer(
        {inventory: null, enumData: null, venueType: null, status: 'pending'},
        {
          type: 'enum/setEnum',
          payload: enumPayload,
        },
      ),
    ).toEqual({
      enumData: enumPayload,
      venueType: null,
      status: 'pending',
    });
  });

  it('should handle fetchEnum.fulfilled', () => {
    expect(
      enumReducer(
        {inventory: null, enumData: null, venueType: null, status: 'pending'},
        {
          type: 'fetchEnum/fulfilled',
          payload: enumPayload,
        },
      ),
    ).toEqual({
      enumData: enumPayload.enumData,
      venueType: enumPayload.venueType,
      status: 'fulfilled',
    });
  });
});
