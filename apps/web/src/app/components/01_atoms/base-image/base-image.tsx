"use client";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GenerationLoader } from "../../02_molecules/generation-loader/generation-loader";

type BaseImageProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string;
  alt?: string;
};

type ImageLoadStatus = "idle" | "loading" | "loaded" | "error" | "empty";

/**
 * A base image component that handles different loading states and displays appropriate UI feedback.
 * 
 * @component
 * @param {object} props - Component props
 * @param {string} [props.className] - Additional CSS classes to apply to the container
 * @param {string} [props.src] - Source URL of the image
 * @param {string} [props.alt] - Alternative text for the image
 * 
 * @returns {React.ReactElement} A div containing the image with loading states
 * 
 * @example
 * <BaseImage
 *   src="https://example.com/image.jpg"
 *   alt="Example image"
 *   className="my-custom-class"
 * />
 */
export const BaseImage: React.FunctionComponent<BaseImageProps> = ({
  className,
  src,
  alt,
}) => {
  const [loadingStatus, setLoadingStatus] = useState<ImageLoadStatus>("idle");

  const rootClasses = classNames({
    [`${className}`]: className,
    relative: true,
  });

  const imageClasses = classNames({
    hidden: loadingStatus !== "loaded",
  });

  useEffect(() => {
    if (!src) {
      setLoadingStatus("empty");
    } else {
      setLoadingStatus("loading");
    }
  }, [src]);

  return (
    <div className={`${rootClasses}`}>
      <div className="relative border border-gray-500 aspect-square">
        {loadingStatus === "loading" && (
          <div className="relative w-full aspect-square bg-gray-200 flex justify-center items-center overflow-hidden">
            <GenerationLoader />
          </div>
        )}
        {loadingStatus === "error" && (
          <div className="relative w-full aspect-square bg-gray-200 flex justify-center items-center overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-meh stroke-gray-300 w-48 h-18 stroke-[5px]"
            >
              <path d="M37.02,87.36v-7.28h-5.9c-9.01,0-16.31-7.3-16.31-16.31v-23.77c0-18.2,14.76-32.96,32.96-32.96h4.48c18.2,0,32.96,14.76,32.96,32.96v23.77c0,9.01-7.3,16.31-16.31,16.31h-4.7v7.28s-.02,1.75-.02,1.75c0,2.13-1.72,3.85-3.85,3.85-1.36,0-2.56-.71-3.24-1.78-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78-2.13,0-3.85-1.72-3.85-3.85v-1.75Z" />
              <line x1="40.92" y1="52.39" x2="30.32" y2="62.98" />
              <line x1="40.92" y1="62.98" x2="30.32" y2="52.39" />
              <line x1="69.68" y1="52.39" x2="59.08" y2="62.98" />
              <line x1="69.68" y1="62.98" x2="59.08" y2="52.39" />
            </svg>
          </div>
        )}
        {loadingStatus === "empty" && (
          <div className="relative aspect-square bg-gray-200 flex justify-center items-center overflow-hidden">
            <div className="border-2 border-gray-300 w-[142.5%] absolute rotate-45"></div>
          </div>
        )}
        {src && loadingStatus !== "error" && (
          <Image
            alt={alt || ""}
            className={`aspect-square w-full ${imageClasses}`}
            src={src}
            onError={() => setLoadingStatus("error")}
            onLoad={() => setLoadingStatus("loaded")}
            loading="eager"
            width={640}
            height={640}
          />
        )}
      </div>
    </div>
  );
};
