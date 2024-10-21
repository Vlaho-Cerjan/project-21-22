import React from 'react';

import MemoImage from '@/src/icons/image';
import MemoText from '@/src/icons/text';
import MemoVideo from '@/src/icons/video';

import NoStyleButton from '../../common/button/noStyleButton';
import type {TabType} from '../modals/addMediaModal';

export default function TabsHeader({
  activeTab,
  setActiveTab,
  type,
}: {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  type?: 'image' | 'video' | 'text';
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    switch (activeTab) {
      case 'image':
        setActiveIndex(0);
        break;
      case 'video':
        setActiveIndex(1);
        break;
      case 'text':
        setActiveIndex(2);
        break;
      default:
        setActiveIndex(0);
        break;
    }
  }, [activeTab]);

  return (
    <div className="tabHeader">
      <div className="tabsContainer">
        <NoStyleButton
          disabled={type && type !== 'image'}
          onClick={() => setActiveTab('image')}
          className={`tabHeaderItem${activeTab === 'image' ? ' active' : ''}${
            activeIndex > 0 ? ' prevActive' : ''
          }`}
        >
          <MemoImage />
          <div>Image</div>
        </NoStyleButton>
        <NoStyleButton
          disabled={type && type !== 'video'}
          onClick={() => setActiveTab('video')}
          className={`tabHeaderItem${activeTab === 'video' ? ' active' : ''}${
            activeIndex > 1 ? ' prevActive' : ''
          }`}
        >
          <MemoVideo />
          <div>Video</div>
        </NoStyleButton>
        <NoStyleButton
          disabled={type && type !== 'text'}
          onClick={() => setActiveTab('text')}
          className={`tabHeaderItem${activeTab === 'text' ? ' active' : ''}${
            activeIndex > 2 ? ' prevActive' : ''
          }`}
        >
          <MemoText />
          <div>Text</div>
        </NoStyleButton>
      </div>
    </div>
  );
}
