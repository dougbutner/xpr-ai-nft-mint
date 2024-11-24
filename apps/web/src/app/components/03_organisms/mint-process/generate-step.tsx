"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMint } from '../../05_providers/mint-provider';
import { BaseImage } from '../../01_atoms/base-image/base-image';
import { HashCarousel, HashCarouselHandle } from '../hash-carousel/hash-carousel';
import { AsyncButton } from '../../01_atoms/async-button/async-button';
import { wait } from '@/utils/wait';
import { GenerationLoader } from '../../02_molecules/generation-loader/generation-loader';
type GenerateStepProps = React.HTMLAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement> & {
  onStepComplete: () => void;
};
export const GenerateStep: React.FunctionComponent<GenerateStepProps> = ({
  onStepComplete,
}) => { 

  const {generateImage,activeTicket,generationProcess,mintSelected,mintConfig} = useMint()
  const hasGenerated = useRef(false);
  const hasGenerationUpdate = useRef(false);
  const carouselRef = useRef<HashCarouselHandle>(null)
  const [selectedHash,setSelectedHash] = useState<number>()

  const runGeneration = useCallback(() => {
    generateImage().then(() => {
      if (carouselRef.current) {
        hasGenerationUpdate.current = true
        
      }
    })
  }, [generateImage])

  const mintImage = useCallback(() => {
    
    if (selectedHash==undefined) return;
    mintSelected(selectedHash).then(() => {
      onStepComplete();
    })
  },[mintSelected,selectedHash,onStepComplete])
  
  

  const generationButton = useMemo(() => {
    if (!activeTicket) return <></>;
    if (activeTicket.generatedHash.length >= mintConfig.config.generationLimit) { 
      return <div className="p-2 absolute bottom-2  right-2 bg-black text-white">Limit reached ({activeTicket.generatedHash.length}/{ mintConfig.config.generationLimit})</div>
    }
    switch (generationProcess) {
      case "idle":
        if (!activeTicket.generatedHash || activeTicket.generatedHash.length == 0) return <button className="p-2 absolute bottom-2  right-2 bg-black text-white" onClick={() => runGeneration()}>Generate an image 0/{ mintConfig.config.generationLimit}</button>
        return <button className="p-2 absolute bottom-2  right-2 bg-black text-white" onClick={() => runGeneration()}>Generate another one {activeTicket.generatedHash?.length}/{ mintConfig.config.generationLimit}</button>
      case "generating":
        return <div className="p-2 absolute bottom-2  right-2 bg-black text-white">Generating image</div>
        case "block":
          return <div className="p-2 absolute bottom-2  right-2 bg-black text-white">Get block</div>
      case "refreshing":
        return <div className="p-2 absolute bottom-2  right-2 bg-black text-white">Refreshing images</div>
      default:
        if (!activeTicket.generatedHash || activeTicket.generatedHash.length == 0) return <button className="p-2 absolute bottom-2  right-2 bg-black text-white" onClick={() => runGeneration()}>Generate an image 0/3</button>
        return <button disabled={activeTicket.generatedHash?.length >= mintConfig.config.generationLimit} className="p-2 absolute bottom-2  right-2 bg-black text-white" onClick={() => runGeneration()}>Generate another one {activeTicket.generatedHash?.length}/{ mintConfig.config.generationLimit}</button>
        
    }
  }, [activeTicket, generationProcess, runGeneration,mintConfig]) 

  useEffect(() => {
    if (hasGenerated.current) {
      wait(100).then(() => {
        if (carouselRef.current) {
          carouselRef.current.goToEnd();
          hasGenerationUpdate.current = false;
        }
      })
    }
  },[activeTicket])
  

  useEffect(() => {
    if (hasGenerated.current) return;
    if (activeTicket) { 
      if (activeTicket.generatedHash.length === 0) {
        hasGenerated.current = true
        generateImage()
      }
    } {
      hasGenerated.current = true
    }
  },[activeTicket,generateImage])

  return <div className="max-w-[480px] flex flex-col gap-4 container relative">
    <div className='relative'>
      {generationProcess !== 'idle' && <div className='absolute bg-opacity-70 left-0 top-0 right-0 bottom-0 z-10 bg-white flex justify-center items-center' >
        <GenerationLoader className=''></GenerationLoader>
      </div>}
    {activeTicket && activeTicket.generatedHash.length === 0 && <div className='relative'><BaseImage className='max-w-[480px]'></BaseImage>{ generationButton}</div>}
    {activeTicket && activeTicket.generatedHash.length > 0 && <div  className='relative'><HashCarousel ref={carouselRef}  hashes={activeTicket.generatedHash} onSelectedHashChange={(index) => setSelectedHash(index)}></HashCarousel>{ generationButton}</div>}
    </div>
    <AsyncButton disable={generationProcess!== 'idle'} processing={generationProcess!== 'idle'} processingLabel='Generating' onClick={()=>mintImage()}>Mint this one </AsyncButton>
  </div>
}