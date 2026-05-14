export * as Offline from "./offline"

import os from "os"
import path from "path"
import { Global } from "@corz-ai/core/global"
import * as Log from "@corz-ai/core/util/log"

const log = Log.create({ service: "offline" })

const LLAMA_CPP_VERSION = "b8668"
const LLAMA_SERVER_PORT = 39281
const MODEL_FILENAME = "qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"
const MODEL_URL =
  "https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf"

function offlineDir() {
  return path.join(Global.Path.data, "offline")
}

function serverBinaryPath() {
  return path.join(offlineDir(), "llama-server")
}

function modelPath() {
  return path.join(offlineDir(), MODEL_FILENAME)
}

function downloadUrl(): string {
  const platform = os.platform()
  const arch = os.arch()

  if (platform === "linux" && arch === "x64")
    return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_VERSION}/llama-${LLAMA_CPP_VERSION}-bin-ubuntu-x64.tar.gz`
  if (platform === "linux" && arch === "arm64")
    return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_VERSION}/llama-${LLAMA_CPP_VERSION}-bin-ubuntu-arm64.tar.gz`
  if (platform === "darwin" && arch === "arm64")
    return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_VERSION}/llama-${LLAMA_CPP_VERSION}-bin-macos-arm64.tar.gz`
  if (platform === "darwin" && arch === "x64")
    return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_VERSION}/llama-${LLAMA_CPP_VERSION}-bin-macos-x64.tar.gz`
  if (platform === "win32" && arch === "x64")
    return `https://github.com/ggml-org/llama.cpp/releases/download/${LLAMA_CPP_VERSION}/llama-${LLAMA_CPP_VERSION}-bin-win-cpu-x64.zip`

  throw new Error(`Unsupported platform: ${platform}/${arch}`)
}

let serverProcess: ReturnType<typeof Bun.spawn> | undefined
let starting = false

export const PROVIDER_ID = "offline"
export const MODEL_ID = "qwen2.5-coder-1.5b"
export const MODEL_NAME = "Qwen2.5 Coder 1.5B"
export const PORT = LLAMA_SERVER_PORT

export function isRunning(): boolean {
  return serverProcess !== undefined && serverProcess.exitCode === null
}

export async function ensureBinary(): Promise<string> {
  const binPath = serverBinaryPath()
  const file = Bun.file(binPath)
  if (await file.exists()) return binPath

  const dir = offlineDir()
  await Bun.write(path.join(dir, ".keep"), "")
  const { mkdir } = await import("fs/promises")
  await mkdir(dir, { recursive: true })

  const url = downloadUrl()
  log.info("downloading llama.cpp server", { url })

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download llama.cpp: ${res.status} ${res.statusText}`)

  const tarPath = path.join(dir, "llama-server.tar.gz")
  await Bun.write(tarPath, res)

  const isZip = url.endsWith(".zip")
  if (isZip) {
    const proc = Bun.spawnSync(["unzip", "-o", tarPath, "-d", dir])
    if (proc.exitCode !== 0) throw new Error("Failed to unzip llama.cpp")
  } else {
    const proc = Bun.spawnSync(["tar", "xzf", tarPath, "-C", dir])
    if (proc.exitCode !== 0) throw new Error("Failed to extract llama.cpp")
  }

  // Find the llama-server binary in extracted files
  const { readdir } = await import("fs/promises")
  const findBinary = async (searchDir: string): Promise<string | undefined> => {
    const entries = await readdir(searchDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(searchDir, entry.name)
      if (entry.isFile() && (entry.name === "llama-server" || entry.name === "llama-server.exe")) return fullPath
      if (entry.isDirectory()) {
        const found = await findBinary(fullPath)
        if (found) return found
      }
    }
  }

  const foundBin = await findBinary(dir)
  if (!foundBin) throw new Error("llama-server binary not found in archive")

  if (foundBin !== binPath) {
    const { copyFile } = await import("fs/promises")
    await copyFile(foundBin, binPath)
  }

  const { chmod } = await import("fs/promises")
  await chmod(binPath, 0o755)

  // Clean up archive
  const { unlink } = await import("fs/promises")
  await unlink(tarPath).catch(() => {})

  log.info("llama.cpp server ready", { path: binPath })
  return binPath
}

export async function ensureModel(): Promise<string> {
  const modPath = modelPath()
  const file = Bun.file(modPath)
  if (await file.exists()) return modPath

  const dir = offlineDir()
  const { mkdir } = await import("fs/promises")
  await mkdir(dir, { recursive: true })

  log.info("downloading offline model", { url: MODEL_URL, dest: modPath })

  const res = await fetch(MODEL_URL)
  if (!res.ok) throw new Error(`Failed to download model: ${res.status} ${res.statusText}`)

  await Bun.write(modPath, res)
  log.info("offline model ready", { path: modPath })
  return modPath
}

export async function start(
  onProgress?: (stage: string) => void,
): Promise<{ port: number }> {
  if (isRunning()) return { port: LLAMA_SERVER_PORT }
  if (starting) {
    // Wait for existing start to complete
    while (starting) await new Promise((r) => setTimeout(r, 200))
    if (isRunning()) return { port: LLAMA_SERVER_PORT }
  }

  starting = true
  try {
    onProgress?.("Downloading llama.cpp server...")
    const binPath = await ensureBinary()

    onProgress?.("Downloading offline model...")
    const modPath = await ensureModel()

    onProgress?.("Starting offline server...")
    serverProcess = Bun.spawn(
      [
        binPath,
        "--model", modPath,
        "--port", String(LLAMA_SERVER_PORT),
        "--host", "127.0.0.1",
        "--ctx-size", "4096",
        "--threads", String(Math.max(1, Math.min(os.cpus().length - 1, 4))),
        "--n-gpu-layers", "0",
        "--mlock",
        "--cont-batching",
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    )

    // Wait for server to be ready (health endpoint)
    const maxWait = 60_000
    const start = Date.now()
    while (Date.now() - start < maxWait) {
      try {
        const health = await fetch(`http://127.0.0.1:${LLAMA_SERVER_PORT}/health`)
        if (health.ok) {
          const body = await health.json() as { status?: string }
          if (body.status === "ok" || body.status === "no slot available") {
            log.info("offline server ready", { port: LLAMA_SERVER_PORT })
            return { port: LLAMA_SERVER_PORT }
          }
        }
      } catch {
        // Server not ready yet
      }
      if (serverProcess.exitCode !== null) {
        throw new Error("llama-server exited unexpectedly")
      }
      await new Promise((r) => setTimeout(r, 500))
    }
    throw new Error("Offline server failed to start within 60 seconds")
  } finally {
    starting = false
  }
}

export async function stop(): Promise<void> {
  if (!serverProcess) return
  log.info("stopping offline server")
  serverProcess.kill()
  serverProcess = undefined
}

export function baseURL(): string {
  return `http://127.0.0.1:${LLAMA_SERVER_PORT}/v1`
}
