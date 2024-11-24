import {Tables} from "@/interfaces/xprpals";
import {JsonRpc} from "@proton/js";

export async function getActiveTickets(actorName: string): Promise<Tables<'TicketTable'>[]> {
  const rpc = new JsonRpc(process.env.NEXT_PUBLIC_XPR_ENDPOINT!.split(","));
  return await rpc
    .get_table_rows({
      reverse:true,
      json:true,
      code: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      scope: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      table: "tickets",
      index_position: 2,
      key_type:"name",
      lower_bound: actorName,
      
    })
    .then(res => {
      
      if (!res || !res.rows) return [];
      const rows = res.rows as Tables<'TicketTable'>[];
      return rows.filter((row)=>row.assetId == 0)
      

    }).catch(() => {
      return [];
    })
  
  
}
