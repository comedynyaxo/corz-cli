import { Config, ConfigProvider, Context, Effect, Layer } from "effect"
import { ConfigService } from "@/effect/config-service"

const bool = (name: string) => Config.boolean(name).pipe(Config.withDefault(false))
const experimental = bool("CORZ_EXPERIMENTAL")
const enabledByExperimental = (name: string) =>
  Config.all({ experimental, enabled: bool(name) }).pipe(Config.map((flags) => flags.experimental || flags.enabled))

export class Service extends ConfigService.Service<Service>()("@corz/RuntimeFlags", {
  pure: bool("CORZ_PURE"),
  disableDefaultPlugins: bool("CORZ_DISABLE_DEFAULT_PLUGINS"),
  enableExa: Config.all({
    experimental,
    enabled: bool("CORZ_ENABLE_EXA"),
    legacy: bool("CORZ_EXPERIMENTAL_EXA"),
  }).pipe(Config.map((flags) => flags.experimental || flags.enabled || flags.legacy)),
  enableParallel: Config.all({
    enabled: bool("CORZ_ENABLE_PARALLEL"),
    legacy: bool("CORZ_EXPERIMENTAL_PARALLEL"),
  }).pipe(Config.map((flags) => flags.enabled || flags.legacy)),
  enableQuestionTool: bool("CORZ_ENABLE_QUESTION_TOOL"),
  experimentalScout: enabledByExperimental("CORZ_EXPERIMENTAL_SCOUT"),
  experimentalLspTool: enabledByExperimental("CORZ_EXPERIMENTAL_LSP_TOOL"),
  experimentalPlanMode: enabledByExperimental("CORZ_EXPERIMENTAL_PLAN_MODE"),
  experimentalEventSystem: enabledByExperimental("CORZ_EXPERIMENTAL_EVENT_SYSTEM"),
  client: Config.string("CORZ_CLIENT").pipe(Config.withDefault("cli")),
}) {}

export type Info = Context.Service.Shape<typeof Service>

const emptyConfigLayer = Service.defaultLayer.pipe(
  Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown({}))),
  Layer.orDie,
)

export const layer = (overrides: Partial<Info> = {}) =>
  Layer.effect(
    Service,
    Effect.gen(function* () {
      const flags = yield* Service
      return Service.of({ ...flags, ...overrides })
    }),
  ).pipe(Layer.provide(emptyConfigLayer))

export const defaultLayer = Service.defaultLayer.pipe(Layer.orDie)

export * as RuntimeFlags from "./runtime-flags"
