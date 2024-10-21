import React from 'react';

import Slider from '../common/slider/slider';
import type {TabType} from './modals/addMediaModal';
import type {MediaActionData} from './modals/editMediaModal';
import ImageTab from './tabs/imageTab';
import TabsHeader from './tabs/tabsHeader';
import TextTab from './tabs/textTab';
import VideoTab from './tabs/videoTab';

export default function MediaActionComponent({
  open,
  activeTab,
  setActiveTab,
  data,
  setFormData,
}: {
  open: boolean;
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  data?: MediaActionData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    switch (activeTab) {
      case 'image':
        setPage(1);
        break;
      case 'video':
        setPage(2);
        break;
      case 'text':
        setPage(3);
        break;
      default:
        setPage(1);
        break;
    }
  }, [activeTab]);

  React.useEffect(() => {
    switch (page) {
      case 1:
        setActiveTab('image');
        break;
      case 2:
        setActiveTab('video');
        break;
      case 3:
        setActiveTab('text');
        break;
      default:
        setActiveTab('image');
        break;
    }
  }, [page]);

  React.useEffect(() => {
    if (data) {
      switch (data.type) {
        case 'image':
          setPage(1);
          break;
        case 'video':
          setPage(2);
          break;
        case 'text':
          setPage(3);
          break;
        default:
          setPage(1);
          break;
      }
    }
  }, [data]);

  return (
    <div>
      <TabsHeader
        type={data?.type}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="contentContainer">
        <div className="tabsContentContainer">
          <Slider
            fade
            noCheck
            id="mediaActionComponentSlider"
            page={page}
            setPage={setPage}
            disabled
          >
            <ImageTab
              data={data && data.type === 'image' ? data : undefined}
              open={open}
              setFormData={setFormData}
            />
            <VideoTab
              data={data && data.type === 'video' ? data : undefined}
              open={open}
              setFormData={setFormData}
            />
            <TextTab
              data={data && data.type === 'text' ? data : undefined}
              open={open}
              setFormData={setFormData}
            />
          </Slider>
        </div>
      </div>
    </div>
  );
}
