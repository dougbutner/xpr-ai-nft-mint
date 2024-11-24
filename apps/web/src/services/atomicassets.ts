import { IAsset } from "atomicassets/build/API/Explorer/Objects";

export async function fetchAssets(page:number=1): Promise<IAsset[]>{
  
  return await fetch(`${process.env.NEXT_PUBLIC_XPR_AA_ENDPOINT!}/atomicassets/v1/assets?collection_name=${process.env.NEXT_PUBLIC_COLLECTION_NAME}&limit=25&page=${page}`,).then((res)=>res.json()).then(res=>res.data)

}