import {useSwiper} from 'swiper/react';
import type {SliderData, TextSliderData} from 'types/slideDataType';

import MemoLeftArrow from '@/src/icons/left-arrow';
import MemoRightArrow from '@/src/icons/right-arrow';

import IconButton from '../../common/iconButton/iconButton';

export function SliderArrows({
  page,
  data,
  id,
}: {
  page: number;
  data: SliderData | TextSliderData;
  id: string;
}) {
  const swiper = useSwiper();

  return (
    <>
      <IconButton
        disabled={page === 0 || !data || data.slides.length === 0}
        onClick={() => {
          swiper.slidePrev();
        }}
        containerProps={{className: 'arrowButtonContainer leftArrow'}}
        className="arrowButton leftArrow"
        id="leftArrow"
        data-tooltip-id={`leftArrowTooltip_${id}`}
        data-tooltip-content={
          page === 0 || !data || data.slides.length === 0
            ? 'Cannot Slide Left'
            : 'Slide Left'
        }
        data-tooltip-variant={
          page === 0 || !data || data.slides.length === 0 ? 'error' : undefined
        }
        icon={<MemoLeftArrow />}
      />
      <IconButton
        disabled={
          !data || data.slides.length === 0 || page === data.slides.length - 1
        }
        onClick={() => {
          swiper.slideNext();
        }}
        containerProps={{className: 'arrowButtonContainer rightArrow'}}
        className="clearButton arrowButton rightArrow"
        id="rightArrow"
        data-tooltip-id={`rightArrowTooltip_${id}`}
        data-tooltip-content={
          !data || data.slides.length === 0 || page === data.slides.length - 1
            ? 'Cannot Slide Right'
            : 'Slide Right'
        }
        data-tooltip-variant={
          !data || data.slides.length === 0 || page === data.slides.length - 1
            ? 'error'
            : undefined
        }
        icon={<MemoRightArrow />}
      />
    </>
  );
}
