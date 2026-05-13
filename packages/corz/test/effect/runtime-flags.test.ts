import { describe, expect } from "bun:test"
import { ConfigProvider, Effect, Layer } from "effect"
import { RuntimeFlags } from "../../src/effect/runtime-flags"
import { it } from "../lib/effect"

const fromConfig = (input: Record<string, unknown>) =>
  RuntimeFlags.defaultLayer.pipe(Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown(input))))

const readFlags = RuntimeFlags.Service.useSync((flags) => flags)

describe("RuntimeFlags", () => {
  it.effect("defaultLayer parses plugin flags from the active ConfigProvider", () =>
    Effect.gen(function* () {
      const flags = yield* readFlags.pipe(
        Effect.provide(
          fromConfig({
            CORZ_PURE: "true",
            CORZ_DISABLE_DEFAULT_PLUGINS: "true",
            CORZ_EXPERIMENTAL: "true",
            CORZ_ENABLE_EXA: "true",
            CORZ_ENABLE_PARALLEL: "true",
            CORZ_ENABLE_QUESTION_TOOL: "true",
            CORZ_CLIENT: "desktop",
          }),
        ),
      )

      expect(flags.pure).toBe(true)
      expect(flags.disableDefaultPlugins).toBe(true)
      expect(flags.enableExa).toBe(true)
      expect(flags.enableParallel).toBe(true)
      expect(flags.enableQuestionTool).toBe(true)
      expect(flags.experimentalScout).toBe(true)
      expect(flags.experimentalLspTool).toBe(true)
      expect(flags.experimentalPlanMode).toBe(true)
      expect(flags.experimentalEventSystem).toBe(true)
      expect(flags.client).toBe("desktop")
    }),
  )

  it.effect("layer accepts partial test overrides and fills defaults from Config definitions", () =>
    Effect.gen(function* () {
      const flags = yield* readFlags.pipe(Effect.provide(RuntimeFlags.layer({ disableDefaultPlugins: true })))

      expect(flags.pure).toBe(false)
      expect(flags.disableDefaultPlugins).toBe(true)
      expect(flags.enableExa).toBe(false)
      expect(flags.client).toBe("cli")
    }),
  )

  it.effect("layer ignores the active ConfigProvider for omitted test overrides", () =>
    Effect.gen(function* () {
      const flags = yield* readFlags.pipe(
        Effect.provide(RuntimeFlags.layer()),
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromUnknown({
              CORZ_PURE: "true",
              CORZ_DISABLE_DEFAULT_PLUGINS: "true",
              CORZ_EXPERIMENTAL: "true",
              CORZ_ENABLE_EXA: "true",
              CORZ_CLIENT: "desktop",
            }),
          ),
        ),
      )

      expect(flags.pure).toBe(false)
      expect(flags.disableDefaultPlugins).toBe(false)
      expect(flags.enableExa).toBe(false)
      expect(flags.client).toBe("cli")
    }),
  )
})
