import React from 'react';
import type {SliderData, TextSliderData} from 'types/slideDataType';

import {backendData} from '@/src/constants/backendData';
import MemoAttachment from '@/src/icons/attachment';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';

export interface GridData {
  folderId?: string;
  id: string;
  name: string;
  type: string;
  url?: string;
  thumb?: string;
  text?: string;
  rss?: string;
  size?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  created_at?: string;
  updated_at?: string;
  orgHierarchy?: string[];
}

export default function AttachMediaModal({
  open,
  setOpen,
  sliderData,
  setSliderData,
  textSliderData,
  setTextSliderData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sliderData: SliderData;
  setSliderData: React.Dispatch<React.SetStateAction<SliderData>>;
  textSliderData: TextSliderData;
  setTextSliderData: React.Dispatch<React.SetStateAction<TextSliderData>>;
}) {
  // const [rootData, setRootData] = React.useState<any[]>(backendData);
  const [selectedItems, setSelectedItems] = React.useState<any[]>(
    backendData.filter((item) => {
      if (
        sliderData &&
        sliderData.slides.find((slide) => slide.data.id === item.id)
      ) {
        return true;
      }
      if (
        textSliderData &&
        textSliderData.slides.find((slide) => slide.data.id === item.id)
      ) {
        return true;
      }
      return false;
    }),
  );

  React.useEffect(() => {
    if (open) {
      const sliderDataItems = sliderData.slides.map((slide) => slide.data);
      if (textSliderData) {
        const textSliderDataItems = textSliderData.slides.map(
          (slide) => slide.data,
        );
        setSelectedItems([...sliderDataItems, ...textSliderDataItems]);
      } else setSelectedItems(sliderDataItems);
    }
  }, [open]);

  // const onItemDeSelect = (items: GridData[]) => {
  //  setSelectedItems(items);
  // };

  // const [GridData, setMediaData] = React.useState<GridData[]>([...rootData]);

  React.useEffect(() => {
    const onDragDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener('dragover', onDragDrop);
    document.addEventListener('drop', onDragDrop);

    return () => {
      document.removeEventListener('dragover', onDragDrop);
      document.removeEventListener('drop', onDragDrop);
    };
  }, []);

  return (
    <div id="attachMediaModalContainer">
      <Modal
        className="attachMediaModal"
        closeOnClickFn={() => {
          const sliderDataItems = sliderData.slides.map((slide) => slide.data);
          if (textSliderData) {
            const textSliderDataItems = textSliderData.slides.map(
              (slide) => slide.data,
            );
            setSelectedItems([...sliderDataItems, ...textSliderDataItems]);
          } else setSelectedItems(sliderDataItems);
          setOpen(false);
        }}
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          id="attachMediaModalHeader"
          className="attachMediaModalHeader"
          title="Attach Media"
          description="Select media to add to your device signage set."
        />
        <ModalDivider />
        <ModalContent id="attachMediaContent" className="attachMediaContent">
          {/*
          <FolderView
            onSearch={() => {
              return Promise.resolve([]);
            }}
            placeName="Media"
            open={open}
            setRootData={setRootData}
            rootData={rootData}
            selectedItems={selectedItems}
            GridData={GridData}
            setMediaData={setMediaData}
            onItemDeSelect={onItemDeSelect}
            type="modal"
          />
          */}
        </ModalContent>
        <ModalFooter
          noBackButton
          id="attachMediaModalFooter"
          className="attachMediaModalFooter"
          setOpen={setOpen}
          modalClass="attachMediaModal"
          buttonText="Attach Media"
          loadingText="Attaching Media ..."
          successText="Media Attached!"
          errorText="Error"
          onSubmit={() => {
            setSliderData({
              ...sliderData,
              slides: selectedItems
                .filter(
                  (item) => item.type === 'image' || item.type === 'video',
                )
                .map((item, index) => {
                  if (
                    sliderData.slides.find((slide) => slide.data.id === item.id)
                  ) {
                    return sliderData.slides.find(
                      (slide) => slide.data.id === item.id,
                    ) as any;
                  }
                  return {
                    id: `slide_${item.id}`,
                    data: item,
                    order: index,
                  };
                }),
            });
            setTextSliderData({
              ...textSliderData,
              slides: selectedItems
                .filter((item) => item.type === 'text')
                .map((item, index) => {
                  if (
                    textSliderData &&
                    textSliderData.slides.find(
                      (slide) => slide.data.id === item.id,
                    )
                  ) {
                    return textSliderData.slides.find(
                      (slide) => slide.data.id === item.id,
                    ) as any;
                  }
                  return {
                    id: `slide_${item.id}`,
                    data: item,
                    order: index,
                    textColor: '#ffffff',
                    backgroundColor: '#000000',
                  };
                }),
            });
            setOpen(false);
          }}
          buttonIcon={<MemoAttachment />}
        />
      </Modal>
    </div>
  );
}
