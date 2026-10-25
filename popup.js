const $ = (id) => document.getElementById(id);
const urlInput = $("url");
const countInput = $("count");
const rememberInput = $("remember");
const status = $("status");
const profilesList = $("profiles");

function normalizeUrl(raw) {
  const value = raw.trim();
  if (!value) throw new Error("Enter a URL first.");
  let parsed;
  try { parsed = new URL(value); } catch { throw new Error("Enter a valid URL, including https://."); }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only http:// and https:// URLs are supported.");
  return parsed.href;
}
function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}
async function loadSaved() {
  const data = await chrome.storage.local.get(["lastUrl", "profileShortcuts"]);
  if (data.lastUrl) { urlInput.value = data.lastUrl; rememberInput.checked = true; }
  renderProfiles(data.profileShortcuts || []);
}
async function openTabs() {
  try {
    const url = normalizeUrl(urlInput.value);
    const count = Number(countInput.value);
    if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error("Choose between 1 and 10 tabs.");
    if (rememberInput.checked) await chrome.storage.local.set({lastUrl:url});
    else await chrome.storage.local.remove("lastUrl");
    for (let i = 0; i < count; i++) await chrome.tabs.create({url, active:i===0});
    showStatus(`Opened ${count} tab${count===1?"":"s"} in this Brave profile.`);
  } catch (error) { showStatus(error.message || "Could not open tabs.", true); }
}
async function addShortcut() {
  const name = $("profileName").value.trim();
  const command = $("profileCommand").value.trim();
  if (!name) { showStatus("Enter a name for the profile shortcut.", true); return; }
  const data = await chrome.storage.local.get("profileShortcuts");
  const shortcuts = data.profileShortcuts || [];
  shortcuts.push({id:crypto.randomUUID(),name,command});
  await chrome.storage.local.set({profileShortcuts:shortcuts});
  $("profileName").value = ""; $("profileCommand").value = "";
  renderProfiles(shortcuts);
  showStatus("Shortcut saved. Open the other profile and paste the URL there.");
}
function renderProfiles(shortcuts) {
  profilesList.replaceChildren();
  if (!shortcuts.length) {
    const empty = document.createElement("li"); empty.className = "help";
    empty.textContent = "No shortcuts saved yet."; profilesList.append(empty); return;
  }
  for (const item of shortcuts) {
    const li = document.createElement("li"); li.className = "profile-item";
    const copy = document.createElement("div"); copy.className = "profile-copy";
    const name = document.createElement("strong"); name.textContent = item.name;
    const details = document.createElement("small"); details.textContent = item.command || "No launch command saved";
    copy.append(name,details);
    const actions = document.createElement("div"); actions.className = "profile-actions";
    const copyUrl = document.createElement("button"); copyUrl.className = "secondary"; copyUrl.textContent = "Copy URL";
    copyUrl.addEventListener("click",async()=>{
      try { const url=normalizeUrl(urlInput.value); await navigator.clipboard.writeText(url); showStatus(`URL copied for ${item.name}. Open that profile and paste it.`); }
      catch(error){showStatus(error.message||"Could not copy URL.",true);}
    });
    const remove = document.createElement("button"); remove.className = "remove"; remove.textContent = "Remove";
    remove.addEventListener("click",async()=>{
      const latest=await chrome.storage.local.get("profileShortcuts");
      const filtered=(latest.profileShortcuts||[]).filter(entry=>entry.id!==item.id);
      await chrome.storage.local.set({profileShortcuts:filtered}); renderProfiles(filtered); showStatus("Shortcut removed.");
    });
    actions.append(copyUrl,remove); li.append(copy,actions); profilesList.append(li);
  }
}
$("open").addEventListener("click",openTabs);
$("addProfile").addEventListener("click",addShortcut);
urlInput.addEventListener("keydown",event=>{if(event.key==="Enter")openTabs();});
loadSaved().catch(()=>showStatus("Could not load saved settings.",true));
