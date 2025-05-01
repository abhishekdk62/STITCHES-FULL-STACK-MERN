import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

const getCroppedImg = (imageSrc, croppedAreaPixels) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const outputWidth = 309;
      const outputHeight = 400;
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputWidth,
        outputHeight
      );
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Canvas is empty'));
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = () => reject(new Error('Image load failed'));
  });

const CropModal = ({ imageSrc, onCrop, onClose, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCrop(croppedBlob);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 flex z-50 items-center justify-center bg-black/40 bg-opacity-50">
      <div className="bg-white p-4">
        {/* Container with fixed size */}
        <div className="relative w-[309px] h-[400px]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid={false}
            style={{
              containerStyle: {
                width: '309px',

                height: '400px',
              },
              cropAreaStyle: {
                border: '2px dashed #fff',
                background: 'rgba(0, 0, 0, 0.5)',
                width: '309px',
                height: '400px',
              },
            }}
          />
        </div>
        <div className="mt-2 flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCrop}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Crop
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
