import { Asset, EMPTY_NAME, Name, Symbol, Table } from "proton-tsc";
import { XPRPalsConfig } from "../types";

@table('config')
export class ConfigTable extends Table {

  constructor(
    public key: u64 = 0,
    public config: XPRPalsConfig = new XPRPalsConfig(EMPTY_NAME,new Asset(0,new Symbol('XPR',4)))
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


}