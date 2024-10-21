import Image from 'next/image';

import type {BackendVideoData} from '@/src/constants/backendData';
import MemoClear from '@/src/icons/clear';

import NoStyleButton from '../../common/button/noStyleButton';
import Description from '../../common/description/description';
import Rating from '../../common/rating/rating';
import Title from '../../common/title/title';

export default function SelectedVideos({
  video,
  removeVideo,
}: {
  video: BackendVideoData;
  removeVideo: (video: BackendVideoData) => void;
}) {
  return (
    <NoStyleButton onClick={() => removeVideo(video)} className="searchResult">
      <div className="addResultCheckbox">
        <div className="resultIcon">
          <MemoClear />
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
