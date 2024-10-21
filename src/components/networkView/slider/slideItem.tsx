'use client';

import Image from 'next/image';
import React from 'react';
import {useSwiper} from 'swiper/react';
import type {Slide, SliderData} from 'types/slideDataType';

import MemoBack from '@/src/icons/back';
import MemoEditMore from '@/src/icons/edit-more';
import MemoForward from '@/src/icons/forward';
import MemoPlayButton from '@/src/icons/play-button';

import IconButton from '../../common/iconButton/iconButton';

export default function SlideItem({
  item,
  index,
  data,
  setData,
  page,
  onEditMedia,
}: {
  item: Slide;
  index: number;
  data: SliderData;
  setData: React.Dispatch<React.SetStateAction<SliderData>>;
  page: number;
  onEditMedia: (item: Slide) => void;
}) {
  const swiper = useSwiper();
  React.useEffect(() => {
    if (swiper) swiper.slideTo(page, 250);
  }, [page]);

  const moveLeft = () => {
    if (index === 0) return;
    const newData = [...data.slides];
    const temp = newData[index - 1];
    newData[index - 1] = newData[index] as Slide;
    newData[index] = temp as Slide;
    const newDataWithOrders = newData.map((itemTemp, indexTemp) => ({
      ...itemTemp,
      order: indexTemp + 1,
    }));
    setData({...data, slides: newDataWithOrders});
  };

  const moveRight = () => {
    if (index === data.slides.length - 1) return;
    const newData = [...data.slides];
    const temp = newData[index + 1];
    newData[index + 1] = newData[index] as Slide;
    newData[index] = temp as Slide;
    const newDataWithOrders = newData.map((itemTemp, indexTemp) => ({
      ...itemTemp,
      order: indexTemp + 1,
    }));
    setData({...data, slides: newDataWithOrders});
  };

  return (
    <>
      <div className="overlayContainer">
        {swiper.activeIndex === index && (
          <div className="overlayControls">
            <div className="arrowContainer">
              <IconButton
                className="darkButton"
                onClick={moveLeft}
                disabled={index === 0}
                data-tooltip-id="leftArrowMove"
                data-tooltip-content={
                  index === 0 ? 'Slide Cannot Move Left' : 'Move Slide Left'
                }
                data-tooltip-variant={index === 0 ? 'error' : undefined}
                icon={<MemoBack />}
              />
              <IconButton
                className="darkButton"
                onClick={moveRight}
                disabled={index === data.slides.length - 1}
                data-tooltip-id="rightArrowMove"
                data-tooltip-content={
                  index === data.slides.length - 1
                    ? 'Slide Cannot Move Right'
                    : 'Move Slide Right'
                }
                data-tooltip-variant={
                  index === data.slides.length - 1 ? 'error' : undefined
                }
                icon={<MemoForward />}
              />
            </div>
            <div>
              <IconButton
                onClick={() => onEditMedia(item)}
                className="darkButton"
                data-tooltip-id="editButton"
                data-tooltip-content="Edit Slide"
                icon={<MemoEditMore />}
              />
            </div>
            {item.data.type === 'video' && (
              <div className="playContainer">
                <IconButton
                  data-tooltip-id="playButton"
                  data-tooltip-content="Play Preview"
                  icon={<MemoPlayButton />}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="imgContainer">
        <Image
          src={
            item.data.type === 'video'
              ? item.data.thumb || ''
              : item.data.url || ''
          }
          alt={item.data.name || ''}
          fill
        />
      </div>
    </>
  );
}
