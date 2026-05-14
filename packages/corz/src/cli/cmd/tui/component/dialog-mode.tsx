import { createMemo, Show } from "solid-js"
import { useLocal } from "@tui/context/local"
import { DialogSelect } from "@tui/ui/dialog-select"
import { useDialog } from "@tui/ui/dialog"

export function DialogMode() {
  const local = useLocal()
  const dialog = useDialog()

  const options = createMemo(() => [
    {
      value: "online" as const,
      title: "Online",
      description: "Use cloud AI providers (requires internet)",
    },
    {
      value: "offline" as const,
      title: "Offline",
      description: "Use local llama.cpp model (no internet needed)",
    },
  ])

  return (
    <DialogSelect
      title="Select mode"
      current={local.mode.current()}
      options={options()}
      onSelect={(option) => {
        dialog.clear()
        void local.mode.setMode(option.value)
      }}
    />
  )
}
