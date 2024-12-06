import {
  Asset,
  Decoder,
  EMPTY_NAME,
  Encoder,
  Name,
  Packer,
  Symbol,
  
} from "proton-tsc";

/**
 * Configuration class for XPR Pals NFT collection
 * @class XPRPalsConfig
 * @implements {Packer}
 */
@packer
export class GlobalConfig implements Packer {
  /**
   * Creates an instance of XPRPalsConfig
   * @param {Name} collectionName - The name of the NFT collection
   * @param {Asset} tokenPrice - The price of tokens in XPR
   * @param {u8} generationLimit - Maximum number of generations allowed
   * @param {Name} transferAccount - Account name for token transfers
   */
  constructor(
    public collectionName: Name = EMPTY_NAME,
    public tokenPrice: Asset = new Asset(0, new Symbol("XPR", 4)),
    public generationLimit:u8 = 0,
    public transferAccount: Name = EMPTY_NAME,
  ) {
    
  }

  /**
   * Serializes the config object into a byte array
   * @returns {u8[]} Serialized configuration data
   */
  pack(): u8[] {
    let enc = new Encoder(this.getSize());
    enc.packName(this.collectionName);
    enc.packNumber<u64>(this.tokenPrice.amount);
    enc.packNumber<u64>(this.tokenPrice.symbol.value);
    enc.packNumber<u8>(this.generationLimit);
    enc.packName(this.transferAccount);
    return enc.getBytes();
  }

  /**
   * Deserializes the byte array into config object properties
   * @param {u8[]} data - Byte array containing serialized config data
   * @returns {usize} Position after reading the data
   */
  unpack(data: u8[]): usize {
    let decoder = new Decoder(data);
    this.collectionName = decoder.unpackName();
    const tokenAmount = decoder.unpackNumber<u64>()
    const tokenRawSymbol = decoder.unpackNumber<u64>()
    this.tokenPrice = new Asset(tokenAmount, Symbol.fromU64(tokenRawSymbol));
    this.generationLimit = decoder.unpackNumber<u8>();
    this.transferAccount = decoder.unpackName();
    return decoder.getPos();
  }

  /**
   * Gets the size of the serialized config data in bytes
   * @returns {usize} Size of the serialized data
   */
  getSize(): usize {
    return 33
  }

}
