import { Asset, EMPTY_NAME, Symbol, Table } from "proton-tsc";
import { GlobalConfig } from "../types";

/**
 * @table config
 * @description Table class for storing XPRPals configuration data
 */
@table('config')
export class ConfigTable extends Table {

  /**
   * @constructor
   * @param {u64} key - Primary key for the config entry (defaults to 0)
   * @param {GlobalConfig} config - Configuration settings containing admin and token info (defaults to empty config)
   */
  constructor(
    public key: u64 = 0,
    public config: GlobalConfig = new GlobalConfig(EMPTY_NAME,new Asset(0,new Symbol('XPR',4)))
  ) {
    super()
  }

  /**
   * @primary
   * @description Getter for the primary key
   * @returns {u64} The primary key value
   */
  @primary
  get by_key(): u64 {
    return this.key
  }
  
  /**
   * @description Setter for the primary key
   * @param {u64} value - The new primary key value
   */
  set by_key(value:u64) {
    this.key = value
  }


}