import type { Metadata } from "next";
import {XPRNProvider} from 'xprnkit'
import './globals.css'
import "keen-slider/keen-slider.min.css"
import { AppHeader } from "./components/03_organisms/app-header/app-header";
import { MintProvider } from "./components/05_providers/mint-provider";
import { JsonRpc } from "@proton/js";
import { Tables } from "@/interfaces/xprpals";
export const metadata: Metadata = {
  title: "MintMe",
  description: "AI NFT generation experience on XPRNetwork ",
};
const rpc = new JsonRpc(process.env.NEXT_PUBLIC_XPR_ENDPOINT!.split(','));


async function getConfig():Promise<Tables<'ConfigTable'> | null> {

  const table = await rpc.get_table_rows({
    json: true,
    reverse: true,
    code:process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
    scope: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
    table: "config",
    limit:1
  })

  if (!table || !table.rows) return null;
  if (table.rows.length === 0) return null;
  const castedRows = table.rows as Tables<'ConfigTable'>[];
  
  return castedRows[0];
  
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const config = await getConfig();

  return (
    <html lang="en">
      <body className="relative">
        {config && 
          <XPRNProvider config={{
            endpoints: process.env.NEXT_PUBLIC_XPR_ENDPOINT!.split(','),
            chainId: process.env.NEXT_PUBLIC_XPR_CHAIN_ID!,
            requesterAccount: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT!,
            apiMode: process.env.NEXT_PUBLIC_API_MODE! as 'testnet' | 'mainnet',
            dAppName:process.env.NEXT_PUBLIC_DAPP_NAME!
          }}>
            
              <MintProvider config={config}>
            <AppHeader></AppHeader>
            <div >
                {children}
  
            </div>
              </MintProvider>
          </XPRNProvider>
        }
        { !config && <p>Error: missing config</p>}
        
      </body>
    </html>
  );
}
