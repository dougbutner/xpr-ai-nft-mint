type eosio_token_Actions = {
  "close": {
    owner:string;
    symbol:string
  },
  "create": {
    issuer:string;
    maximum_supply:string
  },
  "issue": {
    to:string;
    quantity:string;
    memo:string
  },
  "open": {
    owner:string;
    symbol:string;
    ram_payer:string
  },
  "retire": {
    quantity:string;
    memo:string
  },
  "transfer": {
    from:string;
    to:string;
    quantity:string;
    memo:string
  }
}

export const eosio_token = {
  close:(authorization:Authorization[],data:eosio_token_Actions['close']):XPRAction<'close'>=>({
	account:'eosio.token',
	name:'close',
	authorization,
data}),
 create:(authorization:Authorization[],data:eosio_token_Actions['create']):XPRAction<'create'>=>({
	account:'eosio.token',
	name:'create',
	authorization,
data}),
 issue:(authorization:Authorization[],data:eosio_token_Actions['issue']):XPRAction<'issue'>=>({
	account:'eosio.token',
	name:'issue',
	authorization,
data}),
 open:(authorization:Authorization[],data:eosio_token_Actions['open']):XPRAction<'open'>=>({
	account:'eosio.token',
	name:'open',
	authorization,
data}),
 retire:(authorization:Authorization[],data:eosio_token_Actions['retire']):XPRAction<'retire'>=>({
	account:'eosio.token',
	name:'retire',
	authorization,
data}),
 transfer:(authorization:Authorization[],data:eosio_token_Actions['transfer']):XPRAction<'transfer'>=>({
	account:'eosio.token',
	name:'transfer',
	authorization,
data}) 
} 
type eosio_token_Tables = {
  "account": {
    balance:string
  },
  "currency_stats": {
    supply:string;
    max_supply:string;
    issuer:string
  }
}


    export type Authorization = {
      actor: string;
      permission: "active"|"owner"|string;
  }

    export type XPRAction<A extends keyof (eosio_token_Actions)>={
      account: 'eosio.token';
      name: A;
      authorization: Authorization[];
      data: eosio_token_Actions[A]; 
    }
  
export type Tables<TableName extends keyof (eosio_token_Tables)> = eosio_token_Tables[TableName];
export type Actions<ActionName extends keyof (eosio_token_Actions)> = eosio_token_Actions[ActionName];
export function eosio_token_actionParams<ActionName extends keyof (eosio_token_Actions)>(actionPrams: eosio_token_Actions[ActionName]):(object|number|string |number[]|string[])[]{return Object.values(actionPrams)}
