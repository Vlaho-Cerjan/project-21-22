'use client';

import React from 'react';
import {useSwiper} from 'swiper/react';
import type {TextSlide, TextSliderData} from 'types/slideDataType';

import MemoBack from '@/src/icons/back';
import MemoEditMore from '@/src/icons/edit-more';
import MemoForward from '@/src/icons/forward';

import IconButton from '../../common/iconButton/iconButton';
import Title from '../../common/title/title';

export default function SlideBottomItem({
  index,
  item,
  page,
  data,
  setData,
  textColor,
  backgroundColor,
  onEditText,
}: {
  index: number;
  item: TextSlide;
  page: number;
  data: TextSliderData;
  setData: React.Dispatch<React.SetStateAction<TextSliderData>>;
  textColor: string;
  backgroundColor: string;
  onEditText: (item: TextSlide) => void;
}) {
  const swiper = useSwiper();

  React.useEffect(() => {
    if (swiper) swiper.slideTo(page, 250);
  }, [page]);

  const moveLeft = () => {
    if (index === 0) return;
    const newData = [...data.slides];
    const temp = newData[index - 1];
    newData[index - 1] = newData[index] as TextSlide;
    newData[index] = temp as TextSlide;
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
    newData[index + 1] = newData[index] as TextSlide;
    newData[index] = temp as TextSlide;
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
                data-tooltip-id="leftArrowMoveBottom"
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
                data-tooltip-id="rightArrowMoveBottom"
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
                onClick={() => onEditText(item)}
                className="darkButton"
                data-tooltip-id="editButtonBottom"
                data-tooltip-content="Edit Slide"
                icon={<MemoEditMore />}
              />
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          color: textColor,
          backgroundColor,
        }}
        className="bottomPageComponent"
      >
        <Title>{item.data.text}</Title>
      </div>
    </>
  );
}
