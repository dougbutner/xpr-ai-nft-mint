"use client";
import classNames from "classnames";
type AsyncButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  disable?: boolean;
  processing?: boolean;
  processingLabel: string;
  error?: boolean;
  success?: boolean;
};
export const AsyncButton: React.FunctionComponent<AsyncButtonProps> = ({
  children,
  className,
  disable,
  processing,
  processingLabel,
  ...rest
}) => {
  const rootClasses = classNames({
    [`${className}`]: className,
    "pointer-events-none": processing,
  });
  return (
    <div className={`${rootClasses}`}>
      {processing && <div className="flex justify-center items-center bg-black p-4 text-white font-bold w-full text-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-circle animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        {processingLabel}
      </div>}
      {!processing && <button disabled={disable} {...rest} className="bg-black p-4 text-white font-bold w-full">
        {children}
      </button>}
    </div>
  );
};
