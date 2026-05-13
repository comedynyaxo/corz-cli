const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://corz.ai" : `https://${stage}.corz.ai`,
  console: stage === "production" ? "https://corz.ai/auth" : `https://${stage}.corz.ai/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/anomalyco/corz",
  discord: "https://corz.ai/discord",
  headerLinks: [
    { name: "app.header.home", url: "/" },
    { name: "app.header.docs", url: "/docs/" },
  ],
}
