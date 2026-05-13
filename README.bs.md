<p align="center">
  <a href="https://corz.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Corz logo">
    </picture>
  </a>
</p>
<p align="center">Corz je open source AI agent za programiranje.</p>
<p align="center">
  <a href="https://corz.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/corz-ai"><img alt="npm" src="https://img.shields.io/npm/v/corz-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/corz/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/corz/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![Corz Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://corz.ai)

---

### Instalacija

```bash
# YOLO
curl -fsSL https://corz.ai/install | bash

# Package manageri
npm i -g corz-ai@latest        # ili bun/pnpm/yarn
scoop install corz             # Windows
choco install corz             # Windows
brew install anomalyco/tap/corz # macOS i Linux (preporučeno, uvijek ažurno)
brew install corz              # macOS i Linux (zvanična brew formula, rjeđe se ažurira)
sudo pacman -S corz            # Arch Linux (Stable)
paru -S corz-bin               # Arch Linux (Latest from AUR)
mise use -g corz               # Bilo koji OS
nix run nixpkgs#corz           # ili github:anomalyco/corz za najnoviji dev branch
```

> [!TIP]
> Ukloni verzije starije od 0.1.x prije instalacije.

### Desktop aplikacija (BETA)

Corz je dostupan i kao desktop aplikacija. Preuzmi je direktno sa [stranice izdanja](https://github.com/anomalyco/corz/releases) ili sa [corz.ai/download](https://corz.ai/download).

| Platforma             | Preuzimanje                        |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `corz-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `corz-desktop-mac-x64.dmg`     |
| Windows               | `corz-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, ili AppImage       |

```bash
# macOS (Homebrew)
brew install --cask corz-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/corz-desktop
```

#### Instalacijski direktorij

Instalacijska skripta koristi sljedeći redoslijed prioriteta za putanju instalacije:

1. `$CORZ_INSTALL_DIR` - Prilagođeni instalacijski direktorij
2. `$XDG_BIN_DIR` - Putanja usklađena sa XDG Base Directory specifikacijom
3. `$HOME/bin` - Standardni korisnički bin direktorij (ako postoji ili se može kreirati)
4. `$HOME/.corz/bin` - Podrazumijevana rezervna lokacija

```bash
# Primjeri
CORZ_INSTALL_DIR=/usr/local/bin curl -fsSL https://corz.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://corz.ai/install | bash
```

### Agenti

Corz uključuje dva ugrađena agenta između kojih možeš prebacivati tasterom `Tab`.

- **build** - Podrazumijevani agent sa punim pristupom za razvoj
- **plan** - Agent samo za čitanje za analizu i istraživanje koda
  - Podrazumijevano zabranjuje izmjene datoteka
  - Traži dozvolu prije pokretanja bash komandi
  - Idealan za istraživanje nepoznatih codebase-ova ili planiranje izmjena

Uključen je i **general** pod-agent za složene pretrage i višekoračne zadatke.
Koristi se interno i može se pozvati pomoću `@general` u porukama.

Saznaj više o [agentima](https://corz.ai/docs/agents).

### Dokumentacija

Za više informacija o konfiguraciji Corz-a, [**pogledaj dokumentaciju**](https://corz.ai/docs).

### Doprinosi

Ako želiš doprinositi Corz-u, pročitaj [upute za doprinošenje](./CONTRIBUTING.md) prije slanja pull requesta.

### Gradnja na Corz-u

Ako radiš na projektu koji je povezan s Corz-om i koristi "corz" kao dio naziva, npr. "corz-dashboard" ili "corz-mobile", dodaj napomenu u svoj README da projekat nije napravio Corz tim i da nije povezan s nama.

### FAQ

#### Po čemu se razlikuje od Claude Code-a?

Po mogućnostima je vrlo sličan Claude Code-u. Ključne razlike su:

- 100% open source
- Nije vezan za jednog provajdera. Iako preporučujemo modele koje nudimo kroz [Corz Zen](https://corz.ai/zen), Corz možeš koristiti s Claude, OpenAI, Google ili čak lokalnim modelima. Kako modeli napreduju, razlike među njima će se smanjivati, a cijene padati, zato je nezavisnost od provajdera važna.
- LSP podrška odmah po instalaciji
- Fokus na TUI. Corz grade neovim korisnici i kreatori [terminal.shop](https://terminal.shop); pomjeraćemo granice onoga što je moguće u terminalu.
- Klijent/server arhitektura. To, recimo, omogućava da Corz radi na tvom računaru dok ga daljinski koristiš iz mobilne aplikacije, što znači da je TUI frontend samo jedan od mogućih klijenata.

---

**Pridruži se našoj zajednici** [Discord](https://discord.gg/corz) | [X.com](https://x.com/corz)
