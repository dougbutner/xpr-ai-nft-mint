import {Tables} from "@/interfaces/xprpals";
import {JsonRpc} from "@proton/js";

export async function getTicket(ticketKey: number): Promise<Tables<'TicketTable'> | null> {
  const rpc = new JsonRpc(process.env.NEXT_PUBLIC_XPR_ENDPOINT!.split(","));
  return await rpc
    .get_table_rows({
      reverse:true,
      json:true,
      code: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      scope: process.env.NEXT_PUBLIC_REQUESTER_ACCOUNT,
      table: "tickets",
      limit:1,
      upper_bound: ticketKey,
      
    })
    .then(res => {
      
      if (!res || !res.rows) return null;
      const rows = res.rows as Tables<'TicketTable'>[];
      if (!rows || !rows[0]) return null;
      return rows[0]
      

    }).catch(() => {
      return null;
    })
  
  
}
