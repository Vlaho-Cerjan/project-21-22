import Image from 'next/image';

import type {BackendVideoData} from '@/src/constants/backendData';
import MemoCheckRectangle from '@/src/icons/check-rectangle';
import MemoClear from '@/src/icons/clear';

import NoStyleButton from '../../common/button/noStyleButton';
import Description from '../../common/description/description';
import Rating from '../../common/rating/rating';
import Title from '../../common/title/title';

export default function SearchResult({
  video,
  videoAction,
  selected,
  hidden,
}: {
  video: BackendVideoData;
  videoAction: (video: BackendVideoData, selected: boolean) => void;
  selected?: boolean;
  hidden?: boolean;
}) {
  return (
    <NoStyleButton
      onClick={() => videoAction(video, selected || false)}
      className={`searchResult${hidden ? ' hidden' : ''}${
        selected ? ' selected' : ''
      }`}
    >
      <div className="addResultCheckbox">
        <div className="resultIcon">
          {selected ? <MemoClear /> : <MemoCheckRectangle />}
        </div>
      </div>
      <div className="resultImageContainer">
        <Image
          src={video.url || '/assets/images/mcd1.png'}
          alt={`${video.name} by ${video.artist}`}
          width={48}
          height={28}
        />
      </div>
      <div className="resultInfoContainer">
        <Title>{video.name}</Title>
        <Description>{video.artist}</Description>
      </div>
      <div className="resultRatingContainer">
        <Rating rating={video.rating} />
      </div>
    </NoStyleButton>
  );
}
