import type {} from "@webflow/designer-extension-typings";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import cdnLoader from "../../webflow/navbar-light-cdn-loader.html";
import facebookSvg from "./icons/facebook.svg";
import instagramSvg from "./icons/instagram.svg";
import linkedinSvg from "./icons/linkedin.svg";
import tiktokSvg from "./icons/tiktok.svg";
import threadsSvg from "./icons/threads.svg";
import xSvg from "./icons/x.svg";
import whatsappSvg from "./icons/whatsapp.svg";
import telephoneSvg from "./icons/telephone.svg";
import emailSvg from "./icons/email.svg";

const PROOF_NAME = "SmashBurger API proof";
const LAB_PAGE_SLUG = "smashburger-app-api-lab";
const CORE_NAME = "SmashBurger native core trial";
const ALPHA_NAME = "SmashBurger native alpha";
const ALPHA_DESTINATION_GROUPS: ReadonlyArray<{ title: string; names: ReadonlyArray<string> }> = [
  { title: "Main navigation", names: ["Brand destination", "Link 1 destination", "Link 2 destination", "Link 3 destination", "CTA destination"] },
  { title: "Submenu", names: ["Submenu link 1 destination", "Submenu link 2 destination"] },
  { title: "Social links", names: ["Facebook destination", "Instagram destination", "LinkedIn destination", "TikTok destination", "Threads destination", "X destination", "WhatsApp destination"] },
  { title: "Contact links", names: ["Telephone destination", "Email destination"] },
];
const ALPHA_DESTINATION_NAMES = ALPHA_DESTINATION_GROUPS.flatMap((group) => [...group.names]);
async function isCoreTargetPage(alpha: boolean, siteName: string, page: Page): Promise<boolean> {
  return alpha ? page.isDraft() : siteName === "Smashburger" && await page.getSlug() === LAB_PAGE_SLUG;
}
const FACEBOOK_ASSET_ID = "6a7e4cb1eafcdf0550a61dc6";
const ICON_SOURCES = {
  facebook: facebookSvg, instagram: instagramSvg, linkedin: linkedinSvg,
  tiktok: tiktokSvg, threads: threadsSvg, x: xSvg,
  whatsapp: whatsappSvg, telephone: telephoneSvg, email: emailSvg,
} as const;
const CORE_DISPLAY_BRIDGE_V1 = `<style>
.sb-app-nav[data-collapse="always"] .sb-app-menu,
.sb-app-nav[data-mwp-collapsed="true"] .sb-app-menu { display: block; }
</style>`;
const CORE_EMBED_CODE_V1 = `${CORE_DISPLAY_BRIDGE_V1}\n${cdnLoader}`;
const CORE_DISPLAY_BRIDGE_V2 = `<style>
.sb-app-nav[data-collapse="always"] .sb-app-menu,
.sb-app-nav[data-mwp-collapsed="true"] .sb-app-menu { display: block; }
.sb-app-nav .sb-app-infrastructure { display: none; }
</style>`;
const CORE_EMBED_CODE_V2 = `${CORE_DISPLAY_BRIDGE_V2}\n${cdnLoader}`;
const CORE_VARIANT_BRIDGE = `<script>
(() => {
  const root = document.currentScript?.closest('[data-mwp-navbar]');
  if (!root || root.getAttribute('data-collapse')?.trim()) return;
  const marker = root.getAttributeNames().find((name) => /^data-wf--.+--variant$/.test(name));
  const value = marker && root.getAttribute(marker);
  if (['never', 'tablet', 'mobile-landscape', 'mobile-portrait', 'always'].includes(value)) {
    root.setAttribute('data-collapse', value);
  }
})();
</script>`;
const CORE_EMBED_CODE_V3 = `${CORE_DISPLAY_BRIDGE_V2}\n${CORE_VARIANT_BRIDGE}\n${cdnLoader}`;
const CORE_DISPLAY_BRIDGE_V4 = `<style>
.sb-app-nav[data-collapse="always"] .sb-app-menu,
.sb-app-nav[data-mwp-collapsed="true"] .sb-app-menu { display: block; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-inner { flex-wrap: nowrap; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-menu { display: none; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-panel { flex-basis: auto; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-links { flex-direction: row; align-items: center; }
.sb-app-nav .sb-app-infrastructure { display: none; }
</style>`;
const CORE_EMBED_CODE_V4 = `${CORE_DISPLAY_BRIDGE_V4}\n${CORE_VARIANT_BRIDGE}\n${cdnLoader}`;
const CORE_DISPLAY_BRIDGE_V5 = CORE_DISPLAY_BRIDGE_V4.replace(
  "</style>",
  '.sb-app-nav[data-mwp-collapsed="false"] .sb-app-secondary-icon { filter: brightness(0) invert(1); }\n</style>',
);
const CORE_EMBED_CODE_V5 = `${CORE_DISPLAY_BRIDGE_V5}\n${CORE_VARIANT_BRIDGE}\n${cdnLoader}`;
const CORE_DISPLAY_BRIDGE_V6 = CORE_DISPLAY_BRIDGE_V5.replace(
  "</style>",
  '.sb-app-nav [data-mwp-submenu]:not([open]) > [data-mwp-submenu-list] { display: none; }\n.sb-app-nav [data-mwp-submenu][open] [data-mwp-submenu-icon] { transform: rotate(var(--mwp-nav-submenu-icon-rotation, 180deg)); }\n.sb-app-nav[data-mwp-collapsed="true"] [data-mwp-submenu-list] { position: static; box-shadow: none; }\n</style>',
);
const CORE_EMBED_CODE_V6 = `${CORE_DISPLAY_BRIDGE_V6}\n${CORE_VARIANT_BRIDGE}\n${cdnLoader}`;
const CORE_DISPLAY_BRIDGE = CORE_DISPLAY_BRIDGE_V6.replace(
  "</style>",
  '.sb-app-nav[data-mwp-collapsed="true"]:is([data-layout="dropdown"], [data-layout="full-width"]):is([data-state="opening"], [data-state="open"]) [data-mwp-backdrop] { opacity: 1; pointer-events: auto; transition-delay: 0s; visibility: visible; }\n</style>',
);
const CORE_EMBED_CODE = `${CORE_DISPLAY_BRIDGE}\n${CORE_VARIANT_BRIDGE}\n${cdnLoader}`;
const CORE_PROPERTIES: CreatePropOptions[] = [
  { type: "string", name: "Collapse breakpoint", group: "Behavior", defaultValue: "", tooltip: "Leave blank to follow the selected variant; enter never, tablet, mobile-landscape, mobile-portrait, or always to override it" },
  { type: "string", name: "Menu layout", group: "Layout", defaultValue: "dropdown", tooltip: "dropdown, full-width, left, right, or overlay" },
  { type: "string", name: "Menu motion", group: "Motion", defaultValue: "dropdown", tooltip: "dropdown, left, right, up, fade, none, or custom" },
  { type: "string", name: "Panel alignment", group: "Layout", defaultValue: "right", tooltip: "left, center, or right" },
  { type: "string", name: "Panel width", group: "Layout", defaultValue: "24rem", tooltip: "CSS width for drawers and dropdowns, for example 24rem" },
  { type: "string", name: "Focus first link", group: "Behavior", defaultValue: "false", tooltip: "true or false" },
  { type: "string", name: "Close on outside click", group: "Behavior", defaultValue: "true", tooltip: "true or false" },
  { type: "string", name: "Close on link click", group: "Behavior", defaultValue: "true", tooltip: "true or false" },
  { type: "string", name: "Lock page scroll", group: "Behavior", defaultValue: "auto", tooltip: "auto, true, or false" },
  { type: "string", name: "Brand accessible label", group: "Accessibility", defaultValue: "SmashBurger home" },
  { type: "string", name: "Menu button label", group: "Accessibility", defaultValue: "Navigation menu" },
  { type: "string", name: "Navigation label", group: "Accessibility", defaultValue: "Primary navigation" },
];

type Snapshot = {
  site: string;
  selected: string;
  breakpoints: string[];
  component: string;
  origin: string;
  variants: string[];
  propertyCount: number;
  propertyGroups: string[];
  overrides: string[];
  marker: string;
  hooks: string[];
  adoption: string;
  canAppend: boolean;
  proofExists: boolean;
  nativeCoreExists: boolean;
  whtml: boolean;
};

async function inspect(): Promise<Snapshot> {
  const [site, queries, selected, components] = await Promise.all([
    webflow.getSiteInfo(), webflow.getAllMediaQueries(),
    webflow.getSelectedElement(), webflow.getAllComponents(),
  ]);
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = selected?.type === "ComponentInstance" ? await selected.getComponent() : null;
  const [variants, props] = component
    ? await Promise.all([component.getVariants(), component.getProps()])
    : [[], []];
  const instanceProps = selected?.type === "ComponentInstance" ? await selected.getProps() : [];
  const marker = selected?.attributes
    ? await selected.getResolvedAttributeValue("data-mwp-navbar") : null;
  let whtml: string | null = null;
  if (selected && webflow.getWHTML) {
    try { whtml = (await webflow.getWHTML(selected))?.whtml ?? null; }
    catch { whtml = null; }
  }
  const hooks = ["navbar", "menu", "trigger", "panel", "backdrop", "config"]
    .filter((hook) => whtml?.includes(`data-mwp-${hook}`));
  const propNames = new Map(props.map((prop) => [prop.id, prop.name]));
  const adoption = component?.library
    ? "Linked Library instance: preserve overrides before making a project-native copy. No conversion is performed here."
    : marker !== null
      ? "Native navbar root: inspect its structure and content before converting it to a project component."
      : component
        ? "Project component: inspect its editable root and bindings before changing it."
        : "Select a SmashBurger instance or native navbar root for an adoption assessment.";
  return {
    site: site.siteName,
    selected: selected ? selected.type : "Nothing selected",
    breakpoints: queries.map((query) => `${query.name} (${query.id})`),
    component: component ? await component.getName() : "Native or none",
    origin: component ? component.library ? "Linked Library" : component.readOnly ? "Read-only" : "Project-native" : "—",
    variants: variants.map((variant) => variant.name),
    propertyCount: props.length,
    propertyGroups: [...new Set(props.map((prop) => prop.group || "Ungrouped"))],
    overrides: instanceProps.filter((prop) => prop.hasOverride)
      .map((prop) => propNames.get(prop.propId) || prop.propId),
    marker: marker ?? "Not on selected element",
    hooks,
    adoption,
    canAppend: Boolean(selected?.children),
    proofExists: names.includes(PROOF_NAME),
    nativeCoreExists: names.includes(CORE_NAME),
    whtml: Boolean(whtml),
  };
}

async function checkAssetAccess(): Promise<string> {
  const site = await webflow.getSiteInfo();
  if (site.siteName !== "Smashburger") {
    throw new Error("Open the Smashburger site before checking its assets.");
  }
  const permissions = await webflow.canForAppMode([
    webflow.appModes.canAccessAssets,
    webflow.appModes.canManageAssets,
  ]);
  let listed: string;
  try {
    const assets = await webflow.getAllAssets();
    listed = String(assets.length);
  } catch (error) {
    listed = `error (${String(error)})`;
  }
  let known: string;
  try {
    const asset = await webflow.getAssetById(FACEBOOK_ASSET_ID);
    known = asset ? `${asset.id}: ${await asset.getName()}` : "null";
  } catch (error) {
    known = `error (${String(error)})`;
  }
  return `Asset access: canAccessAssets=${permissions.canAccessAssets}; canManageAssets=${permissions.canManageAssets}; getAllAssets=${listed}; known Facebook asset=${known}. Read-only check.`;
}

type InstallReadiness = { siteName: string; pageSlug: string; blockers: string[]; visibleIcons: number; body: AnyElement | undefined };

async function inspectInstallReadiness(): Promise<InstallReadiness> {
  const [site, page, queries, components, elements, assets, permissions] = await Promise.all([
    webflow.getSiteInfo(), webflow.getCurrentPage(), webflow.getAllMediaQueries(),
    webflow.getAllComponents(), webflow.getAllElements(), webflow.getAllAssets(),
    webflow.canForAppMode([webflow.appModes.canAccessAssets, webflow.appModes.canManageAssets]),
  ]);
  const [slug, draft, componentNames, assetNames] = await Promise.all([
    page.getSlug(), page.isDraft(), Promise.all(components.map((item) => item.getName())),
    Promise.all(assets.map((item) => item.getName())),
  ]);
  const blockers: string[] = [];
  if (!draft) blockers.push("current page is not a draft");
  const body = elements.find((item) => item.type === "Body" && item.children);
  if (!body) blockers.push("editable Body not found");
  const existingComponents = componentNames.filter((name) => /^SmashBurger(?:\b|\s)/i.test(name));
  if (existingComponents.length) blockers.push(`existing SmashBurger components: ${existingComponents.join(", ")}`);
  let existingRoot = false;
  for (const item of elements) {
    if (item.attributes && await item.getResolvedAttributeValue("data-mwp-navbar") !== null) {
      existingRoot = true;
      break;
    }
  }
  if (existingRoot) blockers.push("current page already has a marked navbar root");
  const breakpointIds = new Set(queries.map((query) => query.id));
  const missingBreakpoints = (["medium", "small", "tiny"] as BreakpointId[]).filter((id) => !breakpointIds.has(id));
  if (missingBreakpoints.length) blockers.push(`missing responsive breakpoints: ${missingBreakpoints.join(", ")}`);
  if (!permissions.canAccessAssets || !permissions.canManageAssets) blockers.push("asset access or management permission unavailable");
  const bundledNames = Object.keys(ICON_SOURCES).map((key) => `SmashBurger App — ${key} icon.svg`);
  const duplicates = bundledNames.filter((name) => assetNames.filter((candidate) => candidate === name).length > 1);
  if (duplicates.length) blockers.push(`duplicate bundled asset names: ${duplicates.join(", ")}`);
  const existingIcons = bundledNames.filter((name) => assetNames.includes(name)).length;
  return { siteName: site.siteName, pageSlug: slug, blockers, visibleIcons: existingIcons, body };
}

async function checkInstallReadiness(): Promise<string> {
  const result = await inspectInstallReadiness();
  const status = result.blockers.length ? `Preflight needs attention: ${result.blockers.join("; ")}` : "Preflight checks passed";
  return `${status}. Site=${result.siteName}; page=${result.pageSlug}; app-visible bundled icons=${result.visibleIcons}/9. This check is read-only.`;
}

async function checkAlphaLinkDefaults(): Promise<string> {
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component) return "No SmashBurger native alpha component found on this site. Read-only check.";
  const root = await component.getRootElement();
  if (!root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha marker has changed; link defaults cannot be audited.");
  }
  const props = await component.getProps();
  const missing: string[] = [];
  const placeholders: string[] = [];
  for (const name of ALPHA_DESTINATION_NAMES) {
    const prop = props.find((item) => item.name === name && item.type === "link");
    if (!prop) { missing.push(name); continue; }
    const value = prop.defaultValue;
    if (value && typeof value === "object" && "mode" in value && value.mode === "url" &&
      "to" in value && (value.to === "#" || value.to === "")) placeholders.push(name);
  }
  return `Alpha link defaults: ${ALPHA_DESTINATION_NAMES.length - missing.length}/${ALPHA_DESTINATION_NAMES.length} properties found; ${placeholders.length} placeholder destinations (# or empty). ${missing.length ? `Missing: ${missing.join(", ")}. ` : ""}${placeholders.length ? `Placeholders: ${placeholders.join(", ")}. ` : ""}Component defaults only; instance overrides are not checked. Read-only check.`;
}

async function checkSelectedAlphaLinks(): Promise<string> {
  const selected = await webflow.getSelectedElement();
  if (selected?.type !== "ComponentInstance") {
    return "Select the installed SmashBurger native alpha component instance, then run this read-only check.";
  }
  const component = await selected.getComponent();
  if (await component.getName() !== ALPHA_NAME) {
    return "The selected instance is not SmashBurger native alpha. Read-only check.";
  }
  const root = await component.getRootElement();
  if (!root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha marker has changed; instance links cannot be audited.");
  }
  const [props, summaries, resolved] = await Promise.all([
    component.getProps(), selected.getProps(), selected.getResolvedProps(),
  ]);
  const placeholders: string[] = [];
  const overrides: string[] = [];
  const unresolved: string[] = [];
  const otherValues: string[] = [];
  for (const name of ALPHA_DESTINATION_NAMES) {
    const prop = props.find((item) => item.name === name && item.type === "link");
    if (!prop) { unresolved.push(name); continue; }
    if (summaries.find((item) => item.propId === prop.id)?.hasOverride) overrides.push(name);
    const value = resolved.find((item) => item.propId === prop.id)?.value;
    if (!value || typeof value !== "object" || !("mode" in value)) { unresolved.push(name); continue; }
    if (value.mode === "url" && (value.to === "#" || value.to === "" || !value.to)) placeholders.push(name);
    else otherValues.push(name);
  }
  return `Selected alpha instance: ${placeholders.length} placeholder destination(s), ${otherValues.length} other value(s), ${overrides.length} overridden link(s), ${unresolved.length} unresolved link(s). ${otherValues.length ? `Other values: ${otherValues.join(", ")}. ` : ""}${overrides.length ? `Overrides: ${overrides.join(", ")}. ` : ""}${placeholders.length ? `Placeholders: ${placeholders.join(", ")}. ` : ""}${unresolved.length ? `Unresolved: ${unresolved.join(", ")}. ` : ""}Read only; non-placeholder values may still be test URLs. No navigation or publication tested.`;
}

async function loadAlphaLinkDefaults(): Promise<Record<string, string>> {
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  const root = await component?.getRootElement();
  if (!component || component.library || component.readOnly || !root?.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The editable native alpha component is unavailable; no defaults were loaded.");
  }
  const props = await component.getProps();
  const values: Record<string, string> = {};
  for (const name of ALPHA_DESTINATION_NAMES) {
    const prop = props.find((item) => item.name === name && item.type === "link");
    if (!prop) throw new Error(`Missing ${name}; no defaults were loaded.`);
    const value = prop.defaultValue;
    values[name] = value && typeof value === "object" && "mode" in value && value.mode === "url" &&
      "to" in value && typeof value.to === "string" ? value.to : "";
  }
  return values;
}

async function selectedAlphaLinkOverrides(): Promise<string[] | null> {
  const selected = await webflow.getSelectedElement();
  if (selected?.type !== "ComponentInstance") return null;
  const component = await selected.getComponent();
  if (await component.getName() !== ALPHA_NAME) return null;
  const [props, summaries] = await Promise.all([component.getProps(), selected.getProps()]);
  return ALPHA_DESTINATION_NAMES.filter((name) => {
    const prop = props.find((item) => item.name === name && item.type === "link");
    return prop && summaries.some((item) => item.propId === prop.id && item.hasOverride);
  });
}

function normalizedDestination(input: string): string {
  const value = input.trim();
  if (value === "" || value === "#") throw new Error("Enter a real destination, not an empty value or #.");
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  if (/^#[a-z][\w-]*$/i.test(value)) return value;
  if (/^(mailto:[^\s@]+@[^\s@]+|tel:\+?[\d\s().-]{3,})$/i.test(value)) return value;
  const absolute = /^[\w-]+\.[\w.-]+(?:\/[^\s]*)?$/i.test(value) ? `https://${value}` : value;
  try {
    const url = new URL(absolute);
    if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname) return url.href;
  } catch { /* The error below explains the accepted formats. */ }
  throw new Error(`Invalid destination ${JSON.stringify(value)}. Use /page, https://example.com, mailto:, or tel:.`);
}

async function saveAlphaLinkDefaults(changes: Record<string, string>, report: (message: string) => void): Promise<string> {
  const entries = Object.entries(changes).filter(([name]) => ALPHA_DESTINATION_NAMES.includes(name));
  if (!entries.length) return "No link defaults were changed.";
  const normalized = entries.map(([name, value]) => ({ name, to: normalizedDestination(value) }));
  const [site, page] = await Promise.all([webflow.getSiteInfo(), webflow.getCurrentPage()]);
  const [slug, draft] = await Promise.all([page.getSlug(), page.isDraft()]);
  const publishedFixture = ["Disposable Testing Site", "another disposable site"].includes(site.siteName) && slug === "sb-test";
  if (!draft && !publishedFixture) {
    throw new Error(`Open the installed alpha's draft page or a disposable /sb-test fixture (current: ${site.siteName}/${slug}); no defaults were changed.`);
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  const root = await component?.getRootElement();
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1 ||
    !root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("Expected one editable marked alpha component; no defaults were changed.");
  }
  const pageInstances = (await webflow.getAllElements()).filter((item) => item.type === "ComponentInstance");
  const pageComponentIds = await Promise.all(pageInstances.map(async (item) => (await item.getComponent()).id));
  if (pageComponentIds.filter((id) => id === component.id).length !== 1) {
    throw new Error("The current page must contain the one installed alpha instance; no defaults were changed.");
  }
  const props = await component.getProps();
  const targets = normalized.map(({ name, to }) => {
    const prop = props.find((item) => item.name === name && item.type === "link");
    if (!prop) throw new Error(`Missing ${name}; no defaults were changed.`);
    return { prop, name, to };
  });
  const savedNames: string[] = [];
  for (const { prop, name, to } of targets) {
    report(`Saving ${name} (${savedNames.length + 1}/${targets.length})…`);
    const previous = prop.defaultValue;
    const openInNewTab = previous && typeof previous === "object" && "openInNewTab" in previous &&
      typeof previous.openInNewTab === "boolean" ? previous.openInNewTab : undefined;
    try {
      await component.setProp(prop.id, { defaultValue: { mode: "url", to, ...(openInNewTab === undefined ? {} : { openInNewTab }) } });
      const saved = (await component.getProps()).find((item) => item.id === prop.id)?.defaultValue;
      if (!saved || typeof saved !== "object" || !("mode" in saved) || saved.mode !== "url" ||
        !("to" in saved) || saved.to !== to) throw new Error("default did not pass readback");
      savedNames.push(name);
    } catch (error) {
      throw new Error(`${name} stopped after ${savedNames.length} saved default(s): ${describeError(error)}. Inspect before retrying.`);
    }
  }
  return `Saved ${savedNames.length} alpha link default(s): ${savedNames.join(", ")}. Instance overrides may still take precedence; Preview and published navigation are not verified.`;
}

async function updateAlphaBackdrop(): Promise<string> {
  const [site, page, components, elements] = await Promise.all([
    webflow.getSiteInfo(), webflow.getCurrentPage(), webflow.getAllComponents(), webflow.getAllElements(),
  ]);
  const [slug, draft, names] = await Promise.all([
    page.getSlug(), page.isDraft(), Promise.all(components.map((item) => item.getName())),
  ]);
  const publishedFixture = ["Disposable Testing Site", "another disposable site"].includes(site.siteName) && slug === "sb-test";
  if (!draft && !publishedFixture) throw new Error("Open the alpha draft page or a disposable /sb-test fixture; no Embed was changed.");
  const component = components[names.indexOf(ALPHA_NAME)];
  const root = await component?.getRootElement();
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1 ||
    !root?.children || !root.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("Expected one editable marked alpha component; no Embed was changed.");
  }
  const pageInstances = elements.filter((item) => item.type === "ComponentInstance");
  const pageComponentIds = await Promise.all(pageInstances.map(async (item) => (await item.getComponent()).id));
  if (pageComponentIds.filter((id) => id === component.id).length !== 1) {
    throw new Error("The current page must contain the one installed alpha instance; no Embed was changed.");
  }
  const children = await root.getChildren();
  let infrastructure: AnyElement | undefined;
  for (const child of children) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-infrastructure") !== null) {
      infrastructure = child;
      break;
    }
  }
  const infrastructureChildren = infrastructure?.children ? await infrastructure.getChildren() : [];
  const embeds = [...children, ...infrastructureChildren].filter((item) => item.type === "HtmlEmbed");
  if (embeds.length !== 1 || !embeds[0].elementSettings) {
    throw new Error("Expected exactly one alpha runtime Embed; no code was changed.");
  }
  const embed = embeds[0];
  const code = (await embed.getSettings()).code;
  if (code !== CORE_EMBED_CODE_V6 && code !== CORE_EMBED_CODE) {
    throw new Error("The alpha Embed differs from the known version; no code was replaced.");
  }
  if (code === CORE_EMBED_CODE) return "Alpha backdrop rules already current; no Embed was changed.";
  await embed.setSettings({ code: CORE_EMBED_CODE });
  if ((await embed.getSettings()).code !== CORE_EMBED_CODE) {
    throw new Error("Alpha backdrop Embed did not pass readback; inspect before retrying.");
  }
  return "Alpha backdrop rules saved and read back. Dropdown and Full width now show the backdrop when enabled; Preview behavior remains unverified. Automatic scroll lock remains limited to drawers and overlay.";
}

async function addScrollTestContent(): Promise<string> {
  const [site, page, elements] = await Promise.all([
    webflow.getSiteInfo(), webflow.getCurrentPage(), webflow.getAllElements(),
  ]);
  const slug = await page.getSlug();
  if (!["Disposable Testing Site", "another disposable site"].includes(site.siteName) || slug !== "sb-test") {
    throw new Error("Open /sb-test on a disposable site; no content was added.");
  }
  for (const element of elements) {
    if (element.attributes && await element.getResolvedAttributeValue("data-sb-scroll-test") !== null) {
      return "Scroll test content already exists on this page; no duplicate was added.";
    }
  }
  const body = elements.find((element) => element.type === "Body" && element.children);
  if (!body?.children) throw new Error("The page Body is unavailable; no content was added.");
  const [sectionStyle, titleStyle, endStyle] = await Promise.all([
    style("sb-app-scroll-test"), style("sb-app-scroll-test-title"), style("sb-app-scroll-test-end"),
  ]);
  await sectionStyle.setProperties({ display: "flex", "flex-direction": "column", "justify-content": "space-between", "min-height": "220vh", "padding-top": "48px", "padding-bottom": "48px", "padding-left": "24px", "padding-right": "24px", "background-color": "#f5f4ef", color: "#17251e" });
  await titleStyle.setProperties({ "font-size": "24px", "font-weight": "700", "line-height": "1.2" });
  await endStyle.setProperties({ "font-size": "16px", "line-height": "1.4" });
  const section = await body.append(webflow.elementPresets.DOM);
  await section.setAttribute("data-sb-scroll-test", "");
  await section.setTag("section");
  await section.setStyles([sectionStyle]);
  const title = await section.append(webflow.elementPresets.DOM);
  await title.setTag("h1");
  await title.setStyles([titleStyle]);
  await title.setTextContent("Scroll test: menu backdrop");
  const end = await section.append(webflow.elementPresets.DOM);
  await end.setTag("p");
  await end.setStyles([endStyle]);
  await end.setTextContent("End of scroll test area");
  const saved = (await webflow.getAllElements()).find((element) => element.id.element === section.id.element);
  if (!saved?.attributes || await saved.getResolvedAttributeValue("data-sb-scroll-test") === null) {
    throw new Error("Scroll test content was added but did not pass readback; inspect the page before retrying.");
  }
  return "Scroll test content added below the menu: a 220vh native section with visible start and end markers. Preview is ready for the Dropdown scroll check.";
}

async function installNativeAlpha(report: (message: string) => void): Promise<string> {
  const readiness = await inspectInstallReadiness();
  if (readiness.blockers.length) {
    throw new Error(`Install preflight needs attention: ${readiness.blockers.join("; ")}. No element or component was created.`);
  }
  report(`Building one native alpha component on draft page ${readiness.pageSlug}…`);
  await createNativeCore(report, true);
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  const root = await component?.getRootElement();
  if (!component || component.library || component.readOnly || !root?.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha was created but its project component did not pass readback.");
  }
  return `Native alpha core created on draft page ${readiness.pageSlug}: one editable project component with a pinned runtime. This is an incomplete installation fixture; inspect Canvas before adding more content.`;
}

async function expandNativeAlpha(report: (message: string) => void): Promise<string> {
  const page = await webflow.getCurrentPage();
  if (!await page.isDraft()) throw new Error("Open the draft page containing the native alpha component.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native alpha instance; no expansion was started.");
  }
  const root = await component.getRootElement();
  if (!root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha root marker changed; no expansion was started.");
  }
  report("Adding primary navigation and editable content…");
  await configureNativePrimary(report, true);
  await configureNativeContent(report, true);
  await bindAlphaCtaContent(report);
  await bindAlphaMenuLabel();
  report("Adding secondary links and submenu…");
  await configureNativeSecondary(report, true);
  await configureNativeSubmenu(report, true);
  await configureNativeSubmenuProperties(report, true);
  report("Binding motion and visibility controls…");
  await configureNativeMotion(report, true);
  await bindSecondaryVisibility(report, true);
  const saved = await component.getProps();
  const required = ["Show CTA", "CTA text", "CTA destination", "Menu label", "Brand text", "Facebook destination", "Show secondary navigation", "Submenu link 1 text", "Distance"];
  const missing = required.filter((name) => !saved.some((prop) => prop.name === name));
  if (missing.length) throw new Error(`Native alpha expansion is missing ${missing.join(", ")}; inspect before retrying.`);
  return `Native alpha expanded: primary links and CTA, nine text-only secondary links, submenu and grouped controls saved. Demo destinations still use #; configure them before publishing. Icons, full variants and published checks remain pending. Properties=${saved.length}.`;
}

async function repairAlphaCollapseDefault(): Promise<string> {
  const page = await webflow.getCurrentPage();
  if (!await page.isDraft()) throw new Error("Open the draft page containing the native alpha component.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native alpha instance; no default was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha root marker changed; no default was changed.");
  }
  const variants = await component.getVariants();
  if (variants.length !== 1) throw new Error("Collapse variants already exist; inspect the selected variant before changing its default.");
  const props = await component.getProps();
  const collapse = props.find((prop) => prop.name === "Collapse breakpoint" && prop.type === "string");
  if (!collapse || !root.attributes || !isBoundTo(await root.getAttributeValue("data-collapse"), collapse.id)) {
    throw new Error("Collapse breakpoint binding changed; no default was changed.");
  }
  if (collapse.defaultValue !== "" && collapse.defaultValue !== "tablet") {
    throw new Error(`Collapse breakpoint is ${JSON.stringify(collapse.defaultValue)}; no default was replaced.`);
  }
  if (collapse.defaultValue === "") await component.setProp(collapse.id, { defaultValue: "tablet" });
  const saved = await component.getProps();
  if (saved.find((prop) => prop.id === collapse.id)?.defaultValue !== "tablet") {
    throw new Error("Tablet collapse default did not pass readback.");
  }
  return "Native alpha default repaired: Collapse breakpoint=tablet. Refresh Preview and check the 820px trigger, then return to desktop to confirm horizontal links.";
}

async function inspectAlphaVariantState(): Promise<string> {
  const page = await webflow.getCurrentPage();
  if (!await page.isDraft()) throw new Error("Open the draft page containing the native alpha component.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.library || component.readOnly) throw new Error("The editable native alpha component is unavailable.");
  const [variants, props, root] = await Promise.all([component.getVariants(), component.getProps(), component.getRootElement()]);
  const collapse = props.find((prop) => prop.name === "Collapse breakpoint" && prop.type === "string");
  const marker = root?.attributes ? await root.getResolvedAttributeValue("data-mwp-prototype") : null;
  return `Alpha variant state: ${variants.map((variant) => `${variant.name}=${variant.id}`).join(", ")}; collapse default=${JSON.stringify(collapse?.defaultValue)}; root marker=${marker ?? "missing"}; instances=${await component.getInstanceCount()}. Read-only.`;
}

async function configureAlphaVariants(report: (message: string) => void): Promise<string> {
  report("Creating the five native alpha collapse variants…");
  await configureCoreVariants(true);
  report("Binding the alpha variant marker to the pinned runtime…");
  await activateCoreVariants(true);
  report("Styling the alpha variants at their responsive thresholds…");
  await styleCoreVariants(true);
  return "Native alpha variants saved: Never, Tablet, Mobile landscape, Mobile portrait and Always, with variant-aware collapse and responsive Canvas styles. Check all five in Preview before publishing.";
}

async function installCompleteAlpha(report: (message: string) => void): Promise<string> {
  const readiness = await inspectInstallReadiness();
  if (readiness.blockers.length) {
    throw new Error(`Install preflight needs attention: ${readiness.blockers.join("; ")}. No element or component was created.`);
  }
  let phase = 0;
  try {
    phase = 1;
    report("Phase 1/4: creating the native alpha core…");
    await installNativeAlpha(report);
    phase = 2;
    report("Phase 2/4: adding editable links and controls…");
    await expandNativeAlpha(report);
    phase = 3;
    report("Phase 3/4: installing bundled icon Images and assets…");
    await installAlphaIcons(report);
    phase = 4;
    report("Phase 4/4: configuring five collapse variants…");
    await configureAlphaVariants(report);
  } catch (error) {
    throw new Error(`Phase ${phase}/4 stopped: ${describeError(error)}`);
  }
  return `Native alpha installed on draft page ${readiness.pageSlug}: core, content, nine icons and five collapse variants passed Designer readback. Its 16 demo link destinations still use #; configure them and check Canvas and Preview before publishing.`;
}

async function probeAssetUpload(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before testing asset upload.");
  }
  const proofName = "SmashBurger bundled Facebook proof 542.svg";
  const prior = await webflow.getAllAssets();
  const priorNames = await Promise.all(prior.map((item) => item.getName()));
  const existing = prior[priorNames.indexOf(proofName)];
  if (existing) {
    const byIdFound = Boolean(await webflow.getAssetById(existing.id).catch(() => null));
    return `Upload proof reused: id=${existing.id}; getAssetById=${byIdFound ? "found" : "null"}; getAllAssets=${prior.length}. This disposable site asset should be removed after independent readback.`;
  }
  const file = new File([ICON_SOURCES.facebook], proofName, { type: "image/svg+xml" });
  const asset = await webflow.createAsset(file).catch((error: unknown) => {
    throw new Error(`createAsset failed: ${describeError(error)}`);
  });
  const name: string = await asset.getName().catch((error: unknown) => `error: ${describeError(error)}`);
  const byIdFound = Boolean(await webflow.getAssetById(asset.id).catch(() => null));
  const allCount = (await webflow.getAllAssets().catch((): Asset[] => [])).length;
  return `Upload proof created: id=${asset.id}; name=${name}; getAssetById=${byIdFound ? "found" : "null"}; getAllAssets=${allCount}. This disposable site asset should be removed after independent readback.`;
}

async function style(name: string): Promise<Style> {
  return (await webflow.getStyleByName(name)) ?? webflow.createStyle(name);
}

function isBoundTo(value: unknown, propId: string): boolean {
  return typeof value === "object" && value !== null &&
    "sourceType" in value && value.sourceType === "prop" &&
    "propId" in value && value.propId === propId;
}

function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  try { return JSON.stringify(error); }
  catch { return "Unknown nonserializable error"; }
}

async function verifyProof(): Promise<string> {
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(PROOF_NAME)];
  if (!component) throw new Error("The proof component is not present on this site.");
  const [variants, props, root] = await Promise.all([
    component.getVariants(), component.getProps(), component.getRootElement(),
  ]);
  const expectedVariants = ["Never", "Tablet", "Mobile landscape", "Mobile portrait", "Always"];
  const missingVariants = expectedVariants.filter((name) => !variants.some((variant) => variant.name === name));
  const brandProp = props.find((prop) => prop.name === "Brand accessible label" && prop.type === "string");
  const navProp = props.find((prop) => prop.name === "Navigation label" && prop.type === "string");
  if (!root?.children) throw new Error("The saved component root cannot be inspected.");
  const [row] = await root.getChildren();
  if (!row?.children) throw new Error("The saved component row cannot be inspected.");
  const [brand, nav] = await row.getChildren();
  if (!brand?.attributes || !nav?.attributes) {
    throw new Error("The saved brand link or navigation element cannot be inspected.");
  }
  const [brandBinding, navBinding] = await Promise.all([
    brand.getAttributeValue("aria-label"), nav.getAttributeValue("aria-label"),
  ]);
  const probeMarker = root.attributes
    ? await root.getResolvedAttributeValue("data-mwp-variant-probe") : null;
  const checks = [
    missingVariants.length === 0 && variants.length === expectedVariants.length
      ? "five variants saved" : `variant mismatch (${variants.map((variant) => variant.name).join(", ")})`,
    brandProp && navProp ? "two authored string properties saved" : "authored property missing",
    brandProp && isBoundTo(brandBinding, brandProp.id)
      ? "brand label bound" : `brand label binding missing (${JSON.stringify(brandBinding)})`,
    navProp && isBoundTo(navBinding, navProp.id)
      ? "navigation label bound" : `navigation label binding missing (${JSON.stringify(navBinding)})`,
    probeMarker === null ? "variant probe marker absent" : "variant probe marker remains",
  ];
  const passed = missingVariants.length === 0 && variants.length === expectedVariants.length &&
    Boolean(brandProp && navProp) && Boolean(brandProp && isBoundTo(brandBinding, brandProp.id)) &&
    Boolean(navProp && isBoundTo(navBinding, navProp.id)) && probeMarker === null;
  return `${passed ? "Proof verified" : "Proof needs attention"}: ${checks.join("; ")}. Webflow also has ${props.length - 2} generated component property.`;
}

async function probeVariantAttributes(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before testing variant attributes.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(PROOF_NAME)];
  if (!component || component.library || component.readOnly) {
    throw new Error("The editable, disposable proof component is not present.");
  }
  const marker = "data-mwp-variant-probe";
  const value = "always-only";
  const original = await component.getSelectedVariant().catch(() => {
    throw new Error("Open the SmashBurger API proof with Edit component, then run this check.");
  });
  let alwaysValue: string | null = null;
  let baseValue: string | null = null;
  let wroteMarker = false;
  try {
    for (const variant of [{ name: "Always" }, { id: "base" }]) {
      await component.setSelectedVariant(variant);
      const root = await component.getRootElement();
      if (!root?.attributes) throw new Error("The proof component root does not support attributes.");
      if (await root.getResolvedAttributeValue(marker) !== null) {
        throw new Error("A variant probe marker already exists; no attribute was changed.");
      }
    }
    await component.setSelectedVariant({ name: "Always" });
    const alwaysRoot = await component.getRootElement();
    if (!alwaysRoot?.attributes) throw new Error("The Always variant root is unavailable.");
    await alwaysRoot.setAttribute(marker, value);
    wroteMarker = true;
    alwaysValue = await alwaysRoot.getResolvedAttributeValue(marker);
    await component.setSelectedVariant({ id: "base" });
    const baseRoot = await component.getRootElement();
    if (!baseRoot?.attributes) throw new Error("The Base variant root is unavailable.");
    baseValue = await baseRoot.getResolvedAttributeValue(marker);
  } finally {
    if (wroteMarker) {
      for (const variant of [{ name: "Always" }, { id: "base" }]) {
        await component.setSelectedVariant(variant);
        const root = await component.getRootElement();
        if (root?.attributes && await root.getResolvedAttributeValue(marker) === value) {
          await root.removeAttribute(marker);
        }
      }
    }
    await component.setSelectedVariant({ id: original.id });
  }
  return alwaysValue === value && baseValue === null
    ? "Variant attribute probe passed: Always has its own root attribute; Base remains unchanged. Temporary marker removed."
    : `Variant attribute probe found shared settings: Always=${JSON.stringify(alwaysValue)}, Base=${JSON.stringify(baseValue)}. Temporary marker removed.`;
}

async function configureCoreVariants(alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (alpha ? !await page.isDraft() : site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before configuring core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.library || component.readOnly) {
    throw new Error("The editable native core trial is not present.");
  }
  const expected = ["Never", "Tablet", "Mobile landscape", "Mobile portrait", "Always"];
  let variants = await component.getVariants();
  if (variants.some((variant) => ![...expected, "Base"].includes(variant.name))) {
    throw new Error("The native core has an unexpected variant; inspect it before changing variants.");
  }
  if (variants[0]?.id !== "base") throw new Error("The native core Base variant is unavailable.");
  if (variants[0].name === "Base") await component.setVariant("base", { name: alpha ? "Tablet" : "Mobile landscape" });
  for (const name of expected) {
    variants = await component.getVariants();
    if (!variants.some((variant) => variant.name === name)) await component.createVariant(name);
  }
  variants = await component.getVariants();
  if (variants.length !== expected.length || expected.some((name) => !variants.some((variant) => variant.name === name))) {
    throw new Error(`Native core variants did not pass readback: ${variants.map((variant) => variant.name).join(", ")}`);
  }
  return "Five native core variant names saved. Runtime collapse behavior still requires a generated-marker check.";
}

async function activateCoreVariants(alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (alpha ? !await page.isDraft() : site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before activating core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance.");
  }
  const variants = await component.getVariants();
  const expected = ["Never", "Tablet", "Mobile landscape", "Mobile portrait", "Always"];
  if (variants.length !== expected.length || expected.some((name) => !variants.some((variant) => variant.name === name))) {
    throw new Error("Create and verify the five native core variants first.");
  }
  const props = await component.getProps();
  const collapse = props.find((prop) => prop.name === "Collapse breakpoint" && prop.type === "string");
  if (!collapse) throw new Error("The native core Collapse breakpoint property is missing.");
  const root = await component.getRootElement();
  if (!root?.children || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core root marker or structure has changed.");
  }
  if (!root.attributes || !isBoundTo(await root.getAttributeValue("data-collapse"), collapse.id)) {
    throw new Error("The native core collapse binding has changed.");
  }
  const children = await root.getChildren();
  const infrastructure = await Promise.all(children.map(async (child) =>
    child.attributes && await child.getResolvedAttributeValue("data-mwp-infrastructure") !== null));
  const details = children[infrastructure.indexOf(true)];
  const embed = details?.children
    ? (await details.getChildren()).find((child) => child.type === "HtmlEmbed") : undefined;
  if (!embed?.elementSettings) throw new Error("The native core runtime Embed is missing.");
  const code = (await embed.getSettings()).code;
  if (code !== CORE_EMBED_CODE_V2 && code !== CORE_EMBED_CODE_V3 && code !== CORE_EMBED_CODE_V4 && code !== CORE_EMBED_CODE_V5 && code !== CORE_EMBED_CODE_V6 && code !== CORE_EMBED_CODE) {
    throw new Error("The runtime Embed differs from the known trial version; no code was replaced.");
  }
  if (collapse.defaultValue !== "") {
    await component.setProp(collapse.id, {
      defaultValue: "",
      tooltip: "Leave blank to follow the selected variant; enter never, tablet, mobile-landscape, mobile-portrait, or always to override it",
    });
  }
  if (code !== CORE_EMBED_CODE) await embed.setSettings({ code: CORE_EMBED_CODE });
  const [savedProps, savedCode] = await Promise.all([component.getProps(), embed.getSettings()]);
  if (savedProps.find((prop) => prop.id === collapse.id)?.defaultValue !== "" || savedCode.code !== CORE_EMBED_CODE) {
    throw new Error("Variant bridge settings did not pass readback.");
  }
  return "Native core variant bridge saved: blank Collapse breakpoint follows Webflow’s variant marker; a nonblank value overrides it. Preview behavior still needs checking.";
}

async function styleCoreVariants(alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (alpha ? !await page.isDraft() : site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before styling core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance.");
  }
  const variants = await component.getVariants();
  if (["Never", "Tablet", "Mobile landscape", "Mobile portrait", "Always"]
    .some((name) => !variants.some((variant) => variant.name === name))) {
    throw new Error("Create the five native core variants before styling them.");
  }
  const variantId = (name: string): string => {
    const id = variants.find((variant) => variant.name === name)?.id;
    if (!id) throw new Error(`Native core variant ${name} is missing.`);
    return id;
  };
  const root = await component.getRootElement();
  if (!root?.attributes || await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core root marker has changed.");
  }
  const [inner, menu, panel, links, primary] = await Promise.all([
    webflow.getStyleByName("sb-app-inner"), webflow.getStyleByName("sb-app-menu"),
    webflow.getStyleByName("sb-app-panel"), webflow.getStyleByName("sb-app-links"),
    webflow.getStyleByName("sb-app-primary"),
  ]);
  if (!inner || !menu || !panel || !links) throw new Error("A native core layout class is missing.");
  const apply = async (collapsed: boolean, options: StyleOptions): Promise<void> => {
    await inner.setProperties({ "flex-wrap": collapsed ? "wrap" : "nowrap" }, options);
    await menu.setProperties({ display: collapsed ? "block" : "none" }, options);
    await panel.setProperties({ "flex-basis": collapsed ? "100%" : "auto" }, options);
    await links.setProperties({ "flex-direction": collapsed ? "column" : "row", "align-items": collapsed ? "flex-start" : "center", "flex-wrap": collapsed ? "nowrap" : "wrap" }, options);
    if (primary) await primary.setProperties({ "flex-direction": collapsed ? "column" : "row", "align-items": collapsed ? "flex-start" : "center", "flex-wrap": collapsed ? "nowrap" : "wrap" }, options);
  };
  await apply(alpha, { breakpoint: "medium" });
  await apply(true, { breakpoint: "small" });
  if (alpha) {
    await apply(false, { variantId: variantId("Never"), breakpoint: "medium" });
    await apply(false, { variantId: variantId("Mobile landscape"), breakpoint: "medium" });
    await apply(false, { variantId: variantId("Mobile portrait"), breakpoint: "medium" });
  } else {
    await apply(true, { variantId: variantId("Tablet"), breakpoint: "medium" });
  }
  await apply(false, { variantId: variantId("Never"), breakpoint: "small" });
  await apply(false, { variantId: variantId("Mobile portrait"), breakpoint: "small" });
  await apply(true, { variantId: variantId("Mobile portrait"), breakpoint: "tiny" });
  await apply(true, { variantId: variantId("Always") });
  await apply(true, { variantId: variantId("Always"), breakpoint: "medium" });
  const checks = await Promise.all([
    menu.getProperty("display", { breakpoint: "medium" }),
    menu.getProperty("display", { breakpoint: "small" }),
    menu.getProperty("display", alpha ? { breakpoint: "medium" } : { variantId: variantId("Tablet"), breakpoint: "medium" }),
    menu.getProperty("display", { variantId: variantId("Never"), breakpoint: "small" }),
    menu.getProperty("display", { variantId: variantId("Mobile portrait"), breakpoint: "tiny" }),
    menu.getProperty("display", { variantId: variantId("Always") }),
  ]);
  if (checks.join(",") !== (alpha ? "block,block,block,none,block,block" : "none,block,block,none,block,block")) {
    throw new Error(`Native core variant styles did not pass readback: ${checks.join(", ")}`);
  }
  if (primary) {
    const primaryChecks = await Promise.all([
      primary.getProperty("flex-direction", { breakpoint: "medium" }),
      primary.getProperty("flex-direction", { breakpoint: "small" }),
      primary.getProperty("flex-direction", alpha ? { breakpoint: "medium" } : { variantId: variantId("Tablet"), breakpoint: "medium" }),
      primary.getProperty("flex-direction", { variantId: variantId("Never"), breakpoint: "small" }),
      primary.getProperty("flex-direction", { variantId: variantId("Mobile portrait"), breakpoint: "tiny" }),
      primary.getProperty("flex-direction", { variantId: variantId("Always") }),
    ]);
    if (primaryChecks.join(",") !== (alpha ? "column,column,column,row,column,column" : "row,column,column,row,column,column")) {
      throw new Error(`Native primary variant styles did not pass readback: ${primaryChecks.join(", ")}`);
    }
  }
  return "Native core Canvas styles saved for all five collapse variants at their breakpoint thresholds.";
}

async function verifyResponsiveStyles(): Promise<string> {
  const navStyle = await webflow.getStyleByName("sb-proof-nav");
  const rowStyle = await webflow.getStyleByName("sb-proof-row");
  if (!navStyle || !rowStyle) return "Styles missing: proof classes were not found";
  const expected: Array<[BreakpointId, string]> = [
    ["main", "16px 24px"], ["large", "20px 32px"], ["xl", "22px 36px"],
    ["xxl", "24px 40px"], ["medium", "16px 20px"],
    ["small", "14px 18px"], ["tiny", "12px 16px"],
  ];
  const actual = await Promise.all(expected.map(([breakpoint]) =>
    navStyle.getProperty("padding", breakpoint === "main" ? undefined : { breakpoint })));
  const mismatches = expected.flatMap(([breakpoint, value], index) =>
    actual[index] === value ? [] : [`${breakpoint}: ${JSON.stringify(actual[index])}`]);
  const mediumWrap = await rowStyle.getProperty("flex-wrap", { breakpoint: "medium" });
  if (mediumWrap !== "wrap") mismatches.push(`medium row wrap: ${JSON.stringify(mediumWrap)}`);
  return mismatches.length === 0
    ? "Styles verified at all seven breakpoints, including Tablet row wrapping"
    : `Style readback differs at ${mismatches.join(", ")}`;
}

async function probeEmbed(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before testing Embed insertion.");
  }
  const elements = await webflow.getAllElements();
  const body = elements.find((element) => element.type === "Body");
  if (!body?.children) throw new Error("The draft lab page Body is not available.");
  let embed: AnyElement | undefined;
  for (const element of elements) {
    if (element.type === "HtmlEmbed" && element.attributes &&
      await element.getResolvedAttributeValue("data-mwp-prototype") === "embed-proof-v1") {
      embed = element;
      break;
    }
  }
  const created = !embed;
  if (!embed) {
    embed = await body.append(webflow.elementPresets.HtmlEmbed);
    if (embed.attributes) await embed.setAttribute("data-mwp-prototype", "embed-proof-v1");
  }
  if (!embed.elementSettings) return `Embed ${created ? "inserted" : "reused"}, but settings are unavailable`;
  const settings = await embed.getSettings();
  const searchable = await embed.searchSettings().catch(() => ({}));
  const keys = [...new Set([...Object.keys(settings), ...Object.keys(searchable)])];
  const codeKey = ["code", "html", "embedCode", "customCode"].find((key) => keys.includes(key));
  if (!codeKey) return `Embed ${created ? "inserted" : "reused"}; no editable code setting exposed (keys: ${keys.join(", ") || "none"})`;
  const code = "<!-- SmashBurger API lab Embed proof -->";
  await embed.setSettings({ [codeKey]: code });
  const saved: unknown = (await embed.getSettings())[codeKey];
  return `Embed ${created ? "inserted" : "reused"}; ${codeKey} content ${saved === code ? "saved" : `readback differs (${JSON.stringify(saved)})`}`;
}

async function configureNativeCore(report: (message: string) => void, knownComponent?: Component, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (alpha ? !await page.isDraft() : site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error(alpha ? "The native alpha can only be configured on a draft page." :
      "Open the SmashBurger App API Lab draft page before configuring its native core.");
  }
  const components = knownComponent ? [knownComponent] : await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no component was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core trial root marker or structure has changed; no properties were added.");
  }
  const children = await root.getChildren();
  const [inner] = children;
  if (!inner?.children) throw new Error("The native core inner row is missing; no properties were added.");
  let infrastructure: AnyElement | undefined;
  for (const child of children) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-infrastructure") !== null) {
      infrastructure = child;
      break;
    }
  }
  const directEmbed = children.find((child) => child.type === "HtmlEmbed");
  const infrastructureChildren = infrastructure?.children ? await infrastructure.getChildren() : [];
  const nestedEmbed = infrastructureChildren.find((child) => child.type === "HtmlEmbed");
  if (directEmbed && nestedEmbed) throw new Error("Two runtime Embeds were found; no code was changed.");
  const embed = directEmbed ?? nestedEmbed;
  if (!embed?.elementSettings) {
    throw new Error("The native core runtime Embed is missing; no properties were added.");
  }
  const existingCode = (await embed.getSettings()).code;
  if (existingCode !== cdnLoader && existingCode !== CORE_EMBED_CODE_V1 && existingCode !== CORE_EMBED_CODE_V2 && existingCode !== CORE_EMBED_CODE_V3 && existingCode !== CORE_EMBED_CODE_V4 && existingCode !== CORE_EMBED_CODE_V5 && existingCode !== CORE_EMBED_CODE_V6 && existingCode !== CORE_EMBED_CODE) {
    throw new Error("The native core Embed differs from the known trial versions; no code was replaced.");
  }
  const [brand, menu, panel] = await inner.getChildren();
  if (!brand?.attributes || !menu?.children || !panel?.attributes ||
    await menu.getResolvedAttributeValue("data-mwp-menu") === null ||
    await panel.getResolvedAttributeValue("data-mwp-panel") === null) {
    throw new Error("The native core brand, menu or panel has changed; no properties were added.");
  }
  const [summary] = await menu.getChildren();
  if (!summary?.attributes || await summary.getResolvedAttributeValue("data-mwp-trigger") === null) {
    throw new Error("The native core menu trigger has changed; no properties were added.");
  }

  const coreProperties: CreatePropOptions[] = alpha ? CORE_PROPERTIES.map((prop) => prop.name === "Collapse breakpoint" && prop.type === "string"
    ? { ...prop, defaultValue: "tablet" } : prop) : CORE_PROPERTIES;
  const existing = await component.getProps();
  for (const expected of coreProperties) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== "string" || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} already exists with a different type or group; no bindings were changed.`);
    }
  }
  const missing = coreProperties.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} native component properties…`);
    await component.createProps(missing);
  }
  report("Keeping the runtime Embed in a compact native Details section…");
  const [infrastructureStyle, infrastructureSummaryStyle] = await Promise.all([
    style("sb-app-infrastructure"), style("sb-app-infrastructure-summary"),
  ]);
  await infrastructureStyle.setProperties({ "font-size": "11px", "line-height": "1.3", color: "#b7c8bd", "padding-top": "6px" });
  await infrastructureSummaryStyle.setProperties({ cursor: "pointer" });
  if (!infrastructure) {
    infrastructure = await root.append(webflow.elementPresets.DOM);
    await infrastructure.setTag("details");
    await infrastructure.setAttribute("data-mwp-infrastructure", "");
  }
  if (!infrastructure.children || !infrastructure.styles) {
    throw new Error("The native infrastructure Details cannot contain or style its Embed.");
  }
  await infrastructure.setStyles([infrastructureStyle]);
  const currentChildren = await infrastructure.getChildren();
  let infrastructureSummary: AnyElement | undefined;
  for (const child of currentChildren) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-infrastructure-label") !== null) {
      infrastructureSummary = child;
      break;
    }
  }
  if (!infrastructureSummary) {
    infrastructureSummary = await infrastructure.prepend(webflow.elementPresets.DOM);
    await infrastructureSummary.setTag("summary");
    await infrastructureSummary.setAttribute("data-mwp-infrastructure-label", "");
    await infrastructureSummary.setTextContent("SmashBurger infrastructure");
  }
  if (!infrastructureSummary.styles) throw new Error("The infrastructure summary cannot be styled.");
  await infrastructureSummary.setStyles([infrastructureSummaryStyle]);
  if (directEmbed) await infrastructure.append(directEmbed);
  if (existingCode !== CORE_EMBED_CODE) {
    report("Updating the scoped runtime display rules…");
    await embed.setSettings({ code: CORE_EMBED_CODE });
    if ((await embed.getSettings()).code !== CORE_EMBED_CODE) {
      throw new Error("The native core Embed update did not pass readback.");
    }
  }
  const savedInfrastructureChildren = await infrastructure.getChildren();
  const savedEmbeds = savedInfrastructureChildren.filter((child) => child.type === "HtmlEmbed");
  const savedLabels = await Promise.all(savedInfrastructureChildren.map(async (child) =>
    child.attributes && await child.getResolvedAttributeValue("data-mwp-infrastructure-label") !== null));
  if (savedEmbeds.length !== 1 || savedEmbeds[0].id.component !== embed.id.component ||
    savedEmbeds[0].id.element !== embed.id.element || savedLabels.filter(Boolean).length !== 1) {
    throw new Error("The compact runtime Details structure did not pass readback.");
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const prop = props.find((item) => item.name === name && item.type === "string");
    if (!prop) throw new Error(`Property ${name} was not saved.`);
    return prop.id;
  };
  const bindings: Array<[AnyElement, string, string]> = [
    [root, "data-collapse", "Collapse breakpoint"],
    [root, "data-layout", "Menu layout"],
    [root, "data-motion", "Menu motion"],
    [root, "data-align", "Panel alignment"],
    [root, "data-panel-width", "Panel width"],
    [root, "data-focus-first", "Focus first link"],
    [root, "data-close-on-outside", "Close on outside click"],
    [root, "data-close-on-link", "Close on link click"],
    [root, "data-scroll-lock", "Lock page scroll"],
    [brand, "aria-label", "Brand accessible label"],
    [summary, "aria-label", "Menu button label"],
    [panel, "aria-label", "Navigation label"],
  ];
  report("Binding behavior and accessibility settings to native elements…");
  for (const [element, attribute, name] of bindings) {
    if (!element.attributes) throw new Error(`The target for ${name} cannot bind attributes.`);
    await element.setAttribute(attribute, { sourceType: "prop", propId: propId(name) });
  }
  const checks = await Promise.all(bindings.map(async ([element, attribute, name]) =>
    element.attributes && isBoundTo(await element.getAttributeValue(attribute), propId(name))));
  if (checks.some((passed) => !passed)) throw new Error("Native properties were added, but an attribute binding failed readback.");
  return `Native core configured: ${CORE_PROPERTIES.length} grouped properties, ${checks.length} attribute bindings and compact runtime Details saved.`;
}

async function configureNativeContent(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before configuring native content.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((component) => component.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no content was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core trial marker has changed; no content was changed.");
  }
  const [inner] = await root.getChildren();
  if (!inner?.children) throw new Error("The native core row is missing; no content was changed.");
  const [brand, , panel] = await inner.getChildren();
  if (brand?.type !== "Link" || !panel?.children || !panel.attributes ||
    await panel.getResolvedAttributeValue("data-mwp-panel") === null) {
    throw new Error("The native brand or panel has changed; no content was changed.");
  }
  const [firstPanelChild] = await panel.getChildren();
  const primary = firstPanelChild?.attributes &&
    await firstPanelChild.getResolvedAttributeValue("data-mwp-primary") !== null
    ? firstPanelChild : null;
  const [linksContainer] = primary?.children ? await primary.getChildren() : [firstPanelChild];
  if (!linksContainer?.children || !linksContainer.attributes ||
    await linksContainer.getResolvedAttributeValue("data-mwp-links") === null) {
    throw new Error("The native link container has changed; no content was changed.");
  }
  const links = (await linksContainer.getChildren()).filter((child) => child.type === "Link");
  if (links.length !== 3) {
    throw new Error("Expected the trial's three native links; no content was changed.");
  }
  const targets = [brand, ...links] as LinkElement[];
  const labels = ["Brand", "Link 1", "Link 2", "Link 3"];
  for (const [index, target] of targets.entries()) {
    if (!target.attributes || (target !== brand &&
      await target.getResolvedAttributeValue("data-mwp-item") === null)) {
      throw new Error("A native link marker has changed; no content was changed.");
    }
    const settings = await target.searchSettings();
    if (settings.text?.valueType !== "textContent" || !settings.text.canBind ||
      settings.link?.valueType !== "link" || !settings.link.canBind) {
      throw new Error(`This Designer session reports ${labels[index]} text as ${settings.text?.valueType ?? "missing"}/${settings.text?.canBind ?? false} and destination as ${settings.link?.valueType ?? "missing"}/${settings.link?.canBind ?? false}; no content properties were created.`);
    }
  }
  report("Native link text and destination settings are bindable; preserving their current values…");
  const definitions: CreatePropOptions[] = [];
  for (let index = 0; index < targets.length; index++) {
    const settings = await targets[index].getResolvedSettings();
    const text = settings.text;
    const destination = settings.link;
    const textValue = typeof text === "string" ? text :
      text && typeof text === "object" && "innerText" in text ? text.innerText : null;
    if (typeof textValue !== "string" || !destination ||
      typeof destination !== "object" || !("mode" in destination)) {
      throw new Error(`Could not preserve ${labels[index]} text and destination; no properties were created.`);
    }
    definitions.push(
      { type: "textContent", name: `${labels[index]} text`, group: "Content", defaultValue: textValue },
      { type: "link", name: `${labels[index]} destination`, group: "Links", defaultValue: destination },
    );
  }
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no bindings were changed.`);
    }
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} native content and destination properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const prop = props.find((item) => item.name === name);
    if (!prop) throw new Error(`Property ${name} was not saved.`);
    return prop.id;
  };
  report("Binding editable text and destinations to the native links…");
  for (let index = 0; index < targets.length; index++) {
    await targets[index].setSettings({
      text: { sourceType: "prop", propId: propId(`${labels[index]} text`) },
      link: { sourceType: "prop", propId: propId(`${labels[index]} destination`) },
    });
  }
  for (let index = 0; index < targets.length; index++) {
    const settings = await targets[index].getSettings();
    if (!isBoundTo(settings.text, propId(`${labels[index]} text`)) ||
      !isBoundTo(settings.link, propId(`${labels[index]} destination`))) {
      throw new Error(`${labels[index]} bindings did not pass readback.`);
    }
  }
  return `Native content configured: ${definitions.length} text and destination properties saved and bound.`;
}

async function configureNativePrimary(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before expanding its native navigation.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no navigation was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core trial marker has changed; no navigation was changed.");
  }
  const rootChildren = await root.getChildren();
  const inner = rootChildren[0];
  let backdrop: AnyElement | undefined;
  for (const child of rootChildren) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-backdrop") !== null) backdrop = child;
  }
  if (!inner?.children) throw new Error("The native core inner row is missing.");
  const [, menu, panel] = await inner.getChildren();
  if (!menu?.children || !panel?.children || !panel.attributes ||
    await panel.getResolvedAttributeValue("data-mwp-panel") === null) {
    throw new Error("The native menu or panel has changed; no navigation was changed.");
  }
  const [summary] = await menu.getChildren();
  const [label] = summary?.children ? await summary.getChildren() : [];
  if (!label?.attributes || !label.visibility || !backdrop?.attributes || !backdrop.visibility ||
    await label.getResolvedAttributeValue("data-mwp-label") === null ||
    await backdrop.getResolvedAttributeValue("data-mwp-backdrop") === null) {
    throw new Error("The native menu label or backdrop has changed; no navigation was changed.");
  }
  const panelChildren = await panel.getChildren();
  let primary: AnyElement | undefined;
  for (const child of panelChildren) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-primary") !== null) primary = child;
  }
  if (panelChildren.length !== 1 || !panelChildren[0].children ||
    (primary && panelChildren[0].id.element !== primary.id.element)) {
    throw new Error("The panel has an unexpected child; inspect it before expanding navigation.");
  }
  const links = primary?.children ? (await primary.getChildren())[0] : panelChildren[0];
  if (!links?.attributes || await links.getResolvedAttributeValue("data-mwp-links") === null) {
    throw new Error("The original native links were not found; no navigation was changed.");
  }
  const definitions: CreatePropOptions[] = [
    { type: "boolean", name: "Show menu label", group: "Trigger", defaultValue: true },
    { type: "boolean", name: "Show backdrop", group: "Content", defaultValue: true },
    { type: "boolean", name: "Show primary navigation", group: "Content", defaultValue: true },
    { type: "boolean", name: "Show CTA", group: "Content", defaultValue: true },
  ];
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no navigation was changed.`);
    }
  }
  const [primaryStyle, ctaStyle] = await Promise.all([style("sb-app-primary"), style("sb-app-cta")]);
  await primaryStyle.setProperties({ display: "flex", "align-items": "center", gap: "20px" });
  await ctaStyle.setProperties({ color: "inherit", "text-decoration": "none", "border-style": "solid", "border-width": "1px", "border-color": "currentColor", "border-radius": "999px", "padding-top": "8px", "padding-bottom": "8px", "padding-left": "14px", "padding-right": "14px" });
  await primaryStyle.setProperties({ "flex-direction": "row", "align-items": "center", "align-self": "stretch", "flex-wrap": "wrap" }, { breakpoint: "medium" });
  if (!primary) {
    report("Grouping the existing links in a native primary navigation wrapper…");
    primary = await panel.append(webflow.elementPresets.DivBlock);
    await primary.setStyles([primaryStyle]);
    await primary.setAttribute("data-mwp-primary", "");
    if (!primary.children) throw new Error("The new primary wrapper cannot contain the existing links.");
    await primary.append(links);
  }
  if (!primary.children || !primary.visibility) throw new Error("The primary wrapper cannot hold or bind native content.");
  const primaryChildren = await primary.getChildren();
  if (primaryChildren.length > 2 || primaryChildren[0]?.id.element !== links.id.element) {
    throw new Error("The primary wrapper has an unexpected structure; no CTA was added.");
  }
  let cta = primaryChildren[1];
  if (cta && (cta.type !== "Link" || !cta.attributes ||
    await cta.getResolvedAttributeValue("data-mwp-cta") === null)) {
    throw new Error("The existing primary child is not the trial CTA.");
  }
  if (!cta) {
    report("Adding an editable native call-to-action link…");
    cta = await primary.append(webflow.elementPresets.TextLink);
    await cta.setStyles([ctaStyle]);
    await cta.setSettings("url", "#");
    await cta.setTextContent("Explore SmashBurger");
    await cta.setAttribute("data-mwp-cta", "");
  }
  if (!cta.attributes) throw new Error("The CTA cannot expose its runtime item marker.");
  if (await cta.getResolvedAttributeValue("data-mwp-item") === null) {
    await cta.setAttribute("data-mwp-item", "");
  }
  if (!cta.visibility) throw new Error("The CTA cannot bind a visibility property.");
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} native visibility properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const id = props.find((prop) => prop.name === name && prop.type === "boolean")?.id;
    if (!id) throw new Error(`Property ${name} was not saved.`);
    return id;
  };
  const bindings: Array<[AnyElement, string]> = [
    [label, "Show menu label"], [backdrop, "Show backdrop"],
    [primary, "Show primary navigation"], [cta, "Show CTA"],
  ];
  for (const [element, name] of bindings) {
    if (!element.visibility) throw new Error(`${name} target cannot bind visibility.`);
    await element.setVisibility({ sourceType: "prop", propId: propId(name) });
  }
  for (const [element, name] of bindings) {
    if (!element.visibility || !isBoundTo(await element.getVisibility({ bindings: true }), propId(name))) {
      throw new Error(`${name} visibility binding did not pass readback.`);
    }
  }
  const savedPanel = await panel.getChildren();
  const savedPrimary = await primary.getChildren();
  if (savedPanel.length !== 1 || savedPanel[0].id.element !== primary.id.element ||
    savedPrimary.length !== 2 || savedPrimary[0].id.element !== links.id.element ||
    savedPrimary[1].id.element !== cta.id.element) {
    throw new Error("The primary navigation structure did not pass readback.");
  }
  return "Native primary navigation saved: original links preserved, editable CTA added, four visibility controls bound.";
}

async function bindAlphaCtaContent(report: (message: string) => void): Promise<string> {
  const page = await webflow.getCurrentPage();
  if (!await page.isDraft()) throw new Error("Open the draft page containing the native alpha component.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native alpha instance; no CTA properties were changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha root marker changed; no CTA properties were changed.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [primary] = panel?.children ? await panel.getChildren() : [];
  if (!primary?.children || !primary.attributes ||
    await primary.getResolvedAttributeValue("data-mwp-primary") === null) {
    throw new Error("The native primary navigation changed; no CTA properties were changed.");
  }
  const primaryChildren = await primary.getChildren();
  const cta = primaryChildren[1];
  if (primaryChildren.length !== 2 || cta?.type !== "Link" || !cta.attributes ||
    await cta.getResolvedAttributeValue("data-mwp-cta") === null) {
    throw new Error("The native CTA changed; no CTA properties were changed.");
  }
  const available = await cta.searchSettings();
  if (available.text?.valueType !== "textContent" || !available.text.canBind ||
    available.link?.valueType !== "link" || !available.link.canBind) {
    throw new Error("This Designer session cannot bind the CTA text and destination; no properties were created.");
  }
  const resolved = await cta.getResolvedSettings();
  const text = resolved.text;
  const textValue = typeof text === "string" ? text :
    text && typeof text === "object" && "innerText" in text ? text.innerText : null;
  const destination = resolved.link;
  if (typeof textValue !== "string" || !destination ||
    typeof destination !== "object" || !("mode" in destination)) {
    throw new Error("Could not preserve the CTA text and destination; no properties were created.");
  }
  const definitions: CreatePropOptions[] = [
    { type: "textContent", name: "CTA text", group: "Content", defaultValue: textValue },
    { type: "link", name: "CTA destination", group: "Links", defaultValue: destination },
  ];
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no CTA bindings were changed.`);
    }
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} native CTA content properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const id = props.find((prop) => prop.name === name)?.id;
    if (!id) throw new Error(`CTA property ${name} was not saved.`);
    return id;
  };
  await cta.setSettings({
    text: { sourceType: "prop", propId: propId("CTA text") },
    link: { sourceType: "prop", propId: propId("CTA destination") },
  });
  const saved = await cta.getSettings();
  if (!isBoundTo(saved.text, propId("CTA text")) ||
    !isBoundTo(saved.link, propId("CTA destination"))) {
    throw new Error("The CTA content bindings did not pass readback.");
  }
  return "Native CTA text and destination properties saved and bound.";
}

async function bindAlphaMenuLabel(): Promise<string> {
  const [site, page] = await Promise.all([webflow.getSiteInfo(), webflow.getCurrentPage()]);
  const [slug, draft] = await Promise.all([page.getSlug(), page.isDraft()]);
  const publishedFixture = ["Disposable Testing Site", "another disposable site"].includes(site.siteName) && slug === "sb-test";
  if (!draft && !publishedFixture) {
    throw new Error(`Open a draft alpha page or /sb-test on a disposable test site before binding the Menu label (current: ${site.siteName}/${slug}); no property was changed.`);
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native alpha instance; no Menu label property was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha root marker changed; no Menu label property was changed.");
  }
  const [inner] = await root.getChildren();
  const [, menu] = inner?.children ? await inner.getChildren() : [];
  const [summary] = menu?.children ? await menu.getChildren() : [];
  const [label] = summary?.children ? await summary.getChildren() : [];
  if (label?.type !== "DOM" || !label.attributes || !label.elementSettings ||
    await label.getResolvedAttributeValue("data-mwp-label") === null) {
    throw new Error("The native Menu label changed; no property was created.");
  }
  const available = await label.searchSettings();
  if (available.text?.valueType !== "textContent" || !available.text.canBind) {
    throw new Error(`The native Menu label text is not bindable in this Designer session (${available.text?.valueType ?? "missing"}/${available.text?.canBind ?? false}); no property was created.`);
  }
  const text = (await label.getResolvedSettings()).text;
  const textValue = typeof text === "string" ? text :
    text && typeof text === "object" && "innerText" in text ? text.innerText : null;
  if (typeof textValue !== "string") {
    throw new Error("Could not preserve the native Menu label text; no property was created.");
  }
  const existing = await component.getProps();
  const named = existing.find((prop) => prop.name === "Menu label");
  if (named && (named.type !== "textContent" || named.group !== "Trigger")) {
    throw new Error("Menu label already exists with a different type or group; no binding was changed.");
  }
  if (!named) {
    await component.createProps([{ type: "textContent", name: "Menu label", group: "Trigger", defaultValue: textValue }]);
  }
  const savedProp = (await component.getProps()).find((prop) => prop.name === "Menu label" && prop.type === "textContent");
  if (!savedProp) throw new Error("The Menu label property did not pass readback.");
  await label.setSettings({ text: { sourceType: "prop", propId: savedProp.id } });
  if (!isBoundTo((await label.getSettings()).text, savedProp.id)) {
    throw new Error("The Menu label text binding did not pass readback.");
  }
  return "Native Menu label text property saved and bound.";
}

async function configureNativeSubmenu(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before building its submenu.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable project-native core trial instance; no submenu was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core marker has changed; no submenu was changed.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [primary] = panel?.children ? await panel.getChildren() : [];
  const [links] = primary?.children ? await primary.getChildren() : [];
  if (!panel?.attributes || await panel.getResolvedAttributeValue("data-mwp-panel") === null ||
    !primary?.attributes || await primary.getResolvedAttributeValue("data-mwp-primary") === null ||
    !links?.children || !links.attributes || await links.getResolvedAttributeValue("data-mwp-links") === null) {
    throw new Error("The native primary link container has changed; no submenu was added.");
  }
  const children = await links.getChildren();
  if (children.length < 3 || children.length > 4 || children.slice(0, 3).some((child) => child.type !== "Link")) {
    throw new Error("Expected three primary links and at most one submenu; inspect the structure first.");
  }
  const [submenuStyle, triggerStyle, iconStyle, lineStyle, listStyle, linkStyle] = await Promise.all([
    style("sb-app-submenu"), style("sb-app-submenu-trigger"), style("sb-app-submenu-icon"),
    style("sb-app-submenu-icon-line"), style("sb-app-submenu-list"), style("sb-app-submenu-link"),
  ]);
  await submenuStyle.setProperties({ position: "relative" });
  await triggerStyle.setProperties({ display: "flex", "align-items": "center", gap: "8px", cursor: "pointer", "min-height": "32px" });
  await iconStyle.setProperties({ display: "flex", "align-items": "center", gap: "2px", "transform-origin": "center" });
  await iconStyle.removeProperties(["transition-property", "transition-duration", "transition-timing-function"]);
  const iconProperties = await iconStyle.getProperties();
  if (["transition-property", "transition-duration", "transition-timing-function"].some((name) => name in iconProperties)) {
    throw new Error("The submenu icon class still overrides the runtime motion settings.");
  }
  await lineStyle.setProperties({ width: "7px", height: "2px", "min-width": "7px", "min-height": "2px", "background-color": "currentColor" });
  await listStyle.setProperties({ display: "grid", gap: "4px", position: "absolute", top: "100%", right: "0", "min-width": "180px", "background-color": "#ffffff", color: "#17251e", "border-radius": "8px", "padding-top": "8px", "padding-bottom": "8px", "padding-left": "8px", "padding-right": "8px", "box-shadow": "0 12px 32px rgba(0,0,0,.16)", "z-index": "3" });
  await linkStyle.setProperties({ display: "block", color: "inherit", "text-decoration": "none", "padding-top": "8px", "padding-bottom": "8px", "padding-left": "10px", "padding-right": "10px" });
  await listStyle.setProperties({ position: "static", "box-shadow": "none", "min-width": "0", "padding-left": "16px" }, { breakpoint: "medium" });
  let submenu = children[3];
  if (submenu && (!submenu.attributes || await submenu.getResolvedAttributeValue("data-mwp-submenu") === null)) {
    throw new Error("The fourth primary child is not the trial submenu; no submenu was changed.");
  }
  if (!submenu) {
    report("Adding a native details submenu and two editable links…");
    submenu = await links.append(webflow.elementPresets.DOM);
    await submenu.setTag("details");
    await submenu.setStyles([submenuStyle]);
    await submenu.setAttribute("data-mwp-submenu", "");
    await submenu.setAttribute("data-mwp-item", "");
  }
  if (!submenu.children) throw new Error("The submenu cannot contain native children.");
  let [summary, list] = await submenu.getChildren();
  if (!summary) {
    summary = await submenu.append(webflow.elementPresets.DOM);
    await summary.setTag("summary");
    await summary.setStyles([triggerStyle]);
    const label = await summary.append(webflow.elementPresets.DOM);
    await label.setTag("span");
    await label.setTextContent("More");
    const icon = await summary.append(webflow.elementPresets.DivBlock);
    await icon.setStyles([iconStyle]);
    await icon.setAttribute("data-mwp-submenu-icon", "");
    await icon.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 2; index++) {
      const line = await icon.append(webflow.elementPresets.DivBlock);
      await line.setStyles([lineStyle]);
      await line.setAttribute("data-mwp-submenu-arrow-line", "");
    }
  }
  if (!list) {
    list = await submenu.append(webflow.elementPresets.DivBlock);
    await list.setStyles([listStyle]);
    await list.setAttribute("data-mwp-submenu-list", "");
    for (const label of ["Services", "Projects"]) {
      const link = await list.append(webflow.elementPresets.TextLink);
      await link.setStyles([linkStyle]);
      await link.setSettings("url", "#");
      await link.setTextContent(label);
      await link.setAttribute("data-mwp-item", "");
    }
  }
  const saved = await submenu.getChildren();
  const savedLinks = saved[1]?.children ? await saved[1].getChildren() : [];
  if (saved.length !== 2 || saved[0].type !== "DOM" || !saved[1].attributes ||
    await saved[1].getResolvedAttributeValue("data-mwp-submenu-list") === null ||
    savedLinks.length !== 2 || savedLinks.some((link) => link.type !== "Link")) {
    throw new Error("The native submenu structure did not pass readback.");
  }
  report("Updating the scoped runtime Embed for the native submenu…");
  await configureNativeCore(report, component, alpha);
  return "Native submenu saved: editable details and summary, two native links, scoped open-state styling and runtime Embed verified. Check its layout in Preview.";
}

async function configureNativeSubmenuProperties(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before binding submenu properties.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable project-native core trial instance.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core marker has changed; no properties were added.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [primary] = panel?.children ? await panel.getChildren() : [];
  const [links] = primary?.children ? await primary.getChildren() : [];
  const children = links?.children ? await links.getChildren() : [];
  const submenu = children[3];
  if (children.length !== 4 || !submenu?.attributes || !submenu.children ||
    await submenu.getResolvedAttributeValue("data-mwp-submenu") === null) {
    throw new Error("Build the one native submenu before binding its properties.");
  }
  const [summary, list] = await submenu.getChildren();
  const [, icon] = summary?.children ? await summary.getChildren() : [];
  const nativeLinks = list?.children ? await list.getChildren() : [];
  if (!icon?.attributes || !icon.visibility ||
    await icon.getResolvedAttributeValue("data-mwp-submenu-icon") === null ||
    nativeLinks.length !== 2 || nativeLinks.some((link) => link.type !== "Link")) {
    throw new Error("The native submenu icon or two links have changed; no properties were added.");
  }
  const linksToBind = nativeLinks as LinkElement[];
  const definitions: CreatePropOptions[] = [
    { type: "boolean", name: "Show submenu arrows", group: "Trigger", defaultValue: true },
    { type: "string", name: "Submenu icon duration", group: "Motion", defaultValue: "220ms" },
    { type: "string", name: "Submenu icon easing", group: "Motion", defaultValue: "cubic-bezier(0.22, 1, 0.36, 1)" },
    { type: "string", name: "Submenu icon rotation", group: "Motion", defaultValue: "180deg" },
  ];
  for (const [index, link] of linksToBind.entries()) {
    const settings = await link.searchSettings();
    if (settings.text?.valueType !== "textContent" || !settings.text.canBind ||
      settings.link?.valueType !== "link" || !settings.link.canBind) {
      throw new Error(`Submenu link ${index + 1} does not expose bindable text and destination settings.`);
    }
    const resolved = await link.getResolvedSettings();
    const text = resolved.text;
    const destination = resolved.link;
    const textValue = typeof text === "string" ? text :
      text && typeof text === "object" && "innerText" in text ? text.innerText : null;
    if (typeof textValue !== "string" || !destination ||
      typeof destination !== "object" || !("mode" in destination)) {
      throw new Error(`Could not preserve submenu link ${index + 1} content and destination.`);
    }
    definitions.push(
      { type: "textContent", name: `Submenu link ${index + 1} text`, group: "Content", defaultValue: textValue },
      { type: "link", name: `Submenu link ${index + 1} destination`, group: "Links", defaultValue: destination },
    );
  }
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`${expected.name} has a different type or group; no bindings were changed.`);
    }
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} submenu properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const id = props.find((prop) => prop.name === name)?.id;
    if (!id) throw new Error(`${name} was not saved.`);
    return id;
  };
  await icon.setVisibility({ sourceType: "prop", propId: propId("Show submenu arrows") });
  const attributes = [
    ["data-submenu-icon-duration", "Submenu icon duration"],
    ["data-submenu-icon-easing", "Submenu icon easing"],
    ["data-submenu-icon-rotation", "Submenu icon rotation"],
  ] as const;
  for (const [attribute, name] of attributes) {
    await root.setAttribute(attribute, { sourceType: "prop", propId: propId(name) });
  }
  for (const [index, link] of linksToBind.entries()) {
    await link.setSettings({
      text: { sourceType: "prop", propId: propId(`Submenu link ${index + 1} text`) },
      link: { sourceType: "prop", propId: propId(`Submenu link ${index + 1} destination`) },
    });
  }
  if (!isBoundTo(await icon.getVisibility({ bindings: true }), propId("Show submenu arrows"))) {
    throw new Error("Submenu arrow visibility did not pass readback.");
  }
  for (const [attribute, name] of attributes) {
    if (!isBoundTo(await root.getAttributeValue(attribute), propId(name))) {
      throw new Error(`${name} binding did not pass readback.`);
    }
  }
  for (const [index, link] of linksToBind.entries()) {
    const settings = await link.getSettings();
    if (!isBoundTo(settings.text, propId(`Submenu link ${index + 1} text`)) ||
      !isBoundTo(settings.link, propId(`Submenu link ${index + 1} destination`))) {
      throw new Error(`Submenu link ${index + 1} bindings did not pass readback.`);
    }
  }
  return `Native submenu properties saved: ${definitions.length} grouped controls and ${definitions.length} bindings verified.`;
}

async function configureNativeMotion(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before binding motion controls.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable project-native core trial instance.");
  }
  const root = await component.getRootElement();
  if (!root?.attributes || !root.children ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core marker has changed; no motion properties were added.");
  }
  const controls = [
    { name: "Distance", group: "Motion", value: "1.5rem", attribute: "data-distance" },
    { name: "Easing", group: "Motion", value: "cubic-bezier(0.22, 1, 0.36, 1)", attribute: "data-easing" },
    { name: "Opening duration", group: "Motion", value: "280ms", attribute: "data-open-duration" },
    { name: "Closing duration", group: "Motion", value: "220ms", attribute: "data-close-duration" },
    { name: "Item stagger", group: "Motion", value: "0ms", attribute: "data-stagger" },
    { name: "Icon duration", group: "Motion", value: "220ms", attribute: "data-icon-duration" },
    { name: "Icon lines", group: "Trigger", value: "3", attribute: "data-icon-lines" },
  ] as const;
  const existing = await component.getProps();
  for (const control of controls) {
    const found = existing.find((prop) => prop.name === control.name);
    if (found && (found.type !== "string" || found.group !== control.group)) {
      throw new Error(`${control.name} has a different type or group; no bindings were changed.`);
    }
  }
  const missing: CreatePropOptions[] = controls.filter((control) => !existing.some((prop) => prop.name === control.name))
    .map((control) => ({ type: "string", name: control.name, group: control.group, defaultValue: control.value }));
  if (missing.length) {
    report(`Creating ${missing.length} native motion and trigger properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  for (const control of controls) {
    const prop = props.find((item) => item.name === control.name && item.type === "string");
    if (!prop) throw new Error(`${control.name} was not saved.`);
    await root.setAttribute(control.attribute, { sourceType: "prop", propId: prop.id });
    if (!isBoundTo(await root.getAttributeValue(control.attribute), prop.id)) {
      throw new Error(`${control.name} root binding did not pass readback.`);
    }
  }
  return "Native motion controls saved: seven grouped properties and seven root attribute bindings verified.";
}

async function configureNativeSecondary(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before building secondary navigation.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.codeComponent !== false) {
    throw new Error("Expected an editable project-native core trial component.");
  }
  if (component.library || component.readOnly || await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no secondary navigation was changed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core trial marker has changed; no secondary navigation was changed.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  if (!panel?.children || !panel.attributes ||
    await panel.getResolvedAttributeValue("data-mwp-panel") === null) {
    throw new Error("The native panel has changed; no secondary navigation was changed.");
  }
  const panelChildren = await panel.getChildren();
  const primary = panelChildren[0];
  if (!primary?.attributes || await primary.getResolvedAttributeValue("data-mwp-primary") === null ||
    panelChildren.length > 2) {
    throw new Error("Build primary navigation first, then inspect any unexpected panel children.");
  }
  const entries = [
    { label: "Facebook", group: "Social links" },
    { label: "Instagram", group: "Social links" },
    { label: "LinkedIn", group: "Social links" },
    { label: "TikTok", group: "Social links" },
    { label: "Threads", group: "Social links" },
    { label: "X", group: "Social links" },
    { label: "WhatsApp", group: "Social links" },
    { label: "Telephone", group: "Contact links" },
    { label: "Email", group: "Contact links" },
  ] as const;
  const definitions: CreatePropOptions[] = [
    { type: "boolean", name: "Show socials", group: "Social links", defaultValue: true },
    { type: "boolean", name: "Show social labels", group: "Social links", defaultValue: true },
    { type: "boolean", name: "Show contact links", group: "Contact links", defaultValue: true },
    { type: "boolean", name: "Show contact labels", group: "Contact links", defaultValue: true },
    ...entries.map(({ label, group }): CreatePropOptions => ({
      type: "link", name: `${label} destination`, group, defaultValue: { mode: "url", to: "#" },
    })),
  ];
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no secondary navigation was changed.`);
    }
  }
  const [panelStyle, secondaryStyle, groupStyle, itemStyle, labelStyle, iconStyle] = await Promise.all([
    style("sb-app-panel"), style("sb-app-secondary"), style("sb-app-secondary-group"),
    style("sb-app-secondary-item"), style("sb-app-secondary-label"), style("sb-app-secondary-icon"),
  ]);
  await panelStyle.setProperties({ "flex-direction": "column", "align-items": "flex-end", gap: "12px" });
  await secondaryStyle.setProperties({ display: "flex", "flex-wrap": "wrap", "justify-content": "flex-end", "align-items": "center", gap: "12px", "max-width": "100%" });
  await groupStyle.setProperties({ display: "flex", "flex-wrap": "wrap", "align-items": "center", gap: "12px" });
  await itemStyle.setProperties({ color: "inherit", "text-decoration": "none", display: "inline-flex", "align-items": "center", "min-height": "24px" });
  await labelStyle.setProperties({ display: "inline-block" });
  await iconStyle.setProperties({ display: "block", width: "18px", height: "18px", "min-width": "18px", "max-width": "18px", "min-height": "18px", "max-height": "18px", "object-fit": "contain", "margin-right": "6px" });
  await panelStyle.setProperties({ "align-items": "stretch" }, { breakpoint: "medium" });
  await secondaryStyle.setProperties({ "justify-content": "flex-start", "border-top-style": "solid", "border-top-width": "1px", "border-top-color": "#ffffff33", "padding-top": "12px" }, { breakpoint: "medium" });
  let secondary = panelChildren[1];
  if (secondary && (!secondary.attributes ||
    await secondary.getResolvedAttributeValue("data-mwp-secondary") === null)) {
    throw new Error("The existing secondary panel child is not the trial secondary navigation.");
  }
  if (!secondary) {
    report("Building native social and contact link groups without icon assets…");
    secondary = await panel.append(webflow.elementPresets.DivBlock);
    await secondary.setStyles([secondaryStyle]);
    await secondary.setAttribute("data-mwp-secondary", "");
  }
  if (!secondary.children) throw new Error("The secondary wrapper cannot contain native links.");
  const groups = await secondary.getChildren();
  if (groups.length > 2) throw new Error("Unexpected secondary group structure.");
  const targets: Array<{ group: AnyElement; labels: AnyElement[]; links: LinkElement[] }> = [];
  for (const [index, spec] of [
    { marker: "data-mwp-socials", labels: entries.slice(0, 7) },
    { marker: "data-mwp-contacts", labels: entries.slice(7) },
  ].entries()) {
    let group = groups[index];
    if (group && (!group.attributes ||
      await group.getResolvedAttributeValue(spec.marker) === null)) {
      throw new Error(`Existing secondary group ${index + 1} has an unexpected marker.`);
    }
    if (!group) {
      group = await secondary.append(webflow.elementPresets.DivBlock);
      await group.setStyles([groupStyle]);
      await group.setAttribute(spec.marker, "");
    }
    if (!group.children || !group.visibility) throw new Error(`${spec.marker} cannot hold or bind native links.`);
    const savedLinks = await group.getChildren();
    if (savedLinks.length > spec.labels.length) throw new Error(`${spec.marker} has unexpected extra links.`);
    const labels: AnyElement[] = [];
    const links: LinkElement[] = [];
    for (const [linkIndex, entry] of spec.labels.entries()) {
      let link = savedLinks[linkIndex];
      if (link && (link.type !== "Link" || !link.attributes ||
        await link.getResolvedAttributeValue("data-mwp-secondary-item") !== entry.label.toLowerCase())) {
        throw new Error(`The ${entry.label} link has an unexpected structure.`);
      }
      if (!link) {
        link = await group.append(webflow.elementPresets.LinkBlock);
        await link.setStyles([itemStyle]);
        await link.setSettings("url", "#");
        await link.setAttribute("data-mwp-item", "");
        await link.setAttribute("data-mwp-secondary-item", entry.label.toLowerCase());
      }
      if (!link.children) throw new Error(`${entry.label} link cannot hold an editable label.`);
      const children = await link.getChildren();
      const icon = children[0]?.type === "Image" ? children[0] : null;
      let label = children[icon ? 1 : 0];
      if (children.length > (icon ? 2 : 1) || (label && (!label.attributes ||
        await label.getResolvedAttributeValue("data-mwp-secondary-label") === null))) {
        throw new Error(`${entry.label} has unexpected label children.`);
      }
      if (icon) {
        await icon.setStyles([iconStyle]);
        await icon.setAltText("");
        if (icon.attributes && await icon.getResolvedAttributeValue("data-mwp-secondary-icon") === null) {
          await icon.setAttribute("data-mwp-secondary-icon", "");
        }
      }
      if (!label) {
        label = await link.append(webflow.elementPresets.DOM);
        await label.setTag("span");
        await label.setStyles([labelStyle]);
        await label.setTextContent(entry.label);
        await label.setAttribute("data-mwp-secondary-label", "");
      }
      if (!label.visibility || link.type !== "Link") throw new Error(`${entry.label} cannot bind label or destination.`);
      labels.push(label);
      links.push(link);
    }
    targets.push({ group, labels, links });
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} secondary navigation properties…`);
    await component.createProps(missing);
  }
  const props = await component.getProps();
  const propId = (name: string): string => {
    const id = props.find((prop) => prop.name === name)?.id;
    if (!id) throw new Error(`Property ${name} was not saved.`);
    return id;
  };
  for (const [index, target] of targets.entries()) {
    const groupName = index === 0 ? "Show socials" : "Show contact links";
    const labelName = index === 0 ? "Show social labels" : "Show contact labels";
    if (!target.group.visibility) throw new Error(`${groupName} target cannot bind visibility.`);
    await target.group.setVisibility({ sourceType: "prop", propId: propId(groupName) });
    for (const label of target.labels) {
      if (!label.visibility) throw new Error(`${labelName} target cannot bind visibility.`);
      await label.setVisibility({ sourceType: "prop", propId: propId(labelName) });
    }
    for (const [linkIndex, link] of target.links.entries()) {
      const entry = index === 0 ? entries[linkIndex] : entries[linkIndex + 7];
      await link.setSettings({ link: { sourceType: "prop", propId: propId(`${entry.label} destination`) } });
    }
  }
  const savedGroups = await secondary.getChildren();
  if (savedGroups.length !== 2 || !savedGroups[0].children || !savedGroups[1].children ||
    (await savedGroups[0].getChildren()).length !== 7 ||
    (await savedGroups[1].getChildren()).length !== 2) {
    throw new Error("Secondary navigation structure did not pass readback.");
  }
  for (const [index, target] of targets.entries()) {
    const groupName = index === 0 ? "Show socials" : "Show contact links";
    const labelName = index === 0 ? "Show social labels" : "Show contact labels";
    if (!target.group.visibility ||
      !isBoundTo(await target.group.getVisibility({ bindings: true }), propId(groupName))) {
      throw new Error(`${groupName} visibility binding did not pass readback.`);
    }
    for (const label of target.labels) {
      if (!label.visibility || !isBoundTo(await label.getVisibility({ bindings: true }), propId(labelName))) {
        throw new Error(`${labelName} visibility binding did not pass readback.`);
      }
    }
    for (const [linkIndex, link] of target.links.entries()) {
      const entry = index === 0 ? entries[linkIndex] : entries[linkIndex + 7];
      if (!isBoundTo((await link.getSettings()).link, propId(`${entry.label} destination`))) {
        throw new Error(`${entry.label} destination binding did not pass readback.`);
      }
    }
  }
  await configureNativeCore(report, component, alpha);
  return "Native secondary navigation verified: seven social and two contact links, four visibility controls, nine editable destinations; any existing icon images styled and the scoped runtime Embed updated.";
}

async function bindNativeIcons(report: (message: string) => void): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before binding native icons.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no icon properties were added.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core trial marker has changed; no icon properties were added.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [, secondary] = panel?.children ? await panel.getChildren() : [];
  if (!secondary?.children || !secondary.attributes ||
    await secondary.getResolvedAttributeValue("data-mwp-secondary") === null) {
    throw new Error("Build the native secondary links before binding icons.");
  }
  const specs = [
    { name: "Facebook", id: "6a7e4cb1eafcdf0550a61dc6", group: "Social links" },
    { name: "Instagram", id: "6a7e4cb1eafcdf0550a61dc7", group: "Social links" },
    { name: "LinkedIn", id: "6a7e4cb1eafcdf0550a61dc8", group: "Social links" },
    { name: "TikTok", id: "6a7e4cb1eafcdf0550a61dc9", group: "Social links" },
    { name: "Threads", id: "6a7e4cb1eafcdf0550a61dca", group: "Social links" },
    { name: "X", id: "6a7e4cb1eafcdf0550a61dcb", group: "Social links" },
    { name: "WhatsApp", id: "6a7e4cb1eafcdf0550a61dcc", group: "Social links" },
    { name: "Telephone", id: "6a7e4cb1eafcdf0550a61dcd", group: "Contact links" },
    { name: "Email", id: "6a7e4cb1eafcdf0550a61dce", group: "Contact links" },
  ] as const;
  const groups = await secondary.getChildren();
  if (groups.length !== 2 || !groups[0].children || !groups[1].children) {
    throw new Error("The secondary groups have changed; no icon properties were added.");
  }
  const links = [...await groups[0].getChildren(), ...await groups[1].getChildren()];
  if (links.length !== specs.length) throw new Error("Expected nine secondary links; no icon properties were added.");
  const icons: ImageElement[] = [];
  for (const [index, spec] of specs.entries()) {
    report(`Checking ${spec.name} native icon…`);
    const link = links[index];
    if (!link.children || !link.attributes ||
      await link.getResolvedAttributeValue("data-mwp-secondary-item") !== spec.name.toLowerCase()) {
      throw new Error(`${spec.name} link changed; no icon properties were added.`);
    }
    const [icon, label] = await link.getChildren();
    if (icon?.type !== "Image" || !icon.attributes ||
      await icon.getResolvedAttributeValue("data-mwp-secondary-icon") === null ||
      !label?.attributes || await label.getResolvedAttributeValue("data-mwp-secondary-label") === null) {
      throw new Error(`${spec.name} icon or label is missing; no icon properties were added.`);
    }
    const settings = await icon.searchSettings().catch((error: unknown) => {
      throw new Error(`${spec.name} Image setting search failed: ${describeError(error)}`);
    });
    if (!settings.assetId?.canBind) {
      throw new Error(`${spec.name} Image asset setting is not bindable in this Designer session.`);
    }
    const resolved = await icon.getResolvedSettings().catch((error: unknown) => {
      throw new Error(`${spec.name} Image setting read failed: ${describeError(error)}`);
    });
    if (resolved.assetId !== spec.id) {
      throw new Error(`${spec.name} Image asset ID differs from the site asset; no icon properties were added.`);
    }
    icons.push(icon);
  }
  const existing = await component.getProps();
  const definitions: CreatePropOptions[] = specs.map((spec) => ({
    type: "image", name: `${spec.name} icon`, group: spec.group, defaultValue: spec.id,
  }));
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no icon binding was changed.`);
    }
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} replaceable native icon properties…`);
    await component.createProps(missing).catch((error: unknown) => {
      throw new Error(`Icon property creation failed: ${describeError(error)}`);
    });
  }
  const props = await component.getProps();
  for (const [index, spec] of specs.entries()) {
    const prop = props.find((item) => item.name === `${spec.name} icon` && item.type === "image");
    if (!prop || prop.defaultValue !== spec.id) {
      throw new Error(`${spec.name} image property default did not pass readback; no image bindings were changed.`);
    }
    report(`Binding ${spec.name} Image property…`);
    await icons[index].setSettings({ assetId: { sourceType: "prop", propId: prop.id } }).catch((error: unknown) => {
      throw new Error(`${spec.name} Image binding failed: ${describeError(error)}`);
    });
    if (!isBoundTo((await icons[index].getSettings()).assetId, prop.id)) {
      throw new Error(`${spec.name} image binding did not pass readback.`);
    }
  }
  return "Nine replaceable icon properties saved and bound to native Images; each retained its site SVG as the default.";
}

async function bindSecondaryVisibility(report: (message: string) => void, alpha = false): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (!await isCoreTargetPage(alpha, site.siteName, page)) {
    throw new Error("Open the SmashBurger App API Lab draft page before binding secondary visibility.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(alpha ? ALPHA_NAME : CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no visibility properties were added.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core marker changed; no visibility properties were added.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [, secondary] = panel?.children ? await panel.getChildren() : [];
  if (!secondary?.children || !secondary.visibility || !secondary.attributes ||
    await secondary.getResolvedAttributeValue("data-mwp-secondary") === null) {
    throw new Error("The native secondary wrapper is missing or cannot bind visibility.");
  }
  const groups = await secondary.getChildren();
  if (groups.length !== 2 || !groups[0].children || !groups[1].children ||
    !groups[0].attributes || !groups[1].attributes ||
    await groups[0].getResolvedAttributeValue("data-mwp-socials") === null ||
    await groups[1].getResolvedAttributeValue("data-mwp-contacts") === null) {
    throw new Error("The social/contact groups have changed; no visibility properties were added.");
  }
  const specs = [
    { name: "Facebook", group: "Social links" },
    { name: "Instagram", group: "Social links" },
    { name: "LinkedIn", group: "Social links" },
    { name: "TikTok", group: "Social links" },
    { name: "Threads", group: "Social links" },
    { name: "X", group: "Social links" },
    { name: "WhatsApp", group: "Social links" },
    { name: "Telephone", group: "Contact links" },
    { name: "Email", group: "Contact links" },
  ] as const;
  const links = [...await groups[0].getChildren(), ...await groups[1].getChildren()];
  if (links.length !== specs.length) throw new Error("Expected nine secondary links; no visibility properties were added.");
  for (const [index, spec] of specs.entries()) {
    const link = links[index];
    if (!link.attributes || !link.visibility ||
      await link.getResolvedAttributeValue("data-mwp-secondary-item") !== spec.name.toLowerCase()) {
      throw new Error(`${spec.name} link changed or cannot bind visibility.`);
    }
  }
  const definitions: CreatePropOptions[] = [
    { type: "boolean", name: "Show secondary navigation", group: "Content", defaultValue: true },
    ...specs.map((spec): CreatePropOptions => ({
      type: "boolean", name: `Show ${spec.name}`, group: spec.group, defaultValue: true,
    })),
  ];
  const existing = await component.getProps();
  for (const expected of definitions) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== expected.type || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} has a different type or group; no visibility binding was changed.`);
    }
  }
  const missing = definitions.filter((expected) => !existing.some((prop) => prop.name === expected.name));
  if (missing.length) {
    report(`Creating ${missing.length} secondary visibility properties…`);
    await component.createProps(missing).catch((error: unknown) => {
      throw new Error(`Secondary visibility property creation failed: ${describeError(error)}`);
    });
  }
  const props = await component.getProps();
  const targets: Array<[AnyElement, string]> = [
    [secondary, "Show secondary navigation"],
    ...specs.map((spec, index): [AnyElement, string] => [links[index], `Show ${spec.name}`]),
  ];
  for (const [element, name] of targets) {
    const prop = props.find((item) => item.name === name && item.type === "boolean");
    if (!prop || !element.visibility) throw new Error(`${name} property or visibility target is missing.`);
    await element.setVisibility({ sourceType: "prop", propId: prop.id });
    if (!isBoundTo(await element.getVisibility({ bindings: true }), prop.id)) {
      throw new Error(`${name} visibility binding did not pass readback.`);
    }
  }
  return "Ten secondary visibility controls saved and bound: one master switch plus nine individual links.";
}

async function installBundledIconsOnTrial(report: (message: string) => void): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before installing bundled icons.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native core trial instance; no icons were uploaded.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native core marker changed; no icons were uploaded.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [, secondary] = panel?.children ? await panel.getChildren() : [];
  if (!secondary?.children || !secondary.attributes ||
    await secondary.getResolvedAttributeValue("data-mwp-secondary") === null) {
    throw new Error("The native secondary wrapper is missing; no icons were uploaded.");
  }
  const groups = await secondary.getChildren();
  if (groups.length !== 2 || !groups[0].children || !groups[1].children) {
    throw new Error("The native secondary groups changed; no icons were uploaded.");
  }
  const specs = [
    { key: "facebook", label: "Facebook", group: 0 },
    { key: "instagram", label: "Instagram", group: 0 },
    { key: "linkedin", label: "LinkedIn", group: 0 },
    { key: "tiktok", label: "TikTok", group: 0 },
    { key: "threads", label: "Threads", group: 0 },
    { key: "x", label: "X", group: 0 },
    { key: "whatsapp", label: "WhatsApp", group: 0 },
    { key: "telephone", label: "Telephone", group: 1 },
    { key: "email", label: "Email", group: 1 },
  ] as const;
  const links = [...await groups[0].getChildren(), ...await groups[1].getChildren()];
  if (links.length !== specs.length) throw new Error("Expected nine native secondary links; no icons were uploaded.");
  const props = await component.getProps();
  for (const [index, spec] of specs.entries()) {
    const link = links[index];
    if (!link.children || !link.attributes ||
      await link.getResolvedAttributeValue("data-mwp-secondary-item") !== spec.key) {
      throw new Error(`${spec.label} link changed; no icons were uploaded.`);
    }
    const [icon] = await link.getChildren();
    const prop = props.find((item) => item.name === `${spec.label} icon` && item.type === "image");
    if (icon?.type !== "Image" || !icon.attributes || !prop ||
      await icon.getResolvedAttributeValue("data-mwp-secondary-icon") === null ||
      !isBoundTo((await icon.getSettings()).assetId, prop.id)) {
      throw new Error(`${spec.label} native Image or property binding changed; no icons were uploaded.`);
    }
  }
  const visibleAssets = await webflow.getAllAssets();
  const visibleNames = await Promise.all(visibleAssets.map((asset) => asset.getName()));
  const installed: Array<{ label: string; asset: Asset }> = [];
  let uploaded = 0;
  for (const spec of specs) {
    const fileName = `SmashBurger App — ${spec.key} icon.svg`;
    const matches = visibleAssets.filter((_, index) => visibleNames[index] === fileName);
    if (matches.length > 1) throw new Error(`Multiple app-visible ${spec.label} icons have the same name; inspect assets before retrying.`);
    let asset = matches[0];
    if (!asset) {
      report(`Uploading bundled ${spec.label} SVG…`);
      asset = await webflow.createAsset(new File([ICON_SOURCES[spec.key]], fileName, { type: "image/svg+xml" }))
        .catch((error: unknown) => { throw new Error(`${spec.label} upload failed: ${describeError(error)}`); });
      uploaded++;
    }
    const name = await asset.getName();
    if (name !== fileName || !await webflow.getAssetById(asset.id)) {
      throw new Error(`${spec.label} asset did not pass Designer readback; no image property was changed.`);
    }
    installed.push({ label: spec.label, asset });
  }
  report(`All nine bundled SVG assets are available; updating native image defaults…`);
  for (const { label, asset } of installed) {
    const prop = props.find((item) => item.name === `${label} icon` && item.type === "image");
    if (!prop) throw new Error(`${label} image property disappeared during installation.`);
    if (prop.defaultValue !== asset.id) await component.setProp(prop.id, { defaultValue: asset.id });
  }
  const saved = await component.getProps();
  for (const { label, asset } of installed) {
    if (saved.find((item) => item.name === `${label} icon`)?.defaultValue !== asset.id) {
      throw new Error(`${label} bundled icon default did not pass readback.`);
    }
  }
  return `Bundled trial icons installed: ${uploaded} uploaded, ${9 - uploaded} reused; nine native Image property defaults now reference app-visible site assets.`;
}

async function installAlphaIcons(report: (message: string) => void): Promise<string> {
  const page = await webflow.getCurrentPage();
  if (!await page.isDraft()) throw new Error("Open the draft page containing the native alpha component.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(ALPHA_NAME)];
  if (!component || component.codeComponent !== false || component.library || component.readOnly ||
    await component.getInstanceCount() !== 1) {
    throw new Error("Expected one editable native alpha instance; no icons were installed.");
  }
  const root = await component.getRootElement();
  if (!root?.children || !root.attributes ||
    await root.getResolvedAttributeValue("data-mwp-prototype") !== "native-core-v1") {
    throw new Error("The native alpha marker changed; no icons were installed.");
  }
  const [inner] = await root.getChildren();
  const [, , panel] = inner?.children ? await inner.getChildren() : [];
  const [, secondary] = panel?.children ? await panel.getChildren() : [];
  const groups = secondary?.children ? await secondary.getChildren() : [];
  if (!secondary?.attributes || await secondary.getResolvedAttributeValue("data-mwp-secondary") === null ||
    groups.length !== 2 || !groups[0].children || !groups[1].children) {
    throw new Error("Expand the native alpha secondary links before installing icons.");
  }
  const specs = [
    { key: "facebook", label: "Facebook", group: "Social links" },
    { key: "instagram", label: "Instagram", group: "Social links" },
    { key: "linkedin", label: "LinkedIn", group: "Social links" },
    { key: "tiktok", label: "TikTok", group: "Social links" },
    { key: "threads", label: "Threads", group: "Social links" },
    { key: "x", label: "X", group: "Social links" },
    { key: "whatsapp", label: "WhatsApp", group: "Social links" },
    { key: "telephone", label: "Telephone", group: "Contact links" },
    { key: "email", label: "Email", group: "Contact links" },
  ] as const;
  const links = [...await groups[0].getChildren(), ...await groups[1].getChildren()];
  if (links.length !== specs.length) throw new Error("Expected nine native alpha secondary links.");
  const iconStyle = await style("sb-app-secondary-icon");
  await iconStyle.setProperties({ display: "block", width: "18px", height: "18px", "min-width": "18px", "max-width": "18px", "min-height": "18px", "max-height": "18px", "object-fit": "contain", "margin-right": "6px" });
  const icons: ImageElement[] = [];
  for (const [index, spec] of specs.entries()) {
    const link = links[index];
    if (!link.children || !link.attributes ||
      await link.getResolvedAttributeValue("data-mwp-secondary-item") !== spec.key) {
      throw new Error(`${spec.label} native alpha link changed; no asset was uploaded.`);
    }
    const children = await link.getChildren();
    const label = children[children.length - 1];
    if (children.length < 1 || children.length > 2 || !label?.attributes ||
      await label.getResolvedAttributeValue("data-mwp-secondary-label") === null ||
      (children.length === 2 && (children[0].type !== "Image" || !children[0].attributes ||
        await children[0].getResolvedAttributeValue("data-mwp-secondary-icon") === null))) {
      throw new Error(`${spec.label} icon or label structure changed; no asset was uploaded.`);
    }
    let icon = children.length === 2 ? children[0] : undefined;
    if (!icon) {
      report(`Adding ${spec.label} native Image…`);
      icon = await link.prepend(webflow.elementPresets.Image);
    }
    if (icon.type !== "Image" || !icon.attributes) throw new Error(`${spec.label} Image could not be created.`);
    await icon.setAttribute("data-mwp-secondary-icon", "");
    await icon.setStyles([iconStyle]);
    await icon.setAltText("");
    icons.push(icon);
  }
  const visibleAssets = await webflow.getAllAssets();
  const visibleNames = await Promise.all(visibleAssets.map((asset) => asset.getName()));
  const installed: Array<{ label: string; group: string; asset: Asset }> = [];
  let uploaded = 0;
  for (const spec of specs) {
    const fileName = `SmashBurger App — ${spec.key} icon.svg`;
    const matches = visibleAssets.filter((_, index) => visibleNames[index] === fileName);
    if (matches.length > 1) throw new Error(`Multiple app-visible ${spec.label} icons share one name; inspect assets before retrying.`);
    let asset = matches[0];
    if (!asset) {
      report(`Uploading bundled ${spec.label} SVG…`);
      asset = await webflow.createAsset(new File([ICON_SOURCES[spec.key]], fileName, { type: "image/svg+xml" }));
      uploaded++;
    }
    if (await asset.getName() !== fileName || !await webflow.getAssetById(asset.id)) {
      throw new Error(`${spec.label} asset did not pass Designer readback.`);
    }
    installed.push({ label: spec.label, group: spec.group, asset });
  }
  const existing = await component.getProps();
  for (const { label, group, asset } of installed) {
    const found = existing.find((prop) => prop.name === `${label} icon`);
    if (found && (found.type !== "image" || found.group !== group || found.defaultValue !== asset.id)) {
      throw new Error(`${label} icon property differs from the bundled asset; no default was replaced.`);
    }
  }
  const missing: CreatePropOptions[] = installed.filter(({ label }) => !existing.some((prop) => prop.name === `${label} icon`))
    .map(({ label, group, asset }) => ({ type: "image", name: `${label} icon`, group, defaultValue: asset.id }));
  if (missing.length) await component.createProps(missing);
  const props = await component.getProps();
  for (const [index, { label, asset }] of installed.entries()) {
    const prop = props.find((item) => item.name === `${label} icon` && item.type === "image");
    if (!prop || prop.defaultValue !== asset.id) throw new Error(`${label} icon property did not pass readback.`);
    await icons[index].setSettings({ assetId: { sourceType: "prop", propId: prop.id } });
    if (!isBoundTo((await icons[index].getSettings()).assetId, prop.id)) {
      throw new Error(`${label} Image binding did not pass readback.`);
    }
  }
  return `Native alpha icons installed: ${uploaded} uploaded, ${9 - uploaded} reused; nine native Images and image properties verified.`;
}

async function createNativeCore(report: (message: string) => void, alpha = false): Promise<void> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (alpha ? !await page.isDraft() : site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error(alpha ? "The native alpha can only be created on a draft page." :
      "Open the SmashBurger App API Lab draft page before creating the native core.");
  }
  const elements = await webflow.getAllElements();
  for (const element of elements) {
    if (element.attributes &&
      await element.getResolvedAttributeValue("data-mwp-prototype") === "native-core-v1") {
      throw new Error("A native core trial already exists on this draft page; no duplicate was created.");
    }
  }
  const body = elements.find((element) => element.type === "Body");
  if (!body?.children) throw new Error("The draft lab page Body is not available.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((component) => component.getName()));
  if (names.includes(alpha ? ALPHA_NAME : CORE_NAME)) throw new Error("The native core component already exists; no duplicate was created.");

  report("Creating project-native layout classes…");
  const [rootStyle, innerStyle, brandStyle, menuStyle, summaryStyle, iconStyle, lineStyle, panelStyle, linksStyle, linkStyle, backdropStyle] = await Promise.all([
    style("sb-app-nav"), style("sb-app-inner"), style("sb-app-brand"), style("sb-app-menu"),
    style("sb-app-summary"), style("sb-app-icon"), style("sb-app-icon-line"),
    style("sb-app-panel"), style("sb-app-links"), style("sb-app-link"), style("sb-app-backdrop"),
  ]);
  await rootStyle.setProperties({ "background-color": "#17251e", color: "#ffffff", "padding-top": "16px", "padding-bottom": "16px", "padding-left": "24px", "padding-right": "24px" });
  await innerStyle.setProperties({ display: "flex", "align-items": "center", "justify-content": "space-between", gap: "20px" });
  await brandStyle.setProperties({ color: "#ffffff", "text-decoration": "none", "font-weight": "700" });
  await menuStyle.setProperties({ display: "none" });
  await summaryStyle.setProperties({ display: "flex", "align-items": "center", gap: "10px", cursor: "pointer" });
  await iconStyle.setProperties({ display: "flex", "flex-direction": "column", gap: "5px", width: "20px", height: "16px", overflow: "visible", "flex-shrink": "0" });
  await lineStyle.setProperties({ display: "block", width: "20px", height: "2px", "min-width": "20px", "max-width": "20px", "min-height": "2px", "max-height": "2px", "flex-shrink": "0", "background-color": "currentColor" });
  await panelStyle.setProperties({ display: "flex", "align-items": "center" });
  await linksStyle.setProperties({ display: "flex", "align-items": "center", gap: "20px" });
  await linkStyle.setProperties({ color: "#ffffff", "text-decoration": "none" });
  await backdropStyle.setProperties({ position: "fixed", top: "0", right: "0", bottom: "0", left: "0", opacity: "0", visibility: "hidden", "pointer-events": "none" });
  await rootStyle.setProperties({ "padding-left": "20px", "padding-right": "20px" }, { breakpoint: "medium" });
  await innerStyle.setProperties({ "flex-wrap": "wrap" }, { breakpoint: "medium" });
  await menuStyle.setProperties({ display: "block" }, { breakpoint: "medium" });
  await panelStyle.setProperties({ "flex-basis": "100%" }, { breakpoint: "medium" });
  await linksStyle.setProperties({ "flex-direction": "column", "align-items": "flex-start" }, { breakpoint: "medium" });
  await rootStyle.setProperties({ "padding-left": "16px", "padding-right": "16px" }, { breakpoint: "small" });
  await rootStyle.setProperties({ "padding-left": "12px", "padding-right": "12px" }, { breakpoint: "tiny" });

  report("Building the native header, details trigger and shared links…");
  const root = await body.append(webflow.elementPresets.DivBlock);
  await root.setAttribute("data-mwp-prototype", "native-core-v1");
  await root.setAttribute("data-mwp-navbar", "");
  await root.setTag("header");
  await root.setStyles([rootStyle]);
  for (const [name, value] of Object.entries({
    "data-collapse": "tablet",
    "data-layout": "dropdown", "data-motion": "dropdown", "data-align": "right",
    "data-close-on-link": "true", "data-close-on-outside": "true", "data-focus-first": "false",
  })) await root.setAttribute(name, value);
  const inner = await root.append(webflow.elementPresets.DivBlock);
  await inner.setStyles([innerStyle]);
  await inner.setAttribute("data-mwp-inner", "");
  const brand = await inner.append(webflow.elementPresets.TextLink);
  await brand.setStyles([brandStyle]);
  await brand.setSettings("url", "#");
  await brand.setTextContent("SmashBurger");
  await brand.setAttribute("aria-label", "SmashBurger home");
  const menu = await inner.append(webflow.elementPresets.DOM);
  await menu.setTag("details");
  await menu.setStyles([menuStyle]);
  await menu.setAttribute("data-mwp-menu", "");
  const summary = await menu.append(webflow.elementPresets.DOM);
  await summary.setTag("summary");
  await summary.setStyles([summaryStyle]);
  await summary.setAttribute("data-mwp-trigger", "");
  await summary.setAttribute("aria-label", "Navigation menu");
  const label = await summary.append(webflow.elementPresets.DOM);
  await label.setTag("span");
  await label.setAttribute("data-mwp-label", "");
  await label.setTextContent("Menu");
  const icon = await summary.append(webflow.elementPresets.DivBlock);
  await icon.setStyles([iconStyle]);
  await icon.setAttribute("data-mwp-icon", "");
  await icon.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 3; index++) {
    const line = await icon.append(webflow.elementPresets.DivBlock);
    await line.setStyles([lineStyle]);
    await line.setAttribute("data-mwp-line", "");
  }
  const panel = await inner.append(webflow.elementPresets.DivBlock);
  await panel.setTag("nav");
  await panel.setStyles([panelStyle]);
  await panel.setAttribute("data-mwp-panel", "");
  await panel.setAttribute("aria-label", "Primary navigation");
  const links = await panel.append(webflow.elementPresets.DivBlock);
  await links.setStyles([linksStyle]);
  await links.setAttribute("data-mwp-links", "");
  for (const text of ["Home", "About", "Contact"]) {
    const link = await links.append(webflow.elementPresets.TextLink);
    await link.setStyles([linkStyle]);
    await link.setSettings("url", "#");
    await link.setTextContent(text);
    await link.setAttribute("data-mwp-item", "");
  }
  const backdrop = await root.append(webflow.elementPresets.DivBlock);
  await backdrop.setStyles([backdropStyle]);
  await backdrop.setAttribute("data-mwp-backdrop", "");
  await backdrop.setAttribute("aria-hidden", "true");
  const embed = await root.append(webflow.elementPresets.HtmlEmbed);
  await embed.setSettings({ code: CORE_EMBED_CODE });
  report("Registering the native core as a project component…");
  const component = await webflow.registerComponent({
    name: alpha ? ALPHA_NAME : CORE_NAME, group: "SmashBurger experiments",
    description: "Draft-only native generator experiment, with a pinned runtime Embed.",
  }, root);
  report(await configureNativeCore(report, component, alpha));
}

async function createProof(report: (message: string) => void, anchor?: AnyElement): Promise<void> {
  const selected = anchor ?? await webflow.getSelectedElement();
  if (!selected?.children) throw new Error("Select a page container that can hold children.");
  const components = await webflow.getAllComponents();
  if ((await Promise.all(components.map((item) => item.getName()))).includes(PROOF_NAME)) {
    throw new Error("The proof component is already present; no duplicate was created.");
  }
  for (const child of await selected.getChildren()) {
    if (child.attributes && await child.getResolvedAttributeValue("data-mwp-prototype") === "api-proof-v1") {
      throw new Error("An unfinished proof structure is already present here. Inspect it before retrying.");
    }
  }
  report("Creating native classes and responsive styles…");
  const queries = await webflow.getAllMediaQueries();
  const navStyle = await style("sb-proof-nav");
  const rowStyle = await style("sb-proof-row");
  const linkStyle = await style("sb-proof-link");
  await navStyle.setProperties({ "background-color": "#17251e", color: "#ffffff", padding: "16px 24px" });
  await rowStyle.setProperties({ display: "flex", "align-items": "center", "justify-content": "space-between", gap: "16px" });
  await linkStyle.setProperties({ color: "#ffffff", "text-decoration": "none" });
  const responsivePadding: Partial<Record<BreakpointId, string>> = {
    large: "20px 32px", xl: "22px 36px", xxl: "24px 40px",
    medium: "16px 20px", small: "14px 18px", tiny: "12px 16px",
  };
  for (const query of queries) {
    const padding = responsivePadding[query.id];
    if (padding) await navStyle.setProperties({ padding }, { breakpoint: query.id });
  }
  if (queries.some((query) => query.id === "medium")) {
    await rowStyle.setProperties({ "flex-wrap": "wrap" }, { breakpoint: "medium" });
  }

  report("Inserting the editable proof structure…");
  const inserted = await selected.append(webflow.elementPresets.DivBlock);
  await inserted.setAttribute("data-mwp-prototype", "api-proof-v1");
  await inserted.setTag("header");
  await inserted.setStyles([navStyle]);
  const row = await inserted.append(webflow.elementPresets.DivBlock);
  await row.setStyles([rowStyle]);
  const brand = await row.append(webflow.elementPresets.TextLink);
  await brand.setStyles([linkStyle]);
  await brand.setSettings("url", "#");
  await brand.setTextContent("SmashBurger proof");
  const nav = await row.append(webflow.elementPresets.DivBlock);
  await nav.setTag("nav");
  await nav.setAttribute("aria-label", "Proof navigation");
  await nav.setStyles([rowStyle]);
  for (const label of ["Home", "About", "Contact"]) {
    const link = await nav.append(webflow.elementPresets.TextLink);
    await link.setStyles([linkStyle]);
    await link.setSettings("url", "#");
    await link.setTextContent(label);
  }
  report("Making a project component with variants and grouped properties…");
  const component = await webflow.registerComponent({
    name: PROOF_NAME, group: "SmashBurger experiments",
    description: "Disposable API fixture; not the production navbar.",
  }, inserted);
  await component.setVariant("base", { name: "Mobile landscape" });
  for (const name of ["Never", "Tablet", "Mobile portrait", "Always"]) await component.createVariant(name);
  const [labelProp, ariaProp] = await component.createProps([
    { type: "string", name: "Brand accessible label", group: "Accessibility", defaultValue: "SmashBurger proof" },
    { type: "string", name: "Navigation label", group: "Accessibility", defaultValue: "Proof navigation" },
  ]);
  const componentRoot = await component.getRootElement();
  if (!componentRoot?.children) throw new Error("Component created, but its root cannot be inspected.");
  const [innerRow] = await componentRoot.getChildren();
  if (!innerRow?.children) throw new Error("Component created, but its row cannot be inspected.");
  const [brandLink, navElement] = await innerRow.getChildren();
  if (!brandLink?.attributes || !navElement?.attributes) {
    throw new Error("Component created, but its native links do not support attribute bindings.");
  }
  await brandLink.setAttribute("aria-label", { sourceType: "prop", propId: labelProp.id });
  await navElement.setAttribute("aria-label", { sourceType: "prop", propId: ariaProp.id });
  report(await verifyProof());
}

async function createLabAndProof(report: (message: string) => void): Promise<void> {
  const site = await webflow.getSiteInfo();
  if (site.siteName !== "Smashburger") {
    throw new Error("This private lab action is limited to the Smashburger test site.");
  }
  const components = await webflow.getAllComponents();
  if ((await Promise.all(components.map((item) => item.getName()))).includes(PROOF_NAME)) {
    throw new Error("The proof component already exists. No page or component was duplicated.");
  }
  report("Finding or creating the draft lab page…");
  const pages = (await webflow.getAllPagesAndFolders()).filter((item): item is Page => item.type === "Page");
  const slugs = await Promise.all(pages.map((page) => page.getSlug()));
  let page = pages.find((_, index) => slugs[index] === LAB_PAGE_SLUG);
  if (!page) {
    page = await webflow.createPage();
    await page.setName("SmashBurger App API Lab");
    await page.setSlug(LAB_PAGE_SLUG);
  }
  await page.setDraft(true);
  await webflow.switchPage(page);
  const body = (await webflow.getAllElements()).find((element) => element.type === "Body");
  if (!body) throw new Error("The draft page opened, but its Body element was not available.");
  await createProof(report, body);
}

const App: React.FC = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [message, setMessage] = useState("Select an element, then inspect it.");
  const [busy, setBusy] = useState(false);
  const [originalLinkDefaults, setOriginalLinkDefaults] = useState<Record<string, string> | null>(null);
  const [linkDefaults, setLinkDefaults] = useState<Record<string, string> | null>(null);
  const [linkOverrides, setLinkOverrides] = useState<string[] | null>(null);
  const refresh = async (): Promise<void> => {
    setBusy(true);
    try { setSnapshot(await inspect()); setMessage("Inspection updated."); }
    catch (error) { setMessage(`Inspection failed: ${String(error)}`); }
    finally { setBusy(false); }
  };
  useEffect(() => {
    void webflow.setExtensionSize("comfortable").catch(() => undefined);
    void refresh();
  }, []);
  const makeProof = async (): Promise<void> => {
    setBusy(true);
    try { await createProof(setMessage); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Proof stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const makeLab = async (): Promise<void> => {
    setBusy(true);
    try { await createLabAndProof(setMessage); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Lab stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const checkProof = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await verifyProof()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Verification stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const checkVariantAttributes = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await probeVariantAttributes()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Variant attribute probe stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const checkLab = async (): Promise<void> => {
    setBusy(true);
    try {
      const styles = await verifyResponsiveStyles().catch((error) => `Style check stopped: ${String(error)}`);
      setMessage(`${styles}. Checking Embed API…`);
      const embed = await probeEmbed();
      setMessage(`${styles}. ${embed}.`);
      setSnapshot(await inspect());
    } catch (error) { setMessage(`Lab check stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const tryNativeCore = async (): Promise<void> => {
    setBusy(true);
    try { await createNativeCore(setMessage); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native core stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const configureCore = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeCore(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native core configuration stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const configureContent = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeContent(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native content configuration stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const configurePrimary = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativePrimary(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native primary navigation stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const configureSubmenu = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeSubmenu(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native submenu stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureSubmenuProperties = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeSubmenuProperties(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native submenu properties stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureMotion = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeMotion(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native motion controls stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureSecondary = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureNativeSecondary(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native secondary navigation stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const configureIcons = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await bindNativeIcons(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native icon binding stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureSecondaryVisibility = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await bindSecondaryVisibility(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Secondary visibility stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const installTrialIcons = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await installBundledIconsOnTrial(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Bundled icon install stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const checkAssets = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await checkAssetAccess()); }
    catch (error) { setMessage(`Asset access check stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const checkInstallTarget = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await checkInstallReadiness()); }
    catch (error) { setMessage(`Install preflight stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const checkAlphaLinks = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await checkAlphaLinkDefaults()); }
    catch (error) { setMessage(`Alpha link audit stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const checkInstanceLinks = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await checkSelectedAlphaLinks()); }
    catch (error) { setMessage(`Alpha instance link check stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const loadLinkDefaults = async (): Promise<void> => {
    setBusy(true);
    try {
      const values = await loadAlphaLinkDefaults();
      const overrides = await selectedAlphaLinkOverrides();
      setOriginalLinkDefaults(values);
      setLinkDefaults({ ...values });
      setLinkOverrides(overrides);
      setMessage(`Loaded 16 alpha link defaults.${overrides ? ` Selected instance has ${overrides.length} link override(s).` : " Select the alpha instance to see its overrides."} Edit only the destinations you want to set, then save.`);
    } catch (error) { setMessage(`Link defaults could not be loaded: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const saveLinkDefaults = async (): Promise<void> => {
    if (!originalLinkDefaults || !linkDefaults) return;
    const changes = Object.fromEntries(ALPHA_DESTINATION_NAMES.filter((name) =>
      linkDefaults[name] !== originalLinkDefaults[name]).map((name) => [name, linkDefaults[name]]));
    setBusy(true);
    try {
      const result = await saveAlphaLinkDefaults(changes, setMessage);
      const values = await loadAlphaLinkDefaults();
      const overrides = await selectedAlphaLinkOverrides();
      setOriginalLinkDefaults(values);
      setLinkDefaults({ ...values });
      setLinkOverrides(overrides);
      setMessage(result);
    } catch (error) { setMessage(`Link default save stopped: ${describeError(error)} Reload defaults before another save.`); }
    finally { setBusy(false); }
  };
  const refreshAlphaBackdrop = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await updateAlphaBackdrop()); }
    catch (error) { setMessage(`Alpha backdrop update stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const createScrollFixture = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await addScrollTestContent()); }
    catch (error) { setMessage(`Scroll test content stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const installAlpha = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await installNativeAlpha(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native alpha install stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const installAllAlpha = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await installCompleteAlpha(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Complete alpha install stopped: ${describeError(error)} Inspect the draft before using a phase action to resume.`); }
    finally { setBusy(false); }
  };
  const expandAlpha = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await expandNativeAlpha(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native alpha expansion stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const bindAlphaCta = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await bindAlphaCtaContent(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native CTA binding stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const bindAlphaLabel = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await bindAlphaMenuLabel()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native Menu label binding stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const installAlphaImages = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await installAlphaIcons(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native alpha icons stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const repairAlphaCollapse = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await repairAlphaCollapseDefault()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native alpha collapse repair stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureAlphaCollapse = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureAlphaVariants(setMessage)); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native alpha variants stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const inspectAlphaCollapse = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await inspectAlphaVariantState()); }
    catch (error) { setMessage(`Alpha variant inspection stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const checkUpload = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await probeAssetUpload()); }
    catch (error) { setMessage(`Asset upload proof stopped: ${describeError(error)}`); }
    finally { setBusy(false); }
  };
  const configureVariants = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await configureCoreVariants()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Native core variants stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const activateVariants = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await activateCoreVariants()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Variant bridge stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  const styleVariants = async (): Promise<void> => {
    setBusy(true);
    try { setMessage(await styleCoreVariants()); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Variant styling stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  return <main>
    <div className="eyebrow">SmashBurger · private prototype</div>
    <h1>{snapshot?.site === "Smashburger" ? "Designer capability check" : "Native alpha installer"}</h1>
    <p>{snapshot?.site === "Smashburger"
      ? "Inspect the private API Lab or use its individual capability tests."
      : "Use a clean draft page for this private alpha. Check the target before installing; inspect Canvas and Preview before publishing."}</p>
    <div className="actions">
      <button disabled={busy} onClick={() => { void refresh(); }}>Inspect selection</button>
      <button className="secondary" disabled={busy} onClick={() => { void checkInstallTarget(); }}>Check install target (read only)</button>
      <button className="secondary" disabled={busy} onClick={() => { void checkAlphaLinks(); }}>Check alpha link defaults (read only)</button>
      <button className="secondary" disabled={busy} onClick={() => { void checkInstanceLinks(); }}>Check selected alpha links (read only)</button>
      <button disabled={busy} onClick={() => { void installAllAlpha(); }}>Install complete alpha on clean draft</button>
    </div>
    <details className="toolbox">
      <summary>Set link destinations</summary>
      <p className="toolbox-note">Load the alpha component defaults, edit the links you need, and save. Only changed fields are written. Instance overrides may take precedence; this does not publish the page.</p>
      <button className="secondary" disabled={busy} onClick={() => { void loadLinkDefaults(); }}>Load current defaults</button>
      {linkDefaults && <div className="link-fields">
        {linkOverrides && <p className="toolbox-note">Selected instance: {linkOverrides.length ? `${linkOverrides.length} link override(s). Fields marked below will continue to use their instance value.` : "no link overrides."}</p>}
        {ALPHA_DESTINATION_GROUPS.map((group) => <fieldset key={group.title}>
          <legend>{group.title}</legend>
          {group.names.map((name) => <label key={name}>
            <span>{name.replace(" destination", "")}</span>
            <input type="text" value={linkDefaults[name] ?? ""} placeholder="/page or https://example.com"
              disabled={busy} onChange={(event) => setLinkDefaults((current) => current ? { ...current, [name]: event.target.value } : current)} />
            {linkOverrides?.includes(name) && <span className="link-override">Instance override: this menu uses its own value.</span>}
          </label>)}
        </fieldset>)}
        <button disabled={busy || !originalLinkDefaults || !ALPHA_DESTINATION_NAMES.some((name) => linkDefaults[name] !== originalLinkDefaults[name])}
          onClick={() => { void saveLinkDefaults(); }}>Save changed defaults</button>
      </div>}
    </details>
    <details className="toolbox">
      <summary>Individual alpha actions and recovery</summary>
      <div className="actions">
        <button className="secondary" disabled={busy} onClick={() => { void installAlpha(); }}>Install native alpha on draft page</button>
        <button className="secondary" disabled={busy} onClick={() => { void expandAlpha(); }}>Expand native alpha on draft page</button>
        <button className="secondary" disabled={busy} onClick={() => { void bindAlphaCta(); }}>Bind alpha CTA content</button>
        <button className="secondary" disabled={busy} onClick={() => { void bindAlphaLabel(); }}>Bind alpha Menu label</button>
        <button className="secondary" disabled={busy} onClick={() => { void installAlphaImages(); }}>Install native alpha icons</button>
        <button className="secondary" disabled={busy} onClick={() => { void repairAlphaCollapse(); }}>Repair alpha Tablet default</button>
        <button className="secondary" disabled={busy} onClick={() => { void inspectAlphaCollapse(); }}>Inspect alpha variants (read only)</button>
        <button className="secondary" disabled={busy} onClick={() => { void configureAlphaCollapse(); }}>Configure native alpha variants</button>
        <button className="secondary" disabled={busy} onClick={() => { void refreshAlphaBackdrop(); }}>Update alpha backdrop rules</button>
        <button className="secondary" disabled={busy} onClick={() => { void createScrollFixture(); }}>Add scroll test content to /sb-test</button>
      </div>
    </details>
    {snapshot?.site === "Smashburger" && <details className="toolbox">
      <summary>API Lab capability tools</summary>
      <div className="actions">
      <button className="secondary" disabled={busy || !snapshot?.canAppend || snapshot.proofExists} onClick={() => { void makeProof(); }}>Create native proof</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || snapshot.proofExists} onClick={() => { void makeLab(); }}>Create draft lab and proof</button>
      <button className="secondary" disabled={busy || !snapshot?.proofExists} onClick={() => { void checkProof(); }}>Verify existing proof</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void checkVariantAttributes(); }}>Probe proof variant attributes</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void checkLab(); }}>Check styles + Embed API</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists || snapshot.nativeCoreExists} onClick={() => { void tryNativeCore(); }}>Create native core trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureCore(); }}>Configure native core trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureContent(); }}>Configure native content trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configurePrimary(); }}>Build native primary navigation</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureSubmenu(); }}>Build native submenu</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureSubmenuProperties(); }}>Bind native submenu properties</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureMotion(); }}>Bind native motion controls</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureSecondary(); }}>Build native secondary links</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureIcons(); }}>Bind native icon properties</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureSecondaryVisibility(); }}>Bind secondary visibility</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void installTrialIcons(); }}>Install bundled icons on trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger"} onClick={() => { void checkAssets(); }}>Check asset access</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger"} onClick={() => { void checkUpload(); }}>Test one asset upload</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureVariants(); }}>Create core variant names</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void activateVariants(); }}>Activate core variant bridge</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void styleVariants(); }}>Style core variants</button>
      </div>
    </details>}
    <p className="status" role="status">{message}</p>
    {snapshot && <dl>
      <dt>Site</dt><dd>{snapshot.site}</dd>
      <dt>Selection</dt><dd>{snapshot.selected}</dd>
      <dt>Component</dt><dd>{snapshot.component} · {snapshot.origin}</dd>
      <dt>Navbar marker</dt><dd>{snapshot.marker}</dd>
      <dt>Breakpoints</dt><dd>{snapshot.breakpoints.join(", ")}</dd>
      <dt>Variants</dt><dd>{snapshot.variants.join(", ") || "—"}</dd>
      <dt>Properties</dt><dd>{snapshot.propertyCount} · {snapshot.propertyGroups.join(", ") || "No groups"}</dd>
      <dt>Instance overrides</dt><dd>{snapshot.overrides.join(", ") || "None"}</dd>
      <dt>WHTML hooks</dt><dd>{snapshot.hooks.join(", ") || "None found"}</dd>
      <dt>Make local</dt><dd>{snapshot.adoption}</dd>
      <dt>WHTML export</dt><dd>{snapshot.whtml ? "Available" : "Unavailable for this selection"}</dd>
      <dt>Proof on site</dt><dd>{snapshot.proofExists ? "Present" : "Absent"}</dd>
      <dt>Native core on site</dt><dd>{snapshot.nativeCoreExists ? "Present" : "Absent"}</dd>
    </dl>}
  </main>;
};

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing root element");
ReactDOM.createRoot(rootEl).render(<App />);
