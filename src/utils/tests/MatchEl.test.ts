import type {FuseResultMatch} from 'fuse.js';
import parse from 'html-react-parser';
import {describe, expect, it} from 'vitest';

import MatchEl from '../MatchEl';

describe('MatchEl - Function that returns matched indices wrapped in a span with class match or if there is no matches it returns the element without changing it', () => {
  it('should return the string without any changes besides wrapped in span if there are no matches', () => {
    expect(MatchEl('Hello World', [])).toStrictEqual(
      parse('<span>Hello World</span>'),
    );
  });

  it('should return the string with the matched indices wrapped in a span with class match', () => {
    const indices: FuseResultMatch[] = [
      {
        // matches 'Hel' and 'Wor'
        indices: [
          [0, 2],
          [6, 8],
        ],
      },
    ];

    expect(MatchEl('Hello World', indices)).toStrictEqual(
      parse(
        '<span><span class="match">Hel</span>lo <span class="match">Wor</span>ld</span>',
      ),
    );
  });

  it('should return the string without changing it if the match is less than 2 characters', () => {
    const indices: FuseResultMatch[] = [
      {
        // matches 'Hel' and 'Wor'
        indices: [
          [0, 1],
          [6, 7],
        ],
      },
    ];

    expect(MatchEl('Hello World', indices)).toStrictEqual(
      parse('<span>Hello World</span>'),
    );
  });

  it('should return the string without changing if the indices are empty', () => {
    const indices: FuseResultMatch[] = [
      {
        indices: [],
      },
    ];

    expect(MatchEl('Hello World', indices)).toStrictEqual(
      parse('<span>Hello World</span>'),
    );
  });
});
