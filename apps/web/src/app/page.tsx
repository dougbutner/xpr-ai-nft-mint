import {fetchAssets} from "@/services/atomicassets";
import {IAsset} from "atomicassets/build/API/Explorer/Objects";
import {MintedList} from "./components/04_biomes/minted-list";

export const dynamic = "force-dynamic";

/**
 * Fetches NFT assets from the AtomicAssets API
 * @returns {Promise<IAsset[]>} Promise that resolves to an array of NFT assets
 */
async function getAssets(): Promise<IAsset[]> {
  return fetchAssets();
}

/**
 * Home page component that displays a list of minted NFT assets
 * @returns {Promise<JSX.Element>} Rendered component with MintedList
 */
export default async function Home() {
  const assets = await getAssets();

  return (
    <>
      <MintedList assets={assets}></MintedList>
    </>
  );
}
