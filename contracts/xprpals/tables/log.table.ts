import { Asset, EMPTY_NAME, Name, Symbol, Table } from "proton-tsc";
import { XPRPalsConfig } from "../types";

/**
 * @table logs
 * Represents a table for storing log messages in the smart contract
 */
@table('logs')
export class LogTable extends Table {

  /**
   * Creates a new LogTable instance
   * @param key - Unique identifier for the log entry (defaults to 0)
   * @param message - The log message content (defaults to empty string)
   */
  constructor(
    public key: u64 = 0,
    public message: string = ""
  ) {
    super()
  }

  /**
   * Primary key getter for the log entry
   * @returns The unique identifier of the log entry
   */
  @primary
  get by_key(): u64 {
    return this.key
  }
  
  /**
   * Primary key setter for the log entry
   * @param value - The new key value to set
   */
  set by_key(value: u64) {
    this.key = value
  }


}