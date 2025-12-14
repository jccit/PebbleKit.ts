/**
 * Fetch a string from a URL
 * @param url - The URL to fetch
 * @returns A promise that resolves with the string
 * @deprecated Use native fetch instead
 */
export async function fetchString(url: string): Promise<string> {
  console.warn("PebbleTS.fetchString is deprecated, use fetch instead");

  const req = await fetch(url);
  return req.text();
}

/**
 * Fetch a JSON object from a URL
 * @param url - The URL to fetch
 * @returns A promise that resolves with the JSON object
 * @deprecated Use native fetch instead
 */
export async function fetchJSON<T>(url: string): Promise<T> {
  console.warn("PebbleTS.fetchJSON is deprecated, use fetch instead");

  const req = await fetch(url);
  return req.json();
}

/**
 * Fetch a binary file from a URL.
 * @param url - The URL to fetch
 * @returns A promise that resolves with the binary file as a Uint8Array
 * @deprecated Use native fetch instead
 */
export async function fetchBinary(url: string): Promise<Uint8Array> {
  console.warn("PebbleTS.fetchBinary is deprecated, use fetch instead");

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}
