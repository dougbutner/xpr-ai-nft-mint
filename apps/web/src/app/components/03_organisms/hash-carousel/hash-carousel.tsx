"use client";

import classNames from "classnames";
import { BaseImage } from "../../01_atoms/base-image/base-image";
import { useEffect, useImperativeHandle,  useState, forwardRef } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type HashCarouselProps = React.HTMLAttributes<HTMLDivElement> & { hashes?: (string | undefined)[],onSelectedHashChange:(index:number)=>void };

/**
 * Interface for controlling the HashCarousel component imperatively
 * @interface
 * @property {() => void} goToEnd - Scrolls the carousel to the last item
 */
export type HashCarouselHandle = {
  goToEnd: () => void;
};

/**
 * A carousel component that displays images from IPFS hashes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes to apply to the carousel
 * @param {(string | undefined)[]} [props.hashes] - Array of IPFS hashes for the images to display
 * @param {(index: number) => void} props.onSelectedHashChange - Callback function triggered when selected image changes
 * 
 * @example
 * ```tsx
 * const [selectedIndex, setSelectedIndex] = useState(0);
 * const carouselRef = useRef<HashCarouselHandle>(null);
 * 
 * <HashCarousel 
 *   ref={carouselRef}
 *   hashes={['hash1', 'hash2']}
 *   onSelectedHashChange={setSelectedIndex}
 * />
 * ```
 */
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
