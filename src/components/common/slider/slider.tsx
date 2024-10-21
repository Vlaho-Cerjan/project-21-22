import 'swiper/css/effect-fade';

import type {Dispatch} from 'react';
import React from 'react';
import {type Swiper as SwType} from 'swiper';
import {EffectFade} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import InputValidationAll from '@/src/utils/InputValidationAll';
import IsItMobile from '@/src/utils/IsItMobileDevice';

export default function Slider({
  id,
  page,
  setPage,
  children,
  fade,
  noCheck,
  disabled,
}: {
  id: string;
  page: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  children: React.ReactNode;
  fade?: boolean;
  noCheck?: boolean;
  disabled?: boolean;
}) {
  const [swiper, setSwiper] = React.useState<SwType | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [disableNext, setDisableNext] = React.useState(false);
  const [disableSwiper, setDisableSwiper] = React.useState(false);

  React.useEffect(() => {
    if (disabled) setDisableSwiper(true);
  }, [disabled]);

  React.useEffect(() => {
    if (IsItMobile()) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  React.useEffect(() => {
    setDisableSwiper(false);
    if (
      typeof swiper !== 'undefined' &&
      swiper &&
      swiper.params &&
      swiper.activeIndex !== page - 1
    ) {
      setTimeout(() => {
        swiper.slideTo(page - 1);
      }, 10);
    }
    if (noCheck) return;
    if (swiper && swiper.slides && page) {
      const activeSlide = swiper?.slides[swiper.activeIndex];
      if (activeSlide) {
        const inputEls = activeSlide.querySelectorAll(
          'input[required], textarea[required], select[required]',
        );
        const errorEls = activeSlide.querySelectorAll('.errorContainer');

        if (inputEls && !InputValidationAll(inputEls, errorEls, true)) {
          setDisableNext(true);
        } else {
          setDisableNext(false);
        }
      }
    }
  }, [swiper, page, noCheck]);

  return (
    <Swiper
      className={disabled ? 'noSwiping' : ''}
      id={id}
      modules={[EffectFade]}
      effect={fade ? 'fade' : undefined}
      fadeEffect={{
        crossFade: true,
      }}
      allowTouchMove={!disableSwiper}
      noSwipingClass="noSwiping"
      autoHeight
      observer
      slidesPerView={1}
      mousewheel={false}
      allowSlideNext={!disableNext && !disableSwiper}
      allowSlidePrev={!disableSwiper}
      onSlideChangeTransitionEnd={(swiperEl) => {
        if (noCheck) return;
        if (swiperEl) {
          const input = swiperEl.slides[swiperEl.activeIndex]?.querySelector(
            'input[required], textarea[required], select[required]',
          );
          if (input && input instanceof HTMLInputElement) {
            input.focus();
          }
        }
      }}
      onSlideNextTransitionStart={(swiperEl) => {
        setDisableSwiper(false);
        if (noCheck) return;
        if (swiperEl) {
          const activeSlide = swiperEl.slides[swiperEl.activeIndex];
          if (activeSlide) {
            const inputEls = activeSlide.querySelectorAll(
              'input[required], textarea[required], select[required]',
            );
            const errorEls = activeSlide.querySelectorAll('.errorContainer');

            if (
              inputEls &&
              !InputValidationAll(inputEls, errorEls, true) &&
              !disableNext
            ) {
              setDisableNext(true);
            } else {
              setDisableNext(false);
            }
          }
        }
      }}
      onTouchMove={(swiperEl) => {
        setDisableSwiper(false);
        if (noCheck) return;
        if (swiperEl) {
          const activeSlide = swiperEl.slides[swiperEl.activeIndex];
          if (activeSlide) {
            const inputEls = activeSlide.querySelectorAll(
              'input[required], textarea[required], select[required]',
            );
            const errorEls = activeSlide.querySelectorAll('.errorContainer');

            if (
              swiperEl &&
              swiperEl.touches &&
              swiperEl.touches.startX &&
              swiperEl.touches.currentX &&
              swiperEl.touches.startX - swiperEl.touches.currentX > 50
            ) {
              if (inputEls && InputValidationAll(inputEls, errorEls)) {
                setDisableNext(false);
              } else {
                setDisableNext(true);
              }
            }

            if (inputEls && InputValidationAll(inputEls, errorEls, true)) {
              setDisableNext(false);
            }
          }
        }
      }}
      onTouchStart={(swiperEl) => {
        if (!isMobile) {
          setDisableSwiper(true);
          return;
        }
        if (noCheck) return;
        setDisableSwiper(false);
        if (swiperEl) {
          const activeSlide = swiperEl.slides[swiperEl.activeIndex];
          if (activeSlide) {
            const inputEls = activeSlide.querySelectorAll(
              'input[required], textarea[required], select[required]',
            );
            const errorEls = activeSlide.querySelectorAll('.errorContainer');

            if (inputEls && InputValidationAll(inputEls, errorEls, true)) {
              setDisableNext(false);
            }
          }
        }
      }}
      onSlideChange={(swiperEl) => {
        if (swiperEl && page !== swiperEl.activeIndex + 1) {
          setPage(swiperEl.activeIndex + 1);
        }
      }}
      onSwiper={(swiperE) => setSwiper(swiperE)}
    >
      {React.Children.map(children, (child) => {
        return (
          <SwiperSlide>
            <div className="pageComponent">{child}</div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
