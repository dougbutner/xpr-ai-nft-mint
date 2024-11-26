"use client";
import classNames from "classnames";

/**
 * AsyncButton props interface extending standard HTML button attributes
 */
type AsyncButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  /** Flag to disable the button */
  disable?: boolean;
  /** Flag to show processing state */
  processing?: boolean;
  /** Text to display while button is in processing state */
  processingLabel: string;
  /** Flag to show error state */
  error?: boolean;
  /** Flag to show success state */
  success?: boolean;
};

/**
 * AsyncButton component that handles loading/processing states
 * 
 * @component
 * @example
 * ```tsx
 * <AsyncButton
 *   processing={isLoading}
 *   processingLabel="Saving..."
 *   onClick={handleClick}
 * >
 *   Save Changes
 * </AsyncButton>
 * ```
 * 
 * @param props - Component props
 * @param props.children - Button content when not in processing state
 * @param props.className - Additional CSS classes
 * @param props.disable - Whether the button should be disabled
 * @param props.processing - Whether to show processing state
 * @param props.processingLabel - Text to show during processing state
 */
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
