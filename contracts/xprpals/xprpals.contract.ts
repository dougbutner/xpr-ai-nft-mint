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
