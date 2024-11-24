"use client";
import classNames from "classnames";
type GenerationLoaderProps = React.HTMLAttributes<HTMLDivElement> & {};
export const GenerationLoader: React.FunctionComponent<
  GenerationLoaderProps
> = ({ className }) => {
  const rootClasses = classNames({
    "lucide lucide-meh w-20 h-20":true,
    [`${className}`]: className,
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={rootClasses}
    >
      
      <path className="fill-black" d="M37.02,87.36v-7.28h-5.9c-9.01,0-16.31-7.3-16.31-16.31v-23.77c0-18.2,14.76-32.96,32.96-32.96h4.48c18.2,0,32.96,14.76,32.96,32.96v23.77c0,9.01-7.3,16.31-16.31,16.31h-4.7v7.28s-.02,1.75-.02,1.75c0,2.13-1.72,3.85-3.85,3.85-1.36,0-2.56-.71-3.24-1.78-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78-2.13,0-3.85-1.72-3.85-3.85v-1.75Z" />
      <rect
        className="fill-white"
        x="30.32"
        y="52.39"
        width="39.37"
        height="10.6"
        rx="5.3"
        ry="5.3"
      />
      <rect width={10} height={10} x="35" y="52" className="fill-black stroke-none">
        <animate
          attributeName="x"
          values="15; 76; 15"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
};
