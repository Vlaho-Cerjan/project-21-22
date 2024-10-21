import 'rc-slider/assets/index.css';

import React from 'react';

import MemoClearDark from '@/src/icons/clear-dark';
import MemoCloudUploadSolid from '@/src/icons/cloud-upload-solid';
import MemoFolder from '@/src/icons/folder';
import MemoTapHere from '@/src/icons/tap-here';

import NoStyleButton from '../../common/button/noStyleButton';
import Description from '../../common/description/description';

export default function VideoUpload({
  video,
  setVideo,
}: {
  video: string | null;
  setVideo: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  // const [crop, setCrop] = React.useState(false);
  // const [completedCrop, setCompletedCrop] = React.useState<string | null>(null);
  // const [originalVideo, setOriginalVideo] = React.useState<string | null>(
  //  video,
  // );
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [notAllowed, setNotAllowed] = React.useState(false);

  /* function handlePlayButton() {
    const videoElem = videoRef.current;
    if (!videoElem) return;
    if (videoElem.paused) {
      playVideo();
    } else {
      videoElem.pause();
    }
  } 
  function onCropDeActivate() {
    setCrop(!crop);
  }

  */

  const isItAllowed = (e: DragEvent) => {
    if (
      e.dataTransfer &&
      e.dataTransfer.items &&
      (e.dataTransfer.items.length > 1 ||
        !e.dataTransfer?.items[0]?.type.includes('video'))
    ) {
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    // drag and drop image to uploadImageContainer inside imageUploadPreview div
    const videoTab = document.getElementById('videoTab');
    const uploadImageContainer = videoTab?.querySelector(
      '.uploadImageContainer',
    );

    if (videoTab && uploadImageContainer) {
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer?.types.includes('Files')) {
          if (!isItAllowed(e)) {
            setNotAllowed(true);
            return;
          }
          uploadImageContainer.classList.add('active');
        }
      };

      const onDragLeave = () => {
        setNotAllowed(false);
        uploadImageContainer.classList.remove('active');
      };

      const onDropOutside = (e: DragEvent) => {
        setNotAllowed(false);
        if (
          (e.target as HTMLElement).classList.contains(
            'uploadImageContainer',
          ) ||
          (e.target as HTMLElement).closest('.uploadImageContainer')
        )
          return;
        e.preventDefault();
        uploadImageContainer.classList.remove('active');
      };

      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setNotAllowed(false);
        if (!isItAllowed(e)) {
          return;
        }
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          const {files} = e.dataTransfer;
          const file = files[0];
          if (file) {
            // get video in base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
              if (reader.result && typeof reader.result === 'string') {
                setVideo(reader.result);
                // setOriginalVideo(reader.result);
              }
            });
          }
        }
        uploadImageContainer.classList.remove('active');
      };

      videoTab.addEventListener('dragover', onDragOver);
      videoTab.addEventListener('dragleave', onDragLeave);
      videoTab.addEventListener('drop', onDropOutside);
      (uploadImageContainer as HTMLElement)?.addEventListener('drop', onDrop);

      return () => {
        videoTab.removeEventListener('dragover', onDragOver);
        videoTab.removeEventListener('dragleave', onDragLeave);
        videoTab.removeEventListener('drop', onDropOutside);
        (uploadImageContainer as HTMLElement)?.removeEventListener(
          'drop',
          onDrop,
        );
      };
    }

    return () => {};
  }, []);

  return (
    <>
      <div className="imageUploadContainer noSwiping">
        <input hidden name="video" required value={video || undefined} />
        <input
          ref={uploadInputRef}
          type="file"
          name="videoAsset"
          id="videoUpload"
          // accept video files
          accept="video/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              // setCrop(false);
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                // set range value to 0 and duration of video
                if (reader.result && typeof reader.result === 'string') {
                  setVideo(reader.result);
                  // setOriginalVideo(reader.result);
                }
              });
              if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        <div className="imageUploadPreviewContainer">
          <div className={`imageUploadPreview ${video ? ' image' : ' upload'}`}>
            <div className="cropImageContainer">
              <video
                style={{
                  width: '100%',
                  height: '100%',
                }}
                controls
                ref={videoRef}
                src={video || ''}
              >
                <track kind="captions" />
              </video>
            </div>
            <NoStyleButton
              onClick={() => {
                if (uploadInputRef.current) uploadInputRef.current.click();
              }}
              className="uploadButton"
            >
              <MemoTapHere />
              <Description>Tap here to upload a video</Description>
            </NoStyleButton>
            <div
              className={`uploadImageContainer${
                notAllowed ? ' notAllowed' : ''
              }`}
            >
              {notAllowed ? (
                <>
                  <div>
                    <p>Type or amount of files not allowed</p>
                  </div>
                  <MemoClearDark className="notAllowedIcon" />
                </>
              ) : (
                <>
                  <div>
                    <p>Drop files to upload them to</p>
                    <p className="placeName">
                      <MemoFolder /> Signage Sets
                    </p>
                  </div>
                  <MemoCloudUploadSolid className="cloudUploadIcon" />
                </>
              )}
            </div>
          </div>
          {/*
        <div className="imageUploadActionContainer">
          <IconButton
            onClick={() => setVideo(originalVideo)}
            icon={<MemoReset />}
            data-tooltip-id="resetImageUpload"
            data-tooltip-content="Reset Image"
          />
          <Divider />
          <IconButton
            icon={<MemoCrop />}
            data-tooltip-id="cropImageUpload"
            data-tooltip-content="Crop Image"
          />
          <Divider />
          <IconButton
            className={crop ? 'active' : ''}
            onClick={() => onCropDeActivate()}
            icon={<MemoResize />}
            data-tooltip-id="resizeImageUpload"
            data-tooltip-content="Resize Image"
          />
        </div>
        */}
        </div>
      </div>
      <div className="errorContainer video">
        <p className="error">Video is required.</p>
      </div>
    </>
  );
}
