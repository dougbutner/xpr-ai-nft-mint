import { Asset, EMPTY_NAME, Name, Symbol, Table } from "proton-tsc";
import { XPRPalsConfig } from "../types";

@table('logs')
export class LogTable extends Table {

  constructor(
    public key: u64 = 0,
    public message: string = ""
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