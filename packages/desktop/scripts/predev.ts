import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.CORZ_CHANNEL ?? "dev"}`

await $`cd ../corz && bun script/build-node.ts`
