"use client";

import classNames from "classnames";
import { BaseImage } from "../../01_atoms/base-image/base-image";
import { useEffect, useImperativeHandle,  useState, forwardRef } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type HashCarouselProps = React.HTMLAttributes<HTMLDivElement> & { hashes?: (string | undefined)[],onSelectedHashChange:(index:number)=>void };

// Imperative handler type for the parent to control the carousel
export type HashCarouselHandle = {
  goToEnd: () => void;
};

export const HashCarousel = forwardRef<HashCarouselHandle, HashCarouselProps>(
  ({ className, hashes,onSelectedHashChange }, ref) => {
    const rootClasses = classNames({
      [`${className}`]: className,
    });

    const [api, setApi] = useState<CarouselApi>();

    // Expose imperative methods to the parent component
    useImperativeHandle(ref, () => ({
      goToEnd: () => {
        if (api) {
          
          if (hashes) {
            api.scrollTo(hashes.length);
            onSelectedHashChange(hashes.length-1)
          }
          
        }
      },
    }), [api,hashes,onSelectedHashChange]);

    useEffect(() => {
      if (api) {
        
        api.on("select", (carouselApi: CarouselApi) => {
          if (!carouselApi) return 
          onSelectedHashChange(carouselApi.selectedScrollSnap())
          
        });
      }
    }, [api,onSelectedHashChange]);

    return (
      <div className={rootClasses}>
        <Carousel setApi={setApi}>
          <CarouselContent>
            {hashes && hashes.map((hash, index) => (
              <CarouselItem key={index}>
                <BaseImage
                  className="w-full"
                  src={`${process.env.NEXT_PUBLIC_IPFS_ENDPOINT}/${hash}`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2" />
          <CarouselNext className="absolute right-2" />
        </Carousel>
      </div>
    );
  }
);

HashCarousel.displayName = "HashCarousel"; // Required for forwardRef components
