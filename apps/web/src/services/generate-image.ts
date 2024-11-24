import { TransactResult } from "@/interfaces/xprnetwork";

export async function generateNewImage(actor: string, ticketKey: number):Promise<TransactResult> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    actor: actor,
    ticketKey: ticketKey,
    token: "XETH",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/images`, requestOptions)
    .then(response => response.json())
    .catch(error => console.error(error));
}
