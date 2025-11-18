import React, { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  loupeSize?: number;
  zoomScale?: number;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ 
  src, 
  alt, 
  loupeSize = 150, 
  zoomScale = 2.5 
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });
  };

  const loupeX = mousePosition.x - loupeSize / 2;
  const loupeY = mousePosition.y - loupeSize / 2;
  const bgX = -mousePosition.x * zoomScale + loupeSize / 2;
  const bgY = -mousePosition.y * zoomScale + loupeSize / 2;

  return (
    <div
      className="relative w-full h-full cursor-none"
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-auto max-h-[500px] object-contain"
      />

      {showZoom && (
        <div
          className="absolute rounded-full border-2 border-primary bg-no-repeat pointer-events-none"
          style={{
            height: `${loupeSize}px`,
            width: `${loupeSize}px`,
            top: `${loupeY}px`,
            left: `${loupeX}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${imageRef.current ? imageRef.current.width * zoomScale : 0}px ${imageRef.current ? imageRef.current.height * zoomScale : 0}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;

