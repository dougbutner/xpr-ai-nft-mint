import {
  Asset,
  Decoder,
  EMPTY_NAME,
  Encoder,
  Name,
  Packer,
  Symbol,
  
} from "proton-tsc";
@packer
export class XPRPalsConfig implements Packer {
  constructor(
    public collectionName: Name = EMPTY_NAME,
    public tokenPrice: Asset = new Asset(0, new Symbol("XPR", 4)),
    public generationLimit:u8 = 0,
    public transferAccount: Name = EMPTY_NAME,
  ) {
    
  }
  pack(): u8[] {
    let enc = new Encoder(this.getSize());
    enc.packName(this.collectionName);
    enc.packNumber<u64>(this.tokenPrice.amount);
    enc.packNumber<u64>(this.tokenPrice.symbol.value);
    enc.packNumber<u8>(this.generationLimit);
    enc.packName(this.transferAccount);
    return enc.getBytes();
  }

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

  getSize(): usize {
    return 33
  }

}
