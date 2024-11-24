"use client";
import {
  createContext,
  useCallback,
  useContext,
  FunctionComponent,
  ReactNode,
  useMemo,
  useState,
} from "react";
import { useXPRN} from "xprnkit";
import {MintProcess} from "../03_organisms/mint-process/mint-process";
import {getActiveTickets} from "@/services/get-active-tickets";
import {Tables, xprpals} from "@/interfaces/xprpals";
import {generateNewImage} from "@/services/generate-image";
import {TransactResult} from "@/interfaces/xprnetwork";
import {wait} from "@/utils/wait";
import {getTicket} from "@/services/get-ticket";
import {IAsset} from "atomicassets/build/API/Explorer/Objects";
import {fetchAssets} from "@/services/atomicassets";

type MintProviderProps = {
  children: React.ReactNode | React.ReactNode[];
  config: Tables<"ConfigTable">;
};

export enum MintStep {
  CONNECT,
  ESCROW,
  GENERATE,
  MINT,
  DONE,
}

type MintProviderContextType = {
  activeTicket?: Tables<"TicketTable">;
  mintStep?: MintStep;
  isVerifyingTicket?: boolean;
  generationProcess: GenerationProcessStep;
  minted?: IAsset[];
  mintConfig: Tables<"ConfigTable">;
  refreshMinted: () => void;
  setMinted: (minted: IAsset[]) => void;
  setMintStep: (step: MintStep) => void;
  setActiveTicket: (activeTicket: Tables<"TicketTable">) => void;
  verifyTicket: () => Promise<Tables<"TicketTable">[]>;
  generateImage: () => Promise<TransactResult | null>;
  mintSelected: (selectedHashIndex: number) => Promise<TransactResult | null>;
  openMintDialog: () => void;
};

const MintProviderContext = createContext<MintProviderContextType>({
  activeTicket: undefined,
  mintStep: undefined,
  isVerifyingTicket: false,
  generationProcess: "idle",
  minted: [],
  mintConfig: {
    key: 0,
    config: {
      collectionName: "xprpalsrocks",
      tokenPrice: "1000.0000 XPR",
      generationLimit: 0,
      transferAccount: "",
    },
  },
  setMinted: (minted: IAsset[]) => {
    console.log(minted);
  },
  refreshMinted: () => {},
  setMintStep: (step: MintStep) => {
    console.log(step);
  },
  setActiveTicket: (activeTicket: Tables<"TicketTable">) => {
    console.log(activeTicket);
  },
  verifyTicket: () =>
    new Promise<Tables<"TicketTable">[]>(resolve => resolve([])),
  generateImage: () => new Promise(resolve => resolve(null)),
  mintSelected: (selectedHashIndex: number) => {
    console.log(selectedHashIndex);
    return new Promise(resolve => resolve(null));
  },
  openMintDialog: () => {},
});

export type GenerationProcessStep =
  | "idle"
  | "generating"
  | "block"
  | "refreshing";

export const MintProvider: React.FunctionComponent<MintProviderProps> = ({
  children,
  config,
}) => {
  const {session, connect} = useXPRN();
  const [minted, setMinted] = useState<IAsset[]>();
  const [isVerifyingTicket, setVerifyingTicket] = useState<boolean>();
  const [openMintProcess, setOpenMintProcess] = useState<boolean>(false);
  const [currentMintStep, setMintStep] = useState<MintStep>();
  const [activeTicket, setActiveTicket] = useState<Tables<"TicketTable">>();
  const [generationProcess, setGenerationProcess] =
    useState<GenerationProcessStep>("idle");

  const mintConfig = useMemo(() => {
    return config;
  }, [config]);

  const openMintDialog = useCallback(() => {
    setMintStep(MintStep.ESCROW);

    setOpenMintProcess(!openMintProcess);
  }, [openMintProcess, setOpenMintProcess, setMintStep]);

  const onConnect = useCallback(() => {
    connect(false, false, session => {
      if (session) {
        console.log("open this dialog");
        openMintDialog();
      }
    });
  }, [connect, openMintDialog]);

  const verifyTicket = useCallback(async (): Promise<
    Tables<"TicketTable">[]
  > => {
    if (!session) return [];
    setVerifyingTicket(true);
    try {
      await wait(3000); // Simulated delay
      const tickets = await getActiveTickets(session.auth.actor.toString());
      if (tickets && tickets[0]) {
        setActiveTicket(tickets[0]);
        return tickets;
      }
    } catch (error) {
      console.error("Error verifying tickets:", error);
      return [];
    } finally {
      setVerifyingTicket(false);
    }
    return [];
  }, [session]);

  const generateImage =
    useCallback(async (): Promise<TransactResult | null> => {
      if (!activeTicket) return new Promise(resolve => resolve(null));
      if (!session) return new Promise(resolve => resolve(null));
      setGenerationProcess("generating");
      const imageGeneration = await generateNewImage(
        session.auth.actor.toString(),
        activeTicket.key
      );
      setGenerationProcess("block");
      await wait(3000);
      setGenerationProcess("refreshing");
      const ticket = await getTicket(activeTicket.key);
      if (!ticket) return null;
      setActiveTicket(ticket);
      setGenerationProcess("idle");
      return imageGeneration;
    }, [activeTicket, session]);

  const mintSelected = useCallback(
    async (selectedHashIndex: number): Promise<TransactResult | null> => {
      if (!activeTicket) return new Promise(resolve => resolve(null));
      if (!session) return new Promise(resolve => resolve(null));
      const mintAction = xprpals.ticket_mint(
        [
          {
            actor: session.auth.actor.toString(),
            permission: session.auth.permission.toString(),
          },
        ],
        {
          account: session.auth.actor.toString(),
          mintTicketKey: activeTicket.key,
          hashIndex: selectedHashIndex,
        }
      );
      return session.transact(
        {actions: [mintAction]},
        {broadcast: true}
      ) as TransactResult;
    },
    [activeTicket, session]
  );


  const refreshMinted = useCallback(() => {
    fetchAssets().then(res => setMinted(res));
  }, []);



  const providerValue = useMemo(
    () => ({
      verifyTicket,
      generateImage,
      setMintStep,
      mintSelected,
      openMintDialog,
      setActiveTicket,
      refreshMinted,
      isVerifyingTicket,
      generationProcess,
      mintStep: currentMintStep,
      activeTicket,
      minted,
      mintConfig,
      setMinted,
    }),
    [
      verifyTicket,
      generateImage,
      mintSelected,
      openMintDialog,
      setMinted,
      refreshMinted,
      mintConfig,
      minted,
      isVerifyingTicket,
      generationProcess,
      currentMintStep,
      activeTicket,
    ]
  );

  return (
    <MintProviderContext.Provider value={providerValue}>
      {children}
      {minted && (
        <div className="sticky bottom-0 max-w-[640px] container bg-white p-2">
          {!session ? (
            <button
              className="bg-black p-4 text-white font-bold w-full"
              onClick={() => onConnect()}
            >
              Connect to mint
            </button>
          ) : (
            <>
              <button
                className="w-full bg-black p-4 text-white"
                onClick={() => openMintDialog()}
              >
                Mint mine
              </button>
              <Modal
                isOpen={openMintProcess}
                onClose={() => setOpenMintProcess(false)}
              >
                <MintProcess />
              </Modal>
            </>
          )}
        </div>
      )}
    </MintProviderContext.Provider>
  );
};

export function useMint(): MintProviderContextType {
  const context = useContext(MintProviderContext);
  if (!context) {
    throw new Error("useMint must be used within a MintProvider");
  }
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenChange?: () => void;
  children: ReactNode;
}

const Modal: FunctionComponent<ModalProps> = ({isOpen, onClose, children}) => {
  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="modal-content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 w-[480px]"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-x w-8 h-8"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
