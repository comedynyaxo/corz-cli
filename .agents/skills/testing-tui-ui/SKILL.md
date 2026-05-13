---
name: testing-tui-ui
description: Test Corz CLI TUI UI changes end-to-end. Use when verifying visual/layout/color changes to the terminal interface.
---

# Testing Corz CLI TUI UI Changes

## Environment Setup

1. Install dependencies: `cd /home/ubuntu/repos/corz-cli && bun install`
2. Start dev server in tmux: `tmux new-session -d -s corz-dev 'cd packages/corz && bun dev'`
3. The TUI runs inside the terminal emulator (Konsole). To interact with it visually, use the desktop/computer tools.
4. To capture TUI text output: `tmux capture-pane -pt corz-dev`
5. Stop when done: `tmux kill-session -t corz-dev`

## Testing Procedures

### Mode Indicator Colors
- The prompt footer shows `corz in build > [model]` or `corz in plan > [model]`
- Press **Tab** to switch between build and plan modes
- Agent colors are defined in `packages/corz/src/cli/cmd/tui/context/local.tsx` — the `colors` array index 0 = build, index 1 = plan
- Zoom into the prompt area to verify color differences between modes

### Command Palette (ctrl+p)
- Press **ctrl+p** to open the command palette
- Commands are grouped into sections: Suggested, Session, Agent, Provider, System
- Scroll down to see all sections — the System section is at the bottom
- Type in the search box to filter commands
- Press **Escape** to close

### Slash Commands
- Type `/` followed by a command name in the prompt input area
- An autocomplete dropdown appears above the input
- If no commands match, it shows "No matching items"

### Sidebar Visibility
- The sidebar (right panel) auto-shows when terminal width > 120 columns via the `wide()` memo
- To test sidebar removal, **maximize the terminal window** to ensure width exceeds 120 columns
- If sidebar code is removed, the session content should span full terminal width

### AI Response Verification
- Type a message and press Enter to send
- A spinner/dots animation appears at the bottom during processing ("esc interrupt")
- After response, check for: response text, model name, response time, context count in bottom-right

## Common Pitfalls

- **Stale TUI state**: If testing after code changes, kill the old tmux session and start fresh. The old session may cache previous UI state.
- **Terminal width**: Some UI features (like sidebar) depend on terminal width. Always maximize for consistent testing.
- **Input clearing**: Use Home → Shift+End → Backspace to clear the TUI prompt input, or ctrl+a → Backspace.
- **Recording**: When recording TUI tests, maximize the terminal window first using `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.

## Key Files

- Agent colors: `packages/corz/src/cli/cmd/tui/context/local.tsx`
- Prompt UI: `packages/corz/src/cli/cmd/tui/component/prompt/index.tsx`
- Session layout (sidebar): `packages/corz/src/cli/cmd/tui/routes/session/index.tsx`
- Commands/keybinds: `packages/corz/src/cli/cmd/tui/config/keybind.ts`
- App commands (palette): `packages/corz/src/cli/cmd/tui/app.tsx`
- Tips/hints: `packages/corz/src/cli/cmd/tui/feature-plugins/home/tips-view.tsx`
