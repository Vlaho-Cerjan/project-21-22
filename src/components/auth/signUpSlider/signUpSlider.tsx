// import 'swiper/css/effect-fade';

import type {Dispatch, SetStateAction} from 'react';
import React from 'react';
import type {Swiper as SwType} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';

import InputValidationAll from '@/src/utils/InputValidationAll';
import IsItMobile from '@/src/utils/IsItMobileDevice';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import type {RegistrationData} from '@/types/registrations';
import {toast} from 'react-toastify';
import type {PageData} from '../pageComponent/pageComponent';
import PageComponent from '../pageComponent/pageComponent';

const sendVerificationCode = async (phone: string) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'auth/phone-verification-request',
    method: 'POST',
    data: {mobile_number: phone},
    auth: false,
  });

  if (!response.success)
    toast.error('Error sending verification code', {
      autoClose: false,
    });
  else toast.success('Verification code sent successfully');
  return response;
};

export default function SignInSlider({
  swiper,
  setSwiper,
  id,
  page,
  setPage,
  pageData,
  openPhone,
  verifiedPhone,
  setVerifiedPhone,
  businessData,
  clearValue,
  onEmailSubmit,
}: {
  swiper: SwType | null;
  setSwiper: Dispatch<SetStateAction<SwType | null>>;
  id: string;
  page: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  pageData: PageData[];
  openPhone?: Dispatch<SetStateAction<boolean>>;
  verifiedPhone?: boolean;
  setVerifiedPhone?: Dispatch<SetStateAction<boolean>>;
  businessData?: RegistrationData;
  clearValue?: (inputName: string) => void;
  onEmailSubmit?: () => void;
}) {
  const [disableNext, setDisableNext] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [disableSwiper, setDisableSwiper] = React.useState(false);

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
    if (swiper && swiper.slides && page) {
      const activeSlide = swiper.slides[swiper.activeIndex];
      console.log(
        activeSlide,
        typeof activeSlide?.querySelectorAll,
        'activeSlide',
      );
      if (activeSlide) {
        const inputEls = activeSlide.querySelectorAll(
          'input[required], textarea[required], select[required]',
        );
        const errorEls = activeSlide.querySelectorAll('.errorContainer');
        console.log(inputEls, 'inputEls');
        if (
          inputEls &&
          !InputValidationAll(inputEls, errorEls, true, businessData)
        ) {
          setDisableNext(true);
        } else {
          setDisableNext(false);
        }
      }
    }
  }, [swiper, page]);

  const handleKeyUp = (e: KeyboardEvent) => {
    const signInModal = document.querySelector('.signInModal');
    const target = e.target as HTMLElement;
    const isTargetInModal = signInModal?.contains(target);
    if (e.key === 'Enter' && !isTargetInModal) {
      e.preventDefault();
      const pageComponent =
        document.querySelectorAll('.pageComponent')[page - 1];
      const inputEl = pageComponent?.querySelectorAll(
        'input[required], textarea[required], select[required]',
      );
      const errorEl = pageComponent?.querySelectorAll('.errorContainer');

      if (
        inputEl &&
        !InputValidationAll(inputEl, errorEl, false, businessData)
      ) {
        setDisableNext(true);
        return;
      }

      const currentInputName = pageData[page - 1]?.inputName;
      const pageLength = pageData.length;
      if (
        currentInputName === 'mobileNumber' &&
        typeof openPhone !== 'undefined' &&
        typeof verifiedPhone !== 'undefined' &&
        !verifiedPhone
      ) {
        e.preventDefault();
        e.stopPropagation();
        openPhone(true);
        sendVerificationCode(businessData?.mobile_number || '');
      } else if (currentInputName === 'email' && businessData?.email) {
        if (typeof onEmailSubmit !== 'undefined') onEmailSubmit();
      } else if (page < pageLength) {
        setPage(page + 1);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [page, businessData]);

  return (
    <form className="pageContainer signInSlider">
      <Swiper
        id={id}
        slidesPerView={1}
        observer
        mousewheel={false}
        allowSlideNext={!disableNext && !disableSwiper}
        allowSlidePrev={!disableSwiper}
        onSlideChangeTransitionEnd={(swiperEl) => {
          console.log('onSlideChangeTransitionEnd');
          if (swiperEl) {
            const input = swiperEl.slides[swiperEl.activeIndex]?.querySelector(
              'input[required], textarea[required], select[required]',
            );
            console.log(input);
            if (input && input instanceof HTMLInputElement) {
              input.focus();
            }
          }
        }}
        onSlideNextTransitionStart={(swiperEl) => {
          console.log('onSlideNextTransitionStart');
          setDisableSwiper(false);
          if (swiperEl) {
            const activeSlide = swiperEl.slides[swiperEl.activeIndex];
            if (activeSlide) {
              const inputEls = activeSlide.querySelectorAll(
                'input[required], textarea[required], select[required]',
              );
              const errorEls = activeSlide.querySelectorAll('.errorContainer');

              if (
                inputEls &&
                !InputValidationAll(inputEls, errorEls, true, businessData) &&
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
          console.log('onTouchMove');
          setDisableSwiper(false);
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
                if (
                  inputEls &&
                  InputValidationAll(inputEls, errorEls, false, businessData)
                ) {
                  setDisableNext(false);
                } else {
                  setDisableNext(true);
                }
              }

              if (
                inputEls &&
                InputValidationAll(inputEls, errorEls, true, businessData)
              ) {
                setDisableNext(false);
              }
            }
          }
        }}
        onTouchStart={(swiperEl) => {
          console.log('onTouchStart');
          if (!isMobile) {
            setDisableSwiper(true);
            return;
          }
          setDisableSwiper(false);
          if (swiperEl) {
            const activeSlide = swiperEl.slides[swiperEl.activeIndex];
            if (activeSlide) {
              const inputEls = activeSlide.querySelectorAll(
                'input, textarea, select',
              );
              const errorEls = activeSlide.querySelectorAll('.errorContainer');

              if (
                inputEls &&
                InputValidationAll(inputEls, errorEls, true, businessData)
              ) {
                setDisableNext(false);
              }
            }
          }
        }}
        onSlideChange={(swiperEl) => {
          console.log('onSlideChange');
          if (swiperEl && page !== swiperEl.activeIndex + 1) {
            setPage(swiperEl.activeIndex + 1);
          }
        }}
        onSwiper={(swiperE) => setSwiper(swiperE)}
      >
        {pageData?.map((data, index) => {
          return (
            <SwiperSlide key={`${data.inputName}_key`}>
              <PageComponent
                index={index}
                currentPage={page}
                setPage={setPage}
                pageLength={pageData.length}
                openPhone={openPhone}
                verifiedPhone={verifiedPhone}
                setVerifiedPhone={setVerifiedPhone}
                businessData={businessData}
                clearValue={clearValue}
                onEmailSubmit={onEmailSubmit}
                {...data}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </form>
  );
}
