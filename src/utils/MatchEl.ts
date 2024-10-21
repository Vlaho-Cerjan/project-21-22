import type {FuseResultMatch} from 'fuse.js';
import parse from 'html-react-parser';
// return the string with the matched indices wrapped in a span with class match
export default function MatchEl(str: string, matches: FuseResultMatch[]) {
  if (matches.length === 0) return parse(`<span>${str}</span>`);
  const matchStr = matches[0];
  if (!matchStr || matchStr?.indices.length === 0)
    return parse(`<span>${str}</span>`);
  const matchStrEl = {
    el: '<span>',
  };
  const matchingArray = matchStr.indices;
  const lastIndex = {
    index: 0,
  };
  matchingArray.forEach((match) => {
    const [start, end] = match;
    if (end < start + 2) return;
    const before = str.slice(lastIndex.index, start);
    const matchString = str.slice(start, end + 1);
    lastIndex.index = end + 1;
    matchStrEl.el += `${before}<span class="match">${matchString}</span>`;
  });
  matchStrEl.el += String(str).slice(lastIndex.index);

  matchStrEl.el += '</span>';

  return parse(matchStrEl.el);
}
