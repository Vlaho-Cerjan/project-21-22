import type {FuseResultMatch} from 'fuse.js';

export default function ItemMatches(
  itemMatchesEl: readonly FuseResultMatch[],
  itemName: string | string[],
) {
  if (Array.isArray(itemName)) {
    return itemMatchesEl?.filter((match) =>
      itemName.includes(match.key as string),
    );
  }
  return itemMatchesEl?.filter((match) => match.key === itemName);
}
