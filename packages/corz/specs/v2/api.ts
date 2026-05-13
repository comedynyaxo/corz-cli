// @ts-nocheck

import { Corz } from "@corz-ai/core"
import { ReadTool } from "@corz-ai/core/tools"

const corz = Corz.make({})

corz.tool.add(ReadTool)

corz.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

corz.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

corz.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await corz.session.create({
  agent: "build",
})

corz.subscribe((event) => {
  console.log(event)
})

await corz.session.prompt({
  sessionID,
  text: "hey what is up",
})

await corz.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await corz.session.wait()

console.log(await corz.session.messages(sessionID))
