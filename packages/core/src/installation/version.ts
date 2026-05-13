declare global {
  const CORZ_VERSION: string
  const CORZ_CHANNEL: string
}

export const InstallationVersion = typeof CORZ_VERSION === "string" ? CORZ_VERSION : "local"
export const InstallationChannel = typeof CORZ_CHANNEL === "string" ? CORZ_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
