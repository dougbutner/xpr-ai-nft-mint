import {fetchAssets} from "@/services/atomicassets";
import {IAsset} from "atomicassets/build/API/Explorer/Objects";
import {MintedList} from "./components/04_biomes/minted-list";

export const dynamic = "force-dynamic";

async function getAssets(): Promise<IAsset[]> {
  return fetchAssets();
}

export default async function Home() {
  const assets = await getAssets();

  return (
    <>
      <MintedList assets={assets}></MintedList>
    </>
  );
}
