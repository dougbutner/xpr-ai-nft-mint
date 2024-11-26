"use client";

/**
 * Props for the CompleteStep component
 */
type CompleteStepProps = React.HTMLAttributes<HTMLDivElement> & {
  onStepComplete: () => void;
};

/**
 * CompleteStep component displays a success message after an NFT has been minted
 * and transferred to the user's wallet.
 * 
 * @component
 * @param {CompleteStepProps} props - The component props
 * @param {() => void} props.onStepComplete - Callback function triggered when the user clicks the close button
 * @returns {React.ReactElement} A component showing a success message and close button
 */
export const CompleteStep: React.FunctionComponent<CompleteStepProps> = ({
  onStepComplete,
}) => {
  // Transfer escrow logic

  return (
    <div className="max-w-[480px] flex flex-col gap-4 container">
      <div className="relative">
        <div className="h-[480px] flex flex-col justify-center items-center gap-4">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-12 h-12"
          >
            <path
              strokeMiterlimit="10"
              className="fill-black stroke-none"
              strokeWidth="7px"
              d="M37.02,87.36v-7.28h-5.9c-9.01,0-16.31-7.3-16.31-16.31v-23.77c0-18.2,14.76-32.96,32.96-32.96h4.48c18.2,0,32.96,14.76,32.96,32.96v23.77c0,9.01-7.3,16.31-16.31,16.31h-4.7v7.28s-.02,1.75-.02,1.75c0,2.13-1.72,3.85-3.85,3.85-1.36,0-2.56-.71-3.24-1.78-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78s-2.56-.71-3.24-1.78c-.68,1.07-1.88,1.78-3.24,1.78-2.13,0-3.85-1.72-3.85-3.85v-1.75Z"
            />
            <rect
            className='fill-white'
              x="28.46"
              y="49.5"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
            <rect
            className='fill-white'
              x="55.18"
              y="49.5"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
            <rect
            className='fill-white'
              x="41.82"
              y="29.97"
              width="16.36"
              height="16.36"
              rx="8.18"
              ry="8.18"
            />
          </svg>
          <span className="text-3xl text-center uppercase font-bold">
            Congratulation,
            <br /> your NFT was sent to your wallet.
          </span>
        </div>
      </div>
      <button
        className="bg-black p-4 text-white font-bold w-full"
        onClick={() => onStepComplete()}
      >
        Close
      </button>
    </div>
  );
};
