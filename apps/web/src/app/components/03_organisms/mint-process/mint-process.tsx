"use client";
import classNames from "classnames";
import { EscrowStep } from "./escrow-step";
import { MintStep, useMint } from "../../05_providers/mint-provider";
import { GenerateStep } from "./generate-step";
import { CompleteStep } from "./complete-step";
import { useCallback } from "react";

type MintProcessProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * MintProcess is a component that handles the multi-step minting process.
 * It manages the flow between escrow, generation, and completion steps.
 * 
 * @component
 * @param {MintProcessProps} props - Component props
 * @param {string} [props.className] - Optional CSS class name for styling
 * @returns {JSX.Element} A container div with the current step component based on mintStep state
 */
export const MintProcess: React.FunctionComponent<MintProcessProps> = ({
  className,
}) => {
  const rootClasses = classNames({
    [`${className}`]: className,
    'relative':true
  });

  const { mintStep, setMintStep, openMintDialog,refreshMinted } = useMint();

  const onProcessComplete = useCallback(() => {
    openMintDialog();
    refreshMinted()
  },[openMintDialog,refreshMinted])

  
  return (
    <div className={`${rootClasses}`}>
      
      {mintStep == MintStep.ESCROW && <EscrowStep onStepComplete={()=>{setMintStep(MintStep.GENERATE)}}></EscrowStep>}
      {mintStep == MintStep.GENERATE && <GenerateStep onStepComplete={()=>{setMintStep(MintStep.DONE)}}></GenerateStep>}
      {mintStep == MintStep.DONE && <CompleteStep onStepComplete={()=>{onProcessComplete()}}></CompleteStep>}
      
    </div>
  );
};
