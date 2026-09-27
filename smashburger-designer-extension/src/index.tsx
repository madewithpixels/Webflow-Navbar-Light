import type {} from "@webflow/designer-extension-typings";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const PROOF_NAME = "SmashBurger API proof";
const LAB_PAGE_SLUG = "smashburger-app-api-lab";

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
    whtml: Boolean(whtml),
  };
}

async function style(name: string): Promise<Style> {
  return (await webflow.getStyleByName(name)) ?? webflow.createStyle(name);
}

function isBoundTo(value: string | BindingValue | null, propId: string): boolean {
  return typeof value === "object" && value !== null &&
    value.sourceType === "prop" && value.propId === propId;
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
  const checks = [
    missingVariants.length === 0 && variants.length === expectedVariants.length
      ? "five variants saved" : `variant mismatch (${variants.map((variant) => variant.name).join(", ")})`,
    brandProp && navProp ? "two authored string properties saved" : "authored property missing",
    brandProp && isBoundTo(brandBinding, brandProp.id)
      ? "brand label bound" : `brand label binding missing (${JSON.stringify(brandBinding)})`,
    navProp && isBoundTo(navBinding, navProp.id)
      ? "navigation label bound" : `navigation label binding missing (${JSON.stringify(navBinding)})`,
  ];
  const passed = missingVariants.length === 0 && variants.length === expectedVariants.length &&
    Boolean(brandProp && navProp) && Boolean(brandProp && isBoundTo(brandBinding, brandProp.id)) &&
    Boolean(navProp && isBoundTo(navBinding, navProp.id));
  return `${passed ? "Proof verified" : "Proof needs attention"}: ${checks.join("; ")}. Webflow also has ${props.length - 2} generated component property.`;
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

async function testWHTMLImport(report: (message: string) => void): Promise<void> {
  const site = await webflow.getSiteInfo();
  const page = await webflow.getCurrentPage();
  if (site.siteName !== "Smashburger" || await page.getSlug() !== LAB_PAGE_SLUG) {
    throw new Error("Open the SmashBurger App API Lab draft page before testing WHTML import.");
  }
  if (!webflow.getWHTML || !webflow.insertElementFromWHTML) {
    throw new Error("This Designer session does not expose WHTML export and import.");
  }
  const elements = await webflow.getAllElements();
  for (const element of elements) {
    if (element.attributes &&
      await element.getResolvedAttributeValue("data-mwp-prototype") === "whtml-proof-v1") {
      report("A marked WHTML import already exists on this draft page; no duplicate was created.");
      return;
    }
  }
  const body = elements.find((element) => element.type === "Body");
  if (!body?.children) throw new Error("The draft lab page Body is not available.");
  const components = await webflow.getAllComponents();
  const names = await Promise.all(components.map((component) => component.getName()));
  const proof = components[names.indexOf(PROOF_NAME)];
  if (!proof || proof.library) throw new Error("The native project proof component is not available.");
  const root = await proof.getRootElement();
  if (!root) throw new Error("The native proof root is not available for WHTML export.");
  report("Exporting the native proof component tree as WHTML…");
  const exported = await webflow.getWHTML(root);
  if (!exported?.whtml) throw new Error("WHTML export returned no markup for the native proof.");
  report("Importing that markup as a native draft-page element…");
  const imported = await webflow.insertElementFromWHTML(exported.whtml, body);
  if (imported.attributes) await imported.setAttribute("data-mwp-prototype", "whtml-proof-v1");
  const styles = imported.styles ? await imported.getStyles() : null;
  const children = imported.children ? await imported.getChildren() : [];
  report(`WHTML import created a ${imported.type} with ${children.length} direct child and styles ${styles?.filter(Boolean).map((style) => style?.name).join(", ") || "none"}.`);
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
  const tryWHTML = async (): Promise<void> => {
    setBusy(true);
    try { await testWHTMLImport(setMessage); setSnapshot(await inspect()); }
    catch (error) { setMessage(`WHTML test stopped: ${String(error)}`); }
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
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void checkLab(); }}>Check styles + Embed API</button>
      <button className="secondary" disabled={busy || snapshot?.site !== "Smashburger" || !snapshot.proofExists} onClick={() => { void tryWHTML(); }}>Test native WHTML import</button>
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
    </dl>}
  </main>;
};

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing root element");
ReactDOM.createRoot(rootEl).render(<App />);
