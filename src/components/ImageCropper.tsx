import React, { useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from './ui/button';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: Blob) => void;
  aspect: number; // ex: 16 / 9
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, aspect }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleCrop = () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/png');
  };

  return (
    <div className="space-y-4">
      <ReactCrop
        crop={crop}
        onChange={c => setCrop(c)}
        onComplete={c => setCompletedCrop(c)}
        aspect={aspect}
      >
        <img ref={imgRef} src={imageSrc} style={{ maxHeight: '70vh' }} />
      </ReactCrop>
      <Button onClick={handleCrop}>Salvar Enquadramento</Button>
    </div>
  );
};

export default ImageCropper;
