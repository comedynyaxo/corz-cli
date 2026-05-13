export * from "./client.js"
export * from "./server.js"

import { createCorzClient } from "./client.js"
import { createCorzServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createCorz(options?: ServerOptions) {
  const server = await createCorzServer({
    ...options,
  })

  const client = createCorzClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
