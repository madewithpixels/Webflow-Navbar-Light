import type {} from "@webflow/designer-extension-typings";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import cdnLoader from "../../webflow/navbar-light-cdn-loader.html";

const PROOF_NAME = "SmashBurger API proof";
const LAB_PAGE_SLUG = "smashburger-app-api-lab";
const CORE_NAME = "SmashBurger native core trial";
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
const CORE_DISPLAY_BRIDGE = `<style>
.sb-app-nav[data-collapse="always"] .sb-app-menu,
.sb-app-nav[data-mwp-collapsed="true"] .sb-app-menu { display: block; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-inner { flex-wrap: nowrap; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-menu { display: none; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-panel { flex-basis: auto; }
.sb-app-nav[data-mwp-collapsed="false"] .sb-app-links { flex-direction: row; align-items: center; }
.sb-app-nav .sb-app-infrastructure { display: none; }
</style>`;
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

async function style(name: string): Promise<Style> {
  return (await webflow.getStyleByName(name)) ?? webflow.createStyle(name);
}

function isBoundTo(value: unknown, propId: string): boolean {
  return typeof value === "object" && value !== null &&
    "sourceType" in value && value.sourceType === "prop" &&
    "propId" in value && value.propId === propId;
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

async function configureCoreVariants(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before configuring core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
  if (!component || component.library || component.readOnly) {
    throw new Error("The editable native core trial is not present.");
  }
  const expected = ["Never", "Tablet", "Mobile landscape", "Mobile portrait", "Always"];
  let variants = await component.getVariants();
  if (variants.some((variant) => ![...expected, "Base"].includes(variant.name))) {
    throw new Error("The native core has an unexpected variant; inspect it before changing variants.");
  }
  if (variants[0]?.id !== "base") throw new Error("The native core Base variant is unavailable.");
  if (variants[0].name === "Base") await component.setVariant("base", { name: "Mobile landscape" });
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

async function activateCoreVariants(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before activating core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
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
  if (code !== CORE_EMBED_CODE_V2 && code !== CORE_EMBED_CODE_V3 && code !== CORE_EMBED_CODE) {
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

async function styleCoreVariants(): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before styling core variants.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
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
  await apply(false, { breakpoint: "medium" });
  await apply(true, { breakpoint: "small" });
  await apply(true, { variantId: variantId("Tablet"), breakpoint: "medium" });
  await apply(false, { variantId: variantId("Never"), breakpoint: "small" });
  await apply(false, { variantId: variantId("Mobile portrait"), breakpoint: "small" });
  await apply(true, { variantId: variantId("Mobile portrait"), breakpoint: "tiny" });
  await apply(true, { variantId: variantId("Always") });
  await apply(true, { variantId: variantId("Always"), breakpoint: "medium" });
  const checks = await Promise.all([
    menu.getProperty("display", { breakpoint: "medium" }),
    menu.getProperty("display", { breakpoint: "small" }),
    menu.getProperty("display", { variantId: variantId("Tablet"), breakpoint: "medium" }),
    menu.getProperty("display", { variantId: variantId("Never"), breakpoint: "small" }),
    menu.getProperty("display", { variantId: variantId("Mobile portrait"), breakpoint: "tiny" }),
    menu.getProperty("display", { variantId: variantId("Always") }),
  ]);
  if (checks.join(",") !== "none,block,block,none,block,block") {
    throw new Error(`Native core variant styles did not pass readback: ${checks.join(", ")}`);
  }
  if (primary) {
    const primaryChecks = await Promise.all([
      primary.getProperty("flex-direction", { breakpoint: "medium" }),
      primary.getProperty("flex-direction", { breakpoint: "small" }),
      primary.getProperty("flex-direction", { variantId: variantId("Tablet"), breakpoint: "medium" }),
      primary.getProperty("flex-direction", { variantId: variantId("Never"), breakpoint: "small" }),
      primary.getProperty("flex-direction", { variantId: variantId("Mobile portrait"), breakpoint: "tiny" }),
      primary.getProperty("flex-direction", { variantId: variantId("Always") }),
    ]);
    if (primaryChecks.join(",") !== "row,column,column,row,column,column") {
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

async function configureNativeCore(report: (message: string) => void, knownComponent?: Component): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before configuring its native core.");
  }
  const components = knownComponent ? [knownComponent] : await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
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
  if (existingCode !== cdnLoader && existingCode !== CORE_EMBED_CODE_V1 && existingCode !== CORE_EMBED_CODE_V2 && existingCode !== CORE_EMBED_CODE_V3 && existingCode !== CORE_EMBED_CODE) {
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

  const existing = await component.getProps();
  for (const expected of CORE_PROPERTIES) {
    const found = existing.find((prop) => prop.name === expected.name);
    if (found && (found.type !== "string" || found.group !== expected.group)) {
      throw new Error(`Property ${expected.name} already exists with a different type or group; no bindings were changed.`);
    }
  }
  const missing = CORE_PROPERTIES.filter((expected) => !existing.some((prop) => prop.name === expected.name));
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

async function configureNativeContent(report: (message: string) => void): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before configuring native content.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((component) => component.getName()));
  const component = components[names.indexOf(CORE_NAME)];
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
  const links = await linksContainer.getChildren();
  if (links.length !== 3 || links.some((link) => link.type !== "Link")) {
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

async function configureNativePrimary(report: (message: string) => void): Promise<string> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before expanding its native navigation.");
  }
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((item) => item.getName()));
  const component = components[names.indexOf(CORE_NAME)];
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

async function createNativeCore(report: (message: string) => void): Promise<void> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before creating the native core.");
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
  if (names.includes(CORE_NAME)) throw new Error("The native core component already exists; no duplicate was created.");

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
  await root.setTag("header");
  await root.setStyles([rootStyle]);
  for (const [name, value] of Object.entries({
    "data-mwp-prototype": "native-core-v1", "data-mwp-navbar": "", "data-collapse": "tablet",
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
    name: CORE_NAME, group: "SmashBurger experiments",
    description: "Draft-only native generator trial, with a pinned runtime Embed.",
  }, root);
  report(await configureNativeCore(report, component));
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
    <h1>Designer capability check</h1>
    <p>Inspect a navbar or create a disposable native proof on a spare page. This is not the production menu.</p>
    <div className="actions">
      <button disabled={busy} onClick={() => { void refresh(); }}>Inspect selection</button>
      <button className="secondary" disabled={busy || !snapshot?.canAppend || snapshot.proofExists} onClick={() => { void makeProof(); }}>Create native proof</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || snapshot.proofExists} onClick={() => { void makeLab(); }}>Create draft lab and proof</button>
      <button className="secondary" disabled={busy || !snapshot?.proofExists} onClick={() => { void checkProof(); }}>Verify existing proof</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void checkVariantAttributes(); }}>Probe proof variant attributes</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void checkLab(); }}>Check styles + Embed API</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists || snapshot.nativeCoreExists} onClick={() => { void tryNativeCore(); }}>Create native core trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureCore(); }}>Configure native core trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureContent(); }}>Configure native content trial</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configurePrimary(); }}>Build native primary navigation</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void configureVariants(); }}>Create core variant names</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void activateVariants(); }}>Activate core variant bridge</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.nativeCoreExists} onClick={() => { void styleVariants(); }}>Style core variants</button>
    </div>
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
