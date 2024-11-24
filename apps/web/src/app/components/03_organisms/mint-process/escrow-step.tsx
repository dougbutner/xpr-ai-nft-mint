"use client";
import {AsyncButton} from "../../01_atoms/async-button/async-button";
import {useMint} from "../../05_providers/mint-provider";
import {useXPRN} from "xprnkit";
import {useEffect, useRef, useState} from "react";
import {eosio_token} from "@/interfaces/eosio.token";
import {wait} from "@/utils/wait";
import {getActiveTickets} from "@/services/get-active-tickets";

type EscrowStepProps = React.HTMLAttributes<HTMLDivElement> & {
  onStepComplete: () => void;
};

export const EscrowStep: React.FunctionComponent<EscrowStepProps> = ({
  onStepComplete,
}) => {
  const {setActiveTicket, verifyTicket, isVerifyingTicket,mintConfig} = useMint();
  const {session} = useXPRN();
  const hasVerified = useRef(false);
  const [isFetchingEscrowedTicket, setFetchingEscrowedTicket] = useState<boolean>();

  // Transfer escrow logic
  const transferEscrow = async () => {
    if (!session) return;

    const transferAction = eosio_token.transfer(
      [
        {
          actor: session.auth.actor.toString(),
          permission: session.auth.permission.toString(),
        },
      ],
      {
        from: session.auth.actor.toString(),
        to: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT!,
        quantity: mintConfig.config.tokenPrice,
        memo: "",
      }
    );

    try {
      await session.transact({actions: [transferAction]}, {broadcast: true});
      // After escrow transfer, verify tickets and complete the step
      setFetchingEscrowedTicket(true)
      await wait(3000);
      const tickets = await getActiveTickets(session.auth.actor.toString());
      if (tickets && tickets[0]) {
        setActiveTicket(tickets[0]);
        onStepComplete();
        setFetchingEscrowedTicket(false)
      }
    } catch (error) {
      console.error("Error during escrow transfer:", error);
    }
  };

  useEffect(() => {
    // This effect runs once when the component mounts or when `session` changes
    if (!session || hasVerified.current) return;
    hasVerified.current = true;
    
    verifyTicket().then(res => {
      if (res && res[0]) onStepComplete();
    });
    // Empty dependency array to ensure this effect only runs once on mount
  }, [session, verifyTicket, onStepComplete]);

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
          <span className="text-3xl text-center uppercase font-bold">Please,<br/> escrow {mintConfig.config.tokenPrice} before generate images</span>
        </div>
      </div>
      <AsyncButton
        processing={isVerifyingTicket || isFetchingEscrowedTicket}
        processingLabel={"Verify existed mint ticket"}
        onClick={transferEscrow}
      >
        Pay { mintConfig.config.tokenPrice} to generate
      </AsyncButton>
    </div>
  );
};
