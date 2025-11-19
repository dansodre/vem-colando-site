import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBanners } from '@/services/siteApi';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { type UseEmblaCarouselType } from 'embla-carousel-react';

const HeroCarousel = () => {
  const { data: banners, isLoading } = useQuery({ queryKey: ['banners'], queryFn: getBanners });
  const [emblaApi, setEmblaApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  if (isLoading) return <div>Carregando...</div>; // Ou um skeleton
  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full">
      <Carousel 
        setApi={setEmblaApi}
        className="w-full" 
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <Link to={banner.button_link || '#'}>
                <div className="w-full h-[50vh] max-h-[400px] bg-gray-200">
                  <picture className="w-full h-full">
                    {banner.image_url_mobile && <source media="(max-width: 768px)" srcSet={banner.image_url_mobile} />}
                    <img 
                      src={banner.image_url_desktop} 
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/20 hover:bg-black/50" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-black/20 hover:bg-black/50" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-all ${index === selectedIndex ? 'w-4 bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
