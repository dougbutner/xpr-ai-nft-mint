import { EMPTY_NAME, Name, Table } from "proton-tsc";
@table('tickets')
export class TicketTable extends Table {

  constructor(
    public key: u64 = 0,
    public account: Name = EMPTY_NAME,
    public generatedHash: string[] = [],
    public templateId: u64 = 0,
    public assetId:u64 = 0
    
  ) {
    super()
  }

  @primary
  get by_key(): u64 {
    return this.key
  }
 
  set by_key(value:u64) {
    this.key = value
  }
  
  @secondary
  get by_account(): u64 {
    return this.account.N
  }
 
  set by_account(value:u64) {
    this.account = Name.fromU64(value);
  }

  @secondary
  get by_templateId(): u64 {
    return this.templateId
  }
 
  set by_templateId(value:u64) {
    this.templateId = value;
  }
  
  @secondary
  get by_assetId(): u64 {
    return this.assetId
  }
 
  set by_assetId(value:u64) {
    this.assetId = value
  }

}