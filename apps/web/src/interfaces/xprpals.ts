type xprpals_Actions = {
  "gov.chcfg": {
    config:{
  collectionName:string;
tokenPrice:string;
generationLimit:number;
transferAccount:string  
}
  },
  "ticket.adgen": {
    account:string;
    mintTicketKey:number;
    hash:string
  },
  "ticket.mint": {
    account:string;
    mintTicketKey:number;
    hashIndex:number
  }
}

export const xprpals = {
  gov_chcfg:(authorization:Authorization[],data:xprpals_Actions['gov.chcfg']):XPRAction<'gov.chcfg'>=>({
	account:'mintme',
	name:'gov.chcfg',
	authorization,
data}),
 ticket_adgen:(authorization:Authorization[],data:xprpals_Actions['ticket.adgen']):XPRAction<'ticket.adgen'>=>({
	account:'mintme',
	name:'ticket.adgen',
	authorization,
data}),
 ticket_mint:(authorization:Authorization[],data:xprpals_Actions['ticket.mint']):XPRAction<'ticket.mint'>=>({
	account:'mintme',
	name:'ticket.mint',
	authorization,
data}) 
} 
type xprpals_Tables = {
  "ConfigTable": {
    key:number;
    config:{
  collectionName:string;
tokenPrice:string;
generationLimit:number;
transferAccount:string  
}
  },
  "LogTable": {
    key:number;
    message:string
  },
  "TicketTable": {
    key:number;
    account:string;
    generatedHash:string[];
    templateId:number;
    assetId:number
  }
}


    export type Authorization = {
      actor: string;
      permission: "active"|"owner"|string;
  }

    export type XPRAction<A extends keyof (xprpals_Actions)>={
      account: 'mintme';
      name: A;
      authorization: Authorization[];
      data: xprpals_Actions[A]; 
    }
  
export type Tables<TableName extends keyof (xprpals_Tables)> = xprpals_Tables[TableName];
export type Actions<ActionName extends keyof (xprpals_Actions)> = xprpals_Actions[ActionName];
export function xprpals_actionParams<ActionName extends keyof (xprpals_Actions)>(actionPrams: xprpals_Actions[ActionName]):(object|number|string |number[]|string[])[]{return Object.values(actionPrams)}
