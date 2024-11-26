import { TransactResult } from "@/interfaces/xprnetwork";


/**
 * Generates a new image by making a POST request to the images API endpoint
 * @param actor - The actor/user initiating the image generation
 * @param ticketKey - The ticket key associated with the image generation request
 * @returns Promise<TransactResult> - The result of the image generation transaction
 */
export async function generateNewImage(actor: string, ticketKey: number):Promise<TransactResult> {
  // Set up headers for the HTTP request
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Prepare the request body
  const raw = JSON.stringify({
    actor: actor,
    ticketKey: ticketKey,
    token: "XETH",  // Specify token type for the transaction
  });

  // Configure request options
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  // Make API call and return the response
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/agents/images`, requestOptions)
    .then(response => response.json())
    .catch(error => console.error(error));  // Log any errors that occur during the request
}
