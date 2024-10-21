import 'cropperjs/dist/cropper.css';

import React from 'react';
import type {ReactCropperElement} from 'react-cropper';
import {Cropper} from 'react-cropper';

import MemoClearDark from '@/src/icons/clear-dark';
import MemoCloudUploadSolid from '@/src/icons/cloud-upload-solid';
import MemoCrop from '@/src/icons/crop';
import MemoFolder from '@/src/icons/folder';
import MemoReset from '@/src/icons/reset';
import MemoResize from '@/src/icons/resize';
import MemoTapHere from '@/src/icons/tap-here';

import NoStyleButton from '../../common/button/noStyleButton';
import Description from '../../common/description/description';
import Divider from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';

const aspect = 16 / 9;

export default function ImageUpload({
  image,
  setImage,
}: {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [cropEnabled, setCropEnabled] = React.useState(false);
  const [originalImage, setOriginalImage] = React.useState<string | null>(
    image,
  );
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const [notAllowed, setNotAllowed] = React.useState(false);
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const isItAllowed = (e: DragEvent) => {
    if (
      e.dataTransfer &&
      e.dataTransfer.items &&
      (e.dataTransfer.items.length > 1 ||
        !e.dataTransfer?.items[0]?.type.includes('image'))
    ) {
      return false;
    }
    return true;
  };

  React.useEffect(() => {
    // drag and drop image to uploadImageContainer inside imageUploadPreview div
    const imageTab = document.getElementById('imageTab');
    const uploadImageContainer = imageTab?.querySelector(
      '.uploadImageContainer',
    );

    if (imageTab && uploadImageContainer) {
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (!isItAllowed(e)) {
          setNotAllowed(true);
          return;
        }
        if (e.dataTransfer?.types.includes('Files')) {
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
        if (!isItAllowed(e)) return;
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
          const {files} = e.dataTransfer;
          const file = files[0];
          if (file) {
            // get image in base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
              if (reader.result && typeof reader.result === 'string') {
                setImage(reader.result);
                setOriginalImage(reader.result);
              }
            });
          }
        }
        setNotAllowed(false);
        uploadImageContainer.classList.remove('active');
      };

      imageTab.addEventListener('dragover', onDragOver);
      imageTab.addEventListener('dragleave', onDragLeave);
      imageTab.addEventListener('drop', onDropOutside);
      (uploadImageContainer as HTMLElement)?.addEventListener('drop', onDrop);

      return () => {
        imageTab.removeEventListener('dragover', onDragOver);
        imageTab.removeEventListener('dragleave', onDragLeave);
        imageTab.removeEventListener('drop', onDropOutside);
        (uploadImageContainer as HTMLElement)?.removeEventListener(
          'drop',
          onDrop,
        );
      };
    }

    return () => {};
  }, []);

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== 'undefined') {
      setImage(
        cropperRef.current?.cropper
          .getCroppedCanvas({
            imageSmoothingEnabled: false,
          })
          .toDataURL(),
      );
    }
  };

  return (
    <>
      <div className="imageUploadContainer noSwiping">
        <input hidden name="image" required value={image || undefined} />
        <input
          ref={uploadInputRef}
          type="file"
          name="imageUpload"
          id="imageUpload"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                if (reader.result && typeof reader.result === 'string') {
                  setImage(reader.result);
                  setOriginalImage(reader.result);
                }
              });
              if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
            }
          }}
        />
        <div className="imageUploadPreviewContainer">
          <div className={`imageUploadPreview ${image ? ' image' : ' upload'}`}>
            <div className="cropImageContainer">
              {cropEnabled ? (
                <Cropper
                  background={false}
                  guides
                  ref={cropperRef}
                  style={{height: '100%', width: '100%'}}
                  zoomTo={0}
                  aspectRatio={aspect}
                  src={image || undefined}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  responsive
                  autoCropArea={0.8}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                />
              ) : (
                <img src={image || undefined} alt="upload" />
              )}
            </div>
            <NoStyleButton
              onClick={() => {
                if (uploadInputRef.current) uploadInputRef.current.click();
              }}
              className="uploadButton"
            >
              <MemoTapHere />
              <Description>Tap here to upload image</Description>
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
          <div className="imageUploadActionContainer">
            <IconButton
              disabled={image === null}
              onClick={() => setImage(originalImage)}
              icon={<MemoReset />}
              data-tooltip-id="resetImageUpload"
              data-tooltip-content="Reset Image"
            />
            <Divider />
            <IconButton
              disabled={image === null}
              icon={<MemoCrop />}
              onClick={() => {
                getCropData();
                setCropEnabled(false);
              }}
              data-tooltip-id="cropImageUpload"
              data-tooltip-content="Crop Image"
            />
            <Divider />
            <IconButton
              disabled={image === null}
              className={cropEnabled ? 'active' : ''}
              onClick={() => setCropEnabled(!cropEnabled)}
              icon={<MemoResize />}
              data-tooltip-id="resizeImageUpload"
              data-tooltip-content="Resize Image"
            />
          </div>
        </div>
      </div>
      <div className="errorContainer image">
        <p className="error">Image is required.</p>
      </div>
    </>
  );
}
