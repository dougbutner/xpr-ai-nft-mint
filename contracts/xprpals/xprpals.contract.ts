import {
  assertRecoverKey,
  Asset,
  check,
  Contract,
  Name,
  PublicKey,
  recoverKey,
  requireAuth,
  Signature,
  TableStore,
  unpackActionData,
} from "proton-tsc";
import {
  ATOMICASSETS_CONTRACT,
  AtomicAttribute,
  AtomicValue,
  sendCreateTemplate,
  sendMintAsset,
  sendTransferNfts,
  TransferNfts,
} from "proton-tsc/atomicassets";
import {Config} from "proton-tsc/atomicassets/atomicassets.tables";
import {ConfigTable, TicketTable,LogTable} from "./tables";
import {XPRPalsConfig} from "./types";
import { sendTransferToken, Transfer } from "proton-tsc/token";

/**
 * XPRPals NFT Contract
 * Handles minting of generative NFTs on the Proton blockchain
 */
@contract
export class xprpals extends Contract {
  private configTable: TableStore<ConfigTable> = new TableStore<ConfigTable>(
    this.receiver
  );
  private ticketTable: TableStore<TicketTable> = new TableStore<TicketTable>(
    this.receiver
  );
  private logs: TableStore<LogTable> = new TableStore<LogTable>(
    this.receiver
  );
    
/**------------------------------------------------------------------------
 **                            TRANSFER
 *------------------------------------------------------------------------**/

  /**
   * Handles incoming token and NFT transfers
   * - For NFT transfers: Processes incoming NFTs
   * - For token transfers: Creates mint tickets when correct payment is received
   * @notify Called as notification from token contracts
   */
  @action("transfer", notify)
  onTransfer(): void {
      
    if (this.firstReceiver == ATOMICASSETS_CONTRACT ) { 
        const nftArg = unpackActionData<TransferNfts>();
    }
    if (this.firstReceiver == Name.fromString("eosio.token")) { 
        const tokenArg = unpackActionData<Transfer>();

        check(tokenArg.from != tokenArg.to, "No self transfer");
    if (tokenArg.from == this.receiver) return;
    if (tokenArg.memo == 'funding') return;

    const lastConfig = this.configTable.last();
    check(!!lastConfig, "Missing config");
    if (!lastConfig) return;

    check(
      lastConfig.config.tokenPrice.amount == tokenArg.quantity.amount,
      "Amount not match"
    );
    if (lastConfig.config.tokenPrice.amount != tokenArg.quantity.amount) return;

    check(
      lastConfig.config.tokenPrice.symbol.getSymbolString() ==
        tokenArg.quantity.symbol.getSymbolString(),
      "Symbol not match"
    );
    if (lastConfig.config.tokenPrice.amount != tokenArg.quantity.amount) return;

    const nextKey = this.ticketTable.availablePrimaryKey;
    const ticket = new TicketTable(nextKey, tokenArg.from, [], 0, 0);
    this.ticketTable.store(ticket, this.receiver);
      sendTransferToken(Name.fromString('eosio.token'), this.receiver, lastConfig.config.transferAccount,tokenArg.quantity,"")       
    }
  }
    
  /**------------------------------------------------------------------------
   **                            TICKETS
   *------------------------------------------------------------------------**/

  /**
   * Adds a generated hash to a mint ticket
   * @param account Account performing the action
   * @param mintTicketKey ID of the mint ticket
   * @param hash Generated image hash to add
   */
  @action("ticket.adgen")
  pushGeneratedHash(account: Name, mintTicketKey: u64, hash: string): void {
    requireAuth(this.receiver);
    const ticket = this.ticketTable.requireGet(
      mintTicketKey,
      "Ticket not found"
    );
    if (!ticket) return;
    const lastConfig = this.configTable.last();
    check(!!lastConfig,'Missing config')
    if (!lastConfig) return;
    check(ticket.generatedHash.length < i32(lastConfig.config.generationLimit), 'Generated hash limit reached');
    ticket.generatedHash.push(hash);
    this.ticketTable.update(ticket, this.receiver);
  }

  /**
   * Mints an NFT using a generated hash from a ticket
   * @param account Account performing the mint
   * @param mintTicketKey ID of the mint ticket
   * @param hashIndex Index of the hash to use from the ticket's generated hashes
   */
  @action("ticket.mint")
  mintTicket(account: Name, mintTicketKey: u64, hashIndex: u8): void {
    requireAuth(account);
    const lastConfig = this.configTable.last();
    check(!!lastConfig, "Missing config");
    if (!lastConfig) return;

    const ticket = this.ticketTable.requireGet(
      mintTicketKey,
      "Ticket not found"
    );
    if (!ticket) return;
    check(ticket.generatedHash.length > 0, "No hash found");
    if (ticket.generatedHash.length == 0) return;

    const aaConfigTable: TableStore<Config> = new TableStore<Config>(
      ATOMICASSETS_CONTRACT
    );
    const aaConfig = aaConfigTable.last();
    check(!!aaConfig, "No AA config found");
    if (!aaConfig) return;
      const nextKey = aaConfig.template_counter;
      const log = new LogTable(this.logs.availablePrimaryKey,`guees the next template id ${nextKey}`)
        this.logs.store(log,this.receiver)
    const imageHash = ticket.generatedHash[hashIndex];
    check(!!imageHash, "Hash index not exist");
    if (!imageHash) return;

    const description = new AtomicAttribute(
      "description",
      AtomicValue.new<String>("This is a super cool generated NFT")
    );
    const imageAttribute = new AtomicAttribute(
      "image",
      AtomicValue.new<string>(imageHash)
    );
    const imgAttribute = new AtomicAttribute(
      "img",
      AtomicValue.new<string>(imageHash)
    );
    const nameAttribute = new AtomicAttribute(
      "name",
      AtomicValue.new<string>(account.toString())
    );
    const urlAttribute = new AtomicAttribute(
      "url",
      AtomicValue.new<string>("https://xprpals.com")
    );

      ticket.templateId = nextKey;
      this.ticketTable.update(ticket, this.receiver);
    sendCreateTemplate(
      this.receiver,
      this.receiver,
      lastConfig.config.collectionName,
      lastConfig.config.collectionName,
      true,
      true,
      1,
      [description, imageAttribute, imgAttribute, nameAttribute, urlAttribute]
    );
  }
    
  /**------------------------------------------------------------------------
   **                            ATOMIC ASSET LOGS
   *------------------------------------------------------------------------**/

  /**
   * Handles logging of newly created templates
   * @param template_id ID of the created template
   * @param authorized_creator Account authorized to create the template
   * @param collection_name Name of the collection
   * @param schema_name Name of the schema
   * @notify Called as notification from AtomicAssets
   */
  @action("lognewtempl", notify)
  onLogNewTemplate(
    template_id: u32,
    authorized_creator: Name,
    collection_name: Name,
    schema_name: Name
  ): void {
    const log = new LogTable(this.logs.availablePrimaryKey,`the created template id ${template_id}`)
    this.logs.store(log,this.receiver)
      
    sendMintAsset(
      this.receiver,
      this.receiver,
      collection_name,
      schema_name,
      template_id,
      this.receiver,
      [],
      [],
      []
    );
  }

  /**
   * Handles logging of newly minted assets and transfers them to the owner
   * @param asset_id ID of the minted asset
   * @param authorized_minter Account authorized to mint
   * @param collection_name Name of the collection
   * @param schema_name Name of the schema
   * @param template_id ID of the template used
   * @param new_asset_owner Account that will own the asset
   * @param immutable_data Immutable attributes of the asset
   * @param mutable_data Mutable attributes of the asset
   * @param backed_tokens Tokens backing the asset
   * @notify Called as notification from AtomicAssets
   */
  @action("logmint", notify)
  onLogNewMint(
    asset_id: u64,
    authorized_minter: Name,
    collection_name: Name,
    schema_name: Name,
    template_id: u32,
    new_asset_owner: Name,
    immutable_data: AtomicAttribute[],
    mutable_data: AtomicAttribute[],
    backed_tokens: Asset[]
  ): void {
    const log = new LogTable(this.logs.availablePrimaryKey,`from mint the template id ${template_id}`)
    this.logs.store(log,this.receiver)
      const ticket = this.ticketTable.getBySecondaryU64(u64(template_id), 1);
     check(!!ticket, "No ticket found");
     if (!ticket) return;
    ticket.assetId = asset_id;
      this.ticketTable.update(ticket, this.receiver);
    sendTransferNfts(this.receiver, ticket.account, [asset_id], 'XPRPals NFT mint!')
    this.ticketTable.remove(ticket);
  }

 /**------------------------------------------------------------------------
  **                            GOVERNANCE
  *------------------------------------------------------------------------**/

  /**
   * Updates the contract configuration
   * @param config New configuration to apply
   */
  @action("gov.chcfg")
  changeConfig(config: XPRPalsConfig): void {
    requireAuth(this.receiver)
    const nextKey = this.configTable.availablePrimaryKey;
    const newConfig = new ConfigTable(nextKey, config);
    this.configTable.store(newConfig, this.receiver);
  }

  /**------------------------------------------------------------------------
   **                            DEVELOPER
   *------------------------------------------------------------------------**/
    
  // @action("dev.clrtck")
  // clearTickets(): void {
  //   requireAuth(this.receiver)
  //   let ticket = this.ticketTable.first();
  //   while (ticket) {
  //     if (!ticket) break;
  //     const tickerToRemove = ticket;
  //     ticket = this.ticketTable.next(ticket);
  //     this.ticketTable.remove(tickerToRemove);
  //   }
  // }
  
  // @action("dev.clrcfg")
  // clearConfig(): void {
  //   requireAuth(this.receiver)
  //   let config = this.configTable.first();
  //   while (config) {
  //     if (!config) break;
  //     const configToRemove = config;
  //     config = this.configTable.next(config);
  //     this.configTable.remove(configToRemove);
  //   }
  // }
}
