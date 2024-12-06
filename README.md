# MintMe Project

## Overview
MintMe is a decentralized application built on XRP Network, consisting of smart contracts and a web interface.

## Project Structure
- `/contract/xpr-ai-nft-mint` - Smart contract implementation
- `/apps/web` - Web application frontend

The project use monorepo restructure that rely on package manager

### Installation

On the project root run the install command,  sub folder package installation are handled automatically.

#### On npm
Run `npm install`
#### On yarn
Run `yarn add`
#### On bun
Run `bun install`

## Create atomic asset collection and schema.
Your templates and asset need a collection on Atomic asset to be bound with. 

Navigate to [explorer mainnet](https://explorer.xprnetwork.org/account/atomicassets?loadContract=true&tab=Actions&account=atomicassets&scope=atomicassets&limit=100&action=createcol) or [explorer testnet](https://testnet.explorer.xprnetwork.org/account/atomicassets?loadContract=true&tab=Actions&account=atomicassets&scope=atomicassets&limit=100&action=createcol) and fill the following form.

![explorer xprnetwork org_account_atomicassets_loadContract=true tab=Actions account=atomicassets scope=atomicassets limit=100 action=createcol (2)](https://github.com/user-attachments/assets/7b0a4db0-0c94-4ab7-941f-46f6c4c9f873)


Make sure: 
- You replace `yourcontract` by the name of the account where the contract is deployed.
- You set a unique name for you collection: it must follow the same rule than Name (can only use a to z and 1 to 5 chars) and must be 12 chars length
- You can set `market_fee` up to 0.15 (mean 15%) to earn sale price share from future sale on soon market.

Next create the schema 

Now navigate to [explorer mainnet](https://explorer.xprnetwork.org/account/atomicassets?loadContract=true&tab=Actions&account=atomicassets&scope=atomicassets&limit=100&action=createschema) or [explorer testnet](https://testnet.explorer.xprnetwork.org/account/atomicassets?loadContract=true&tab=Actions&account=atomicassets&scope=atomicassets&limit=100&action=createschema) and fill the following form.

<img width="441" alt="Capture d’écran 2024-12-06 à 01 21 26" src="https://github.com/user-attachments/assets/893f9d2a-6728-4ae6-a61d-fdba267cfda1">

Make sure: 
- You replace `yourcontract` by the name of the account where the contract is deployed.
- `collection_name` and `schema_name` should be the same as the collection create before 
- Paste the following schema to the `schema` field
```
[ 
  { "name":  "name", "type":  "string" }, 
  { "name":  "image", "type":  "string" }, 
  { "name":  "img", "type":  "string" }, 
  { "name":  "url", "type":  "string" }, 
  { "name":  "description", "type":  "string" } 
]
```
<hr>

## Smart Contract Setup (./contract/xpr-ai-nft-mint)

### Prerequisites
- Node.js (v18 or later)
- npm or yarn or bun package manager
- @proton/cli

### Deploy
- Create an account where you will deploy the contract.
- Make sure the created account private key is added to the wallets manager
- Open the file in ./contracts/xpr-ai-nft-mint/makefile
- Replace the fields `TESTNET_CONTRACT_NAME` / `MAINNET_CONTRACT_NAME` with the account(s) you create.
- Save and close the makefile.
- Add ram to your account using https://resources.xprnetwork.org/storage or @proton/cli `proton ram:buy` command.
  - For testnet you can use the `make feed-ram` command 
- Open a terminal session on ./contracts/xpr-ai-nft-mint/ 
- Run 
  - **For testnet**: make push_testnet
  - **For mainnet**: make push_mainnet
- Done !


### Concept
The contract is a basic escrow like contract. When user transfer the amount (defined in the config table: see config section), the contract create a mint ticket owned by the account that sourced the transfer. The resulting ticket could be used to generate AI image and mint the selected one. 

### Tables structure 

#### Ticket

A ticket is the result of a transfer of corresponding tokens and quantity that match with the `tokenPrice` field from the contract config (see config section)

A ticket is 
- a entry for AI generation request (max generation is also defined in the config table: see config section) 
- A older for IPFS hash generated after the image generation
- an entry to trigger the mint process.

Since it's not converted to a mint, a ticket is recoverable, it hold the images IPFS `generatedHash`, the created `templateId` and the `assetId` during the process.  Once the asset is minted, the ticket is destroyed.

Fields


```
public key: u64 = 0;
public account: Name = EMPTY_NAME;
public generatedHash: string[] = [];
public templateId: u64 = 0;
public assetId: u64 = 0;
```
<hr>

#### Config

The config section hold the global config for the smart contract. Through a special object type, it define the ticket price, the collection where the asset belong, and an account where all mint amount should land. 

The contract alway get the last inserted config. Config could not be edited, to change the config, you push a new one. 

```
public key: u64 = 0,
public config: XPRPalsConfig = new XPRPalsConfig(
  EMPTY_NAME,
  new Asset(
    0,
    new Symbol('XPR',4)
    ),
  EMPTY_NAME,
)
```
The config contains a `XPRPalsConfig` which is a special structure that allow configuration to evolve without constrain table structure. 
```
public collectionName: Name = EMPTY_NAME,
public tokenPrice: Asset = new Asset(0, new Symbol("XPR", 4)),
public generationLimit:u8 = 0,
public transferAccount: Name = EMPTY_NAME,
```

### Actions

#### Transfer Handling
```typescript
@action("transfer", notify)
```
Handles incoming token transfers. Never invoked directly but triggered when the contract receive tokens. It creates mint tickets when correct payment is received


#### Ticket Management
```typescript
@action("ticket.adgen")
```
Adds a IPFS generated hash to a mint ticket. This action is invoked by the API, only the contract account is authorized to use it. 
- Parameters:
  - `account`: Account performing the action
  - `mintTicketKey`: ID of the mint ticket 
  - `hash`: Generated image hash to add

```typescript
@action("ticket.mint") 
```
Mints an NFT using a generated hash from a ticket
- Parameters:
  - `account`: Account performing the mint
  - `mintTicketKey`: ID of the mint ticket
  - `hashIndex`: Index of the hash to use from the ticket's generated hashes

#### Atomic Asset Logging
```typescript
@action("lognewtempl", notify)
```
Triggered from the AtomicAsset contract when new templates is created. It run the mint process. Could not be invoked directly.
- Parameters:
  - `template_id`: ID of the created template
  - `authorized_creator`: Account authorized to create the template
  - `collection_name`: Name of the collection
  - `schema_name`: Name of the schema

```typescript
@action("logmint", notify)
```
Triggered from the AtomicAsset contract when new asset is minted. Destroy the used ticket. Could not be invoked directly.
- Parameters:
  - `asset_id`: ID of the minted asset
  - `authorized_minter`: Account authorized to mint
  - `collection_name`: Name of the collection 
  - `schema_name`: Name of the schema
  - `template_id`: ID of the template used
  - `new_asset_owner`: Account that will own the asset
  - `immutable_data`: Immutable attributes of the asset
  - `mutable_data`: Mutable attributes of the asset
  - `backed_tokens`: Tokens backing the asset

#### Governance
```typescript
@action("gov.chcfg")
```
Updates the contract configuration
- Parameters:
  - `config`: New configuration to apply

## Frontend  (./app/web)

### Prerequisites
- Node.js (v18 or later)
- npm or yarn or bun package manager

### Packages


 The front end is a NextJS App, it contain the front end and the API route for the AI generation image. The easiest way to deploy is using vercel (you can create a free hobby account). Make sure you have a github account to make your own copy.

 #### Setup environment
 - Locate the `env.template` file
 - Rename it `.env`
 - Open the file 
 
```
REPLICATE_API_TOKEN=
```
The token from [replicate service](https//replicate.com/black-forest-labs/flux-1.1-pro-ultra/api)
```
PINATA_API_JWT=
```
The JWT token from [pinata](https://auth.pinata.cloud/)

```
AI_AGENT_ACTOR=youcontract
AI_AGENT_PERMISSION=active
AI_AGENT_SECRET=private_from_contract_account
````
The information from you smart contract, allow the backend to push IPFS hash from generated image to the user ticket

```
XPR_ENDPOINT=https://testnet.rockerone.io
NEXT_PUBLIC_XPR_ENDPOINT=https://testnet.rockerone.io
````
The XPRNetwork's endpoints
```
NEXT_PUBLIC_XPR_AA_ENDPOINT=https://aa-xprnetwork-test.saltant.io/
````
The atomic assets endpoint  
```
NEXT_PUBLIC_XPR_CHAIN_ID=71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd
````
Chain id, see [xprnetwork doc](https://docs.xprnetwork.org/client-sdks/endpoints.html) for mainnet or testnet.
```
NEXT_PUBLIC_REQUESTER_ACCOUNT=youcontract
NEXT_PUBLIC_DAPP_NAME=Your app cool name
````
Configuration for the proton web SDK

```
NEXT_PUBLIC_COLLECTION_NAME=yourowncollectionname
````
The collection you created from the *"Create atomic asset collection and shcema"*
```
NEXT_PUBLIC_IPFS_ENDPOINT=an_ipfs_url
```
Could be proton ipfs or your own pinata gateway
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
The current url where the project is deployed (change to vercel URL when deployed)

```
NEXT_PUBLIC_API_MODE=testnet_or_mainnet
````

 #### Run from localhost

 - Open terminal on the root folder
 - Open ./app/web
 - run one of this command according to your package manager
    - bun run dev
    - npm run dev
    - yarn dev
  - On your browser open http://localhost:3000

The app could be deployed on vercel. Alternatively you can deploy on your own infrastructure. 

 [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FXPRNetwork%2Fxpr-ai-nft-mint)
