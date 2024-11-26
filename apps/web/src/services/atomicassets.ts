import { IAsset } from "atomicassets/build/API/Explorer/Objects";

/**
 * Fetches atomic assets from the specified endpoint with pagination
 * @param {number} page - The page number to fetch (defaults to 1)
 * @returns {Promise<IAsset[]>} A promise that resolves to an array of atomic assets
 * @throws {Error} If the fetch request fails or returns invalid data
 * @description Makes a GET request to the AtomicAssets API endpoint to retrieve assets
 * for the configured collection name. Returns 25 items per page.
 */
export async function fetchAssets(page:number=1): Promise<IAsset[]>{
  
  return await fetch(`${process.env.NEXT_PUBLIC_XPR_AA_ENDPOINT!}/atomicassets/v1/assets?collection_name=${process.env.NEXT_PUBLIC_COLLECTION_NAME}&limit=25&page=${page}`,).then((res)=>res.json()).then(res=>res.data)

}