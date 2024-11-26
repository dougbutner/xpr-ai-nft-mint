/**
 * Creates a promise that resolves after a specified delay
 * @param ms - The delay time in milliseconds
 * @returns A promise that resolves after the specified delay
 * @example
 * Wait for 1 second
 * await wait(1000);
 */
export async function wait(ms: number): Promise<void> {
  
  return new Promise((resolve) => setTimeout(() => {
    resolve();
  }, ms))

}