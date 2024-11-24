import {  NextResponse } from "next/server";
import Replicate, { type FileOutput } from "replicate";
import { PinataSDK, PinResponse } from "pinata-web3";
import { JsonRpc,Api,JsSignatureProvider } from "@proton/js";
import { Tables, xprpals } from "@/interfaces/xprpals";
import { TransactResult } from "@/interfaces/xprnetwork";
export const maxDuration = 60;

type RequestBody = {
  actor: string,
  token: string,
  ticketKey:number
}

const rpc = new JsonRpc(process.env.XPR_ENDPOINT!.split(','));
const signatureProvider = new JsSignatureProvider([process.env.AI_AGENT_SECRET!])
const api = new Api({ rpc, signatureProvider });

export async function POST(request:Request) {
  
  if (!request) {
    return NextResponse.json({},{status:500});
  }
  const requestBody: RequestBody = await request.json();
  
  const lastConfig = await getLastConfig();
  if (!lastConfig) {
    return NextResponse.json({text:'No valid config'},{status:403});
  }

  const ticket = await getTicket(requestBody.ticketKey);
  if (!ticket) {
    return NextResponse.json({text:'No valid ticket'},{status:403});
  }
  const isValidMintTicket = verifyTicket(ticket, requestBody.actor);
  if (!isValidMintTicket) {
    return NextResponse.json({text:'No valid ticket'},{status:403});
  }
  
  if (ticket.generatedHash.length >= lastConfig.config.generationLimit) {
    return NextResponse.json({text:'Generation limit reached'},{status:403});
  }
 
  const replicate = new Replicate();
  const colorsMap = new Map<string, string>()
  colorsMap.set('XPR', 'purple');
  colorsMap.set('XBTC', 'orange');
  colorsMap.set('XETH', 'blue');
  const defaultColor = "purple";
  let color = getColor();
  if (!color) color = defaultColor
  const account = requestBody.actor;
  const clotheStyle = getClotheStyleHint();
  const prompt = `Create a ${getGender()} ${getTechType()} ${getPose()} ${getBodyTypeHint()} dressed in ${clotheStyle} with the following text ${account} in bold text in black and ${color} across the front, embodying a ${clotheStyle} style. The robot is a ${getStyleReference()} like futuristic punk style in a cool pose, limb are thin with visible joints and wear futuristic shoes feet with bigger hand. Its head should resemble a high-tech ${getHeadShapeHint()} with sensors and short antennas, ${getFace()} . The background should be a vibrant ${color}, creating a sharp contrast with the character's attire, emphasizing the ${clotheStyle} and sci-fi aesthetic.The character is looking to ${getLookingSide()} , rendering style should look like dynamic pencil manga art, on a vibrant ${color} background.`;
  const input = {
    prompt, 
    aspect_ratio: "1:1",
  };
  console.log(prompt)
  const ouput = await replicate
    .run("black-forest-labs/flux-1.1-pro", {input})
    .then(async (res) => {
      const url = (res as FileOutput).url();
      const hasRes: PinResponse = await pinImage(url);
      const tx = await pushHashToChain(requestBody.ticketKey, hasRes.IpfsHash, requestBody.actor);
      return  tx;
      
    })
    .catch(e => {
      return(e)
    });
  return NextResponse.json(ouput);
  
}

async function pinImage(url:URL):Promise<PinResponse> {
  
    const imageResponse = await fetch(url);
    const imageBuffer = await imageResponse.arrayBuffer();
    const formData = new FormData();

    // Append the image as a file to the FormData
    formData.append("file", new Blob([imageBuffer]), "image.png");
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_API_JWT!,
      pinataGateway: "example-gateway.mypinata.cloud",
    });
    
  const file = new File([imageBuffer], "Testing.txt", { type: "text/plain" });
    return pinata.upload.file(file);

}

async function getTicket(ticketKey: number) {
  
  const table:{rows:Tables<'TicketTable'>[]} = await rpc.get_table_rows({
    code: process.env.AI_AGENT_ACTOR,
    scope: process.env.AI_AGENT_ACTOR,
    table: 'tickets',
    limit:1,
    lower_bound:ticketKey,
    
  })
  if (!table || !table.rows || !table.rows[0]) return 
  return table.rows[0]
  

}

function verifyTicket(ticket:Tables<'TicketTable'>,actor:string) {

  return ticket.account === actor
}

async function getLastConfig() {
  
  const table:{rows:Tables<'ConfigTable'>[]} = await rpc.get_table_rows({
    code: process.env.AI_AGENT_ACTOR,
    scope: process.env.AI_AGENT_ACTOR,
    table: 'config',
    limit:1,
    reverse:true,
    
  })
  if (!table || !table.rows || !table.rows[0]) return 
  return table.rows[0]

}

async function pushHashToChain(ticketKey: number, hash: string,actor:string):Promise<TransactResult> {
  
  console.log(process.env.AI_AGENT_ACTOR)
  const addGenerationAction = xprpals.ticket_adgen([{
    actor:process.env.AI_AGENT_ACTOR!,
    permission:process.env.AI_AGENT_PERMISSION!,
  }], {
    account: actor,
    hash,
    mintTicketKey:ticketKey
  })
  return await api.transact({actions:[addGenerationAction]},{blocksBehind:3,expireSeconds:30}) as TransactResult

}

function getHeadShapeHint(): string{
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'trapezium'
    case 2:
      return 'block / cubic'
    case 3:
      return 'triangle'
    case 4:
      return 'tube'
    case 5:
      return 'camera'
    default:
      return 'helmet'
  }

}

function getColor(): string{
  const index = getRandomHintIndex()
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      return 'purple'
    case 4:
    case 5:
    case 6:
      return 'orange'
    case 7:
    case 8:
    case 9:
      return 'blue'
    default:
      return 'purple'
  }

}

function getBodyTypeHint(): string{
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'gorilla'
    case 2:
      return 'monkey but no tail'
    case 3:
      return 'wolf but no tail'
    case 4:
      return 'lizard but no tail'
    case 5:
      return 'tiger but no tail'
    default:
      return 'humanoid'
  }

}

function getStyleReference(): string { 
  const index = getRandomHintIndex()
  switch (index) {
    default:
      return 'japanese ghost in the shell'
  }
}
function getTechType(): string{
  
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'futuristic robot'
    case 2:
      return 'horror mechanic'
    case 3:
      return 'sci-fi bio mechanic'
    case 4:
      return 'flesh and organic and electronic'
    default:
      return 'futuristic robot'
  }

}

function getFace(): string{
  
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'with multi sensors and camera face no mouth'
    case 2:
      return 'with single eye face'
    case 4:
      return 'with two eyes face'
    case 5:
      return 'with daft punk helmet face'
    case 6:
      return 'with sexy girl face'
    default:
      return ''
  }

}

function getClotheStyleHint(): string{
  
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'street wear'
    case 2:
      return 'street english torn and used punk style clothe'
    case 3:
      return 'kawaii style clothes'
    case 4:
      return '50\'s gentleman suit'
    case 5:
      return 'rock\'n\'roll and leather clothes'
    default:
      return '50\'s gentleman suit'
  }

}

function getLookingSide(): string{
  
  const index = getRandomHintIndex()
  if (index % 2 == 0) return 'the right';
  if (index % 3 == 0) return 'the camera';
  return 'the left'

}

function getPose(): string{
  
  const index = getRandomHintIndex()
  switch (index) {
    case 1:
      return 'in a standing pose with a baseball bat in hand'
    case 2:
      return 'playing guitar hard'
    case 3:
      return 'in a shooting'
    case 4:
      return 'in a punching pose'
    case 5:
      return 'in a dancing pose'
    case 6:
      return 'in a standing pose with a guitar in hand'
    case 7:
      return 'in a sitting pose, eating a bowl ramen with chop stick'
    default:
      return 'in a fashion photo shoot pose'
  }

}

function getGender(): string {
  
  const index = getRandomHintIndex()
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
      return 'a badass male'
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return 'a badass sexy female'
    default:
      return 'a badass male'
  }

}

function getRandomHintIndex(): number {
  
  return Math.floor(Math.random() * 9);

}
