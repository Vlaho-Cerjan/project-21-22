import {debounce} from 'lodash';
import dynamic from 'next/dynamic';
import React from 'react';
import {ChromePicker} from 'react-color';
import {toast} from 'react-toastify';
import {Mousewheel} from 'swiper/modules';
import type {SwiperRef} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';
import type {SliderData, TextSlide, TextSliderData} from 'types/slideDataType';
import {useLongPress} from 'use-long-press';
import {useWindowSize} from 'usehooks-ts';

import AttachMediaModal from '@/src/components/networkView/modals/attachMediaModal';
import MemoAttachment from '@/src/icons/attachment';
import MemoDownArrow from '@/src/icons/down-arrow';
import MemoInfo from '@/src/icons/info';
import ContrastChecker from '@/src/utils/ColorContrastChecker';

import ClearButton from '../../common/button/clearButton';
import WhiteButton from '../../common/button/whiteButton';
import Description from '../../common/description/description';
import Divider from '../../common/divider/divider';
import EditMediaModal from '../../mediaAssetsView/modals/editMediaModal';
import ProjectTooltip from '../../tooltip/tooltip';
import SlideBottomItem from './slideBottomItem';
import SlideItem from './slideItem';
import {SliderArrows} from './sliderArrows';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function SignageSlider({
  mediaData,
  setMediaData,
  textData,
  setTextData,
  type,
}: {
  mediaData: SliderData;
  setMediaData: React.Dispatch<React.SetStateAction<SliderData>>;
  textData: TextSliderData;
  setTextData: React.Dispatch<React.SetStateAction<TextSliderData>>;
  type?: 'signage' | 'device';
}) {
  const {width} = useWindowSize();
  const [page, setPage] = React.useState(0);
  const [textPage, setTextPage] = React.useState(0);
  const [openBg, setOpenBg] = React.useState(false);
  const [openText, setOpenText] = React.useState(false);
  const [openEditMedia, setOpenEditMedia] = React.useState(false);
  const [editMedia, setEditMedia] = React.useState<any | null>(null);
  const [openAttachMedia, setOpenAttachMedia] = React.useState(false);

  React.useEffect(() => {
    if (!openEditMedia) setEditMedia(undefined);
  }, [openEditMedia]);

  const checkContrast = React.useCallback(
    (value: string, typeTemp: 'text' | 'background', data: TextSlide) => {
      let contrast = false;
      if (typeTemp === 'text') {
        contrast = ContrastChecker(value, data.backgroundColor || '');
      } else {
        contrast = ContrastChecker(data.textColor || '', value);
      }

      toast.dismiss();
      if (!contrast)
        toast.error('Contrast ratio is too low, please change the color', {
          autoClose: 1000,
        });
      else {
        toast.success('Contrast ratio is good', {
          autoClose: 1000,
        });
      }
    },
    [page],
  );

  const debouncedCheckContrast = React.useMemo(() => {
    return debounce(checkContrast, 250);
  }, [checkContrast, page]);

  const onEditMedia = () => {
    setOpenEditMedia(true);
    setEditMedia(mediaData.slides[page]?.data);
  };

  const onEditText = () => {
    setOpenEditMedia(true);
    setEditMedia(textData.slides[textPage]?.data);
  };

  const runOptions = [
    {
      id: '1',
      name: 'Continuously',
    },
    {
      id: '2',
      name: 'Every video',
    },
    {
      id: '3',
      name: 'Every 2 videos',
    },
    {
      id: '4',
      name: 'Every 3 videos',
    },
    {
      id: '5',
      name: 'Every 4 videos',
    },
    {
      id: '6',
      name: 'Every 5 videos',
    },
    {
      id: '7',
      name: 'Every 6 videos',
    },
    {
      id: '8',
      name: 'Every 7 videos',
    },
    {
      id: '9',
      name: 'Every 8 videos',
    },
  ];
  const swiperRef = React.useRef<SwiperRef>(null);
  const textSwiperRef = React.useRef<SwiperRef>(null);
  const [openInfoTooltip, setOpenInfoTooltip] = React.useState(false);
  const callback = React.useCallback(() => {
    setOpenInfoTooltip(true);
  }, []);
  const bind = useLongPress(callback, {
    onFinish: () => setOpenInfoTooltip(false),
    onCancel: () => setOpenInfoTooltip(false),
    filterEvents: () => true, // All events can potentially trigger long press (same as 'undefined')
    threshold: 500, // In milliseconds
    captureEvent: true, // Event won't get cleared after React finish processing it
    cancelOnMovement: 25, // Square side size (in pixels) inside which movement won't cancel long press
    cancelOutsideElement: true, // Cancel long press when moved mouse / pointer outside element while pressing
  });

  React.useEffect(() => {
    if (swiperRef.current && mediaData && mediaData.slides.length > 0) {
      swiperRef.current.swiper.init();
    }
  }, [mediaData]);

  React.useEffect(() => {
    if (textSwiperRef.current && textData && textData.slides.length > 0) {
      textSwiperRef.current.swiper.init();
    }
  }, [textData]);

  return (
    <div className="signageSliderContainer">
      <div className="signageSliderHeader">
        <div className="leftContainer">
          {type === 'device' && (
            <>
              <MemoInfo
                {...bind()}
                data-tooltip-id="mixSignageTooltip"
                data-tooltip-content="These will mix with above signage sets"
              />
              {width >= 520 ? (
                'These will mix with above signage sets'
              ) : (
                <ProjectTooltip
                  open={openInfoTooltip}
                  setOpen={setOpenInfoTooltip}
                  id="mixSignageTooltip"
                />
              )}
            </>
          )}
        </div>
        <div className="rightContainer">
          <WhiteButton
            onClick={() => {
              setOpenAttachMedia(true);
            }}
          >
            <MemoAttachment />
            Attach Media
          </WhiteButton>
        </div>
      </div>
      <div className="sliderContainer">
        <Swiper
          id="editSignageSlider"
          ref={swiperRef}
          init={false}
          slidesPerView="auto"
          mousewheel
          modules={[Mousewheel]}
          centeredSlides
          spaceBetween={width < 768 ? 4 : 8}
          onSlideChange={(swiper) => {
            setPage(swiper.activeIndex);
          }}
        >
          {mediaData &&
            mediaData.slides.length > 0 &&
            mediaData.slides
              .sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <SwiperSlide key={item.id}>
                  <SlideItem
                    item={item}
                    index={index}
                    data={mediaData}
                    setData={setMediaData}
                    page={page}
                    onEditMedia={onEditMedia}
                  />
                </SwiperSlide>
              ))}
          <SliderArrows id="media" page={page} data={mediaData} />
        </Swiper>
      </div>
      <div
        className={`footerContainer ${
          mediaData && mediaData.slides.length > 0 ? 'active' : ''
        }`}
      >
        <div className="paginationContainer">
          <div className="pagination">
            {mediaData &&
              mediaData.slides.length > 0 &&
              mediaData.slides.map((item, index) => (
                <ClearButton
                  onClick={() => {
                    setPage(index);
                  }}
                  key={item.id}
                  className={`pageIndicator ${
                    index === page ? 'activePage' : ''
                  }`}
                >
                  {index + 1}
                </ClearButton>
              ))}
          </div>
        </div>
        <div className="rightContainer">
          <RcDropdownLazy
            placement="bottomRight"
            trigger={['click']}
            overlay={
              <div className="timingDropdown">
                {runOptions.map((itemTemp) => (
                  <ClearButton
                    key={itemTemp.id}
                    onClick={() => {
                      setMediaData((prev) => ({
                        ...prev,
                        timing: itemTemp.id,
                      }));
                    }}
                    className="runOption"
                  >
                    {itemTemp.name}
                  </ClearButton>
                ))}
              </div>
            }
          >
            <ClearButton disabled={!mediaData || mediaData.slides.length === 0}>
              Run{' '}
              {
                runOptions.find(
                  (timing) => timing.id === (mediaData && mediaData.timing),
                )?.name
              }
              <MemoDownArrow />
            </ClearButton>
          </RcDropdownLazy>
        </div>
      </div>
      <Divider className="white" />
      <div
        className={`bottomSliderContainer ${
          textData && textData.slides.length > 0 ? 'active' : ''
        }`}
      >
        <Swiper
          ref={textSwiperRef}
          init={false}
          id="bottomSignageSlider"
          className={`bottomSlider ${
            textData && textData.slides.length > 0 ? '' : 'disabled'
          }`}
          slidesPerView="auto"
          mousewheel
          modules={[Mousewheel]}
          centeredSlides
          spaceBetween={width < 768 ? 4 : 8}
          onSlideChange={(swiper) => {
            setTextPage(swiper.activeIndex);
          }}
        >
          {textData &&
            textData.slides.length > 0 &&
            textData.slides.map((item, index) => (
              <SwiperSlide
                key={item.id}
                style={{
                  height: '100%',
                }}
              >
                <SlideBottomItem
                  index={index}
                  data={textData}
                  setData={setTextData}
                  item={item}
                  page={textPage}
                  textColor={item.textColor}
                  backgroundColor={item.backgroundColor}
                  onEditText={onEditText}
                />
              </SwiperSlide>
            ))}
          {textData && textData.slides.length > 0 && (
            <SliderArrows id="text" page={textPage} data={textData} />
          )}
        </Swiper>
        <div
          className={`footerContainer spaceBetween ${
            textData && textData.slides.length > 0 ? 'active' : ''
          }`}
        >
          <div className="leftContainer">
            <div className="colorContainer">
              <RcDropdownLazy
                visible={openBg}
                placement="topLeft"
                overlayClassName="colorDropdown"
                overlay={
                  <div>
                    <ChromePicker
                      disableAlpha={false}
                      color={
                        textData &&
                        textData.slides &&
                        textData.slides[textPage]?.backgroundColor
                      }
                      onChange={(color) => {
                        setTextData((prev) => ({
                          ...prev,
                          slides: prev.slides.map((slide, index) => {
                            if (index === textPage) {
                              return {
                                ...slide,
                                backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                              };
                            }
                            return slide;
                          }),
                        }));
                        const data = textData.slides[textPage];
                        if (data) {
                          debouncedCheckContrast(
                            `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                            'background',
                            data,
                          );
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOpenBg(false);
                      }}
                      className="colorOverlay"
                    >
                      Click To Close
                    </button>
                  </div>
                }
              >
                <ClearButton
                  disabled={!textData || textData.slides.length === 0}
                  onClick={() => {
                    setOpenText(false);
                    setOpenBg((prev) => !prev);
                  }}
                  className="colorButton"
                >
                  <div
                    className="color"
                    style={{
                      backgroundColor:
                        textData &&
                        textData.slides &&
                        textData.slides[textPage]?.backgroundColor,
                    }}
                  />
                  <Description>Bg Color</Description>
                </ClearButton>
              </RcDropdownLazy>
            </div>
            <div className="colorContainer">
              <RcDropdownLazy
                visible={openText}
                placement="topLeft"
                overlayClassName="colorDropdown"
                overlay={
                  <div>
                    <ChromePicker
                      disableAlpha={false}
                      color={
                        textData &&
                        textData.slides &&
                        textData.slides[textPage]?.textColor
                      }
                      onChange={(color) => {
                        setTextData((prev) => ({
                          ...prev,
                          slides: prev.slides.map((slide, index) => {
                            if (index === textPage) {
                              return {
                                ...slide,
                                textColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                              };
                            }
                            return slide;
                          }),
                        }));
                        const data = textData.slides[textPage];
                        if (data) {
                          debouncedCheckContrast(
                            `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                            'text',
                            data,
                          );
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOpenText(false);
                      }}
                      className="colorOverlay"
                    >
                      Click To Close
                    </button>
                  </div>
                }
              >
                <ClearButton
                  disabled={!textData || textData.slides.length === 0}
                  onClick={() => {
                    setOpenBg(false);
                    setOpenText((prev) => !prev);
                  }}
                  className="colorButton"
                >
                  <div
                    className="color"
                    style={{
                      backgroundColor:
                        textData &&
                        textData.slides &&
                        textData.slides[textPage]?.textColor,
                    }}
                  />
                  <Description>Text Color</Description>
                </ClearButton>
              </RcDropdownLazy>
            </div>
          </div>
          <div className="paginationContainer">
            <div className="pagination">
              {textData &&
                textData.slides &&
                textData.slides.map((item, index) => (
                  <ClearButton
                    onClick={() => {
                      setTextPage(index);
                    }}
                    key={item.id}
                    className={`pageIndicator ${
                      index === textPage ? 'activePage' : ''
                    }`}
                  >
                    {index + 1}
                  </ClearButton>
                ))}
            </div>
          </div>
          <div className="rightContainer">
            <RcDropdownLazy
              trigger={['click']}
              placement="bottomRight"
              overlay={
                <div className="timingDropdown bottomTimingDropdown">
                  {runOptions.map((item) => (
                    <ClearButton
                      key={item.id}
                      onClick={() => {
                        setTextData((prev) => ({
                          ...prev,
                          timing: item.id,
                        }));
                      }}
                      className="runOption"
                    >
                      {item.name}
                    </ClearButton>
                  ))}
                </div>
              }
            >
              <ClearButton disabled={!textData || textData.slides.length === 0}>
                Run{' '}
                {textData &&
                  runOptions.find((timing) => timing.id === textData.timing)
                    ?.name}
                <MemoDownArrow />
              </ClearButton>
            </RcDropdownLazy>
          </div>
        </div>
      </div>
      <EditMediaModal
        open={openEditMedia}
        setOpen={setOpenEditMedia}
        onSubmit={() => {}}
        data={editMedia}
      />
      <AttachMediaModal
        open={openAttachMedia}
        setOpen={setOpenAttachMedia}
        textSliderData={textData}
        setTextSliderData={setTextData}
        sliderData={mediaData}
        setSliderData={setMediaData}
      />
    </div>
  );
}
