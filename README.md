# Open URL in All Profiles

A Manifest V3 extension for Brave/Chromium. Enter a URL once and open it in multiple tabs in the **current browser profile**. You can also save labels and notes for other profiles.

## Current capabilities

- Opens a URL in 1–10 new tabs in the current Brave profile.
- Validates URLs and allows only HTTP/HTTPS.
- Optionally remembers the last URL locally.
- Saves profile labels and optional launch-command notes locally.
- Copies the current URL so it can be pasted into another profile.
- Does not access passwords, cookies, Gmail messages, or API keys.

## Important limitation: browser profiles

A regular extension runs inside one browser profile. It cannot directly create tabs inside other independently running Brave profiles. The **Other profile shortcuts** section stores labels/notes and helps copy the URL; it does not control other profiles.

For true one-click broadcasting across separate Brave profiles, the next step is a small native helper installed on your computer. That helper can start Brave with each profile's user-data directory and the provided URL. It should be restricted to local use, validate HTTP/HTTPS URLs, and avoid reading profile cookies or passwords.

Opening the same URL in multiple tabs inside one profile does **not** create different Google login sessions. If you need separate Google identities simultaneously, create distinct Brave profiles and sign into each account once.

## Install in Brave (developer mode)

1. Download or clone this repository to your computer.
2. Open brave://extensions.
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the repository folder containing manifest.json.
6. Pin **Open URL in All Profiles** from the Extensions menu.

After changes to the popup files, return to brave://extensions and click Reload on the extension card.

## Run locally from Git

    git clone https://github.com/hakimnouira/extension-open-all-profiles.git
    cd extension-open-all-profiles

No npm dependencies or build step are required.

## Permissions

- tabs: creates new tabs.
- storage: stores the optional last URL and profile shortcut notes.
- host_permissions: <all_urls> is declared in the initial manifest for possible future provider integrations; the current implementation does not inject scripts into pages. This permission can be removed during a hardening pass because the current implementation does not need it.

## Roadmap

- [ ] Native companion to launch a URL in selected Brave profiles.
- [ ] Profile discovery/configuration without reading browser secrets.
- [ ] Per-profile open status and error reporting.
- [ ] Configurable provider dashboard presets.
- [ ] Tests and CI validation.
