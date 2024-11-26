import { EMPTY_NAME, Name, Table } from "proton-tsc";

/**
 * @table tickets
 * Represents a ticket record in the blockchain database
 */
@table('tickets')
export class TicketTable extends Table {

  constructor(
    /**
     * Unique identifier for the ticket
     */
    public key: u64 = 0,
    /**
     * Account name associated with the ticket
     */
    public account: Name = EMPTY_NAME,
    /**
     * Array of generated hashes for the ticket
     */
    public generatedHash: string[] = [],
    /**
     * Template ID associated with the ticket
     */
    public templateId: u64 = 0,
    /**
     * Asset ID associated with the ticket
     */
    public assetId: u64 = 0
  ) {
    super()
  }

  /**
   * Primary key getter
   * @returns The ticket's unique identifier
   */
  @primary
  get by_key(): u64 {
    return this.key
  }
 
  /**
   * Primary key setter
   * @param value - The new key value
   */
  set by_key(value: u64) {
    this.key = value
  }
  
  /**
   * Secondary index getter for account lookup
   * @returns The account name as u64
   */
  @secondary
  get by_account(): u64 {
    return this.account.N
  }
 
  /**
   * Secondary index setter for account
   * @param value - The account value as u64
   */
  set by_account(value: u64) {
    this.account = Name.fromU64(value);
  }

  /**
   * Secondary index getter for template lookup
   * @returns The template ID
   */
  @secondary
  get by_templateId(): u64 {
    return this.templateId
  }
 
  /**
   * Secondary index setter for template
   * @param value - The template ID value
   */
  set by_templateId(value: u64) {
    this.templateId = value;
  }
  
  /**
   * Secondary index getter for asset lookup
   * @returns The asset ID
   */
  @secondary
  get by_assetId(): u64 {
    return this.assetId
  }
 
  /**
   * Secondary index setter for asset
   * @param value - The asset ID value
   */
  set by_assetId(value: u64) {
    this.assetId = value
  }
}