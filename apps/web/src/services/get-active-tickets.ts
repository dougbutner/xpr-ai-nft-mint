import {Tables} from "@/interfaces/xprpals";
import {JsonRpc} from "@proton/js";

/**
 * Retrieves active tickets for a specified actor from the blockchain.
 * 
 * @param actorName - The name of the actor whose tickets should be retrieved
 * @returns Promise containing an array of active tickets (TicketTable entries)
 * @throws {Error} Silently catches and returns empty array on RPC errors
 * 
 * @example
 * const tickets = await getActiveTickets("user123");
 */
export async function getActiveTickets(actorName: string): Promise<Tables<'TicketTable'>[]> {
  const rpc = new JsonRpc(process.env.NEXT_PUBLIC_XPR_ENDPOINT!.split(","));
  return await rpc
    .get_table_rows({
      json:true,
      code: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      scope: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      table: "tickets",
      index_position: 2,
      key_type:"name",
      lower_bound:actorName,
      
    })
    .then(res => {
      
      if (!res || !res.rows) return [];
      const rows = res.rows as Tables<'TicketTable'>[];
      return rows.filter((row)=>row.assetId == 0)
      

    }).catch(() => {
      return [];
    })
  
  
}
