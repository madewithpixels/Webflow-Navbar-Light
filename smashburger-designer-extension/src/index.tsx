import type {} from "@webflow/designer-extension-typings";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const PROOF_NAME = "SmashBurger API proof";

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

async function createProof(report: (message: string) => void): Promise<void> {
  const selected = await webflow.getSelectedElement();
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
  const root = webflow.elementBuilder(webflow.elementPresets.DivBlock);
  root.setTag("header");
  root.setStyles([navStyle]);
  root.setAttribute("data-mwp-prototype", "api-proof-v1");
  const row = root.append(webflow.elementPresets.DivBlock);
  row.setStyles([rowStyle]);
  const brand = row.append(webflow.elementPresets.TextLink);
  brand.setStyles([linkStyle]);
  brand.setAttribute("href", "#");
  brand.setTextContent("SmashBurger proof");
  const nav = row.append(webflow.elementPresets.DivBlock);
  nav.setTag("nav");
  nav.setAttribute("aria-label", "Proof navigation");
  nav.setStyles([rowStyle]);
  for (const label of ["Home", "About", "Contact"]) {
    const link = nav.append(webflow.elementPresets.TextLink);
    link.setStyles([linkStyle]);
    link.setAttribute("href", "#");
    link.setTextContent(label);
  }
  const inserted = await selected.append(root);
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
  if (brandLink?.attributes) await brandLink.setAttribute("aria-label", { sourceType: "prop", propId: labelProp.id });
  if (navElement?.attributes) await navElement.setAttribute("aria-label", { sourceType: "prop", propId: ariaProp.id });
  report("Proof created. Inspect the project component in Designer.");
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
  useEffect(() => { void refresh(); }, []);
  const makeProof = async (): Promise<void> => {
    setBusy(true);
    try { await createProof(setMessage); setSnapshot(await inspect()); }
    catch (error) { setMessage(`Proof stopped: ${String(error)}`); }
    finally { setBusy(false); }
  };
  return <main>
    <div className="eyebrow">SmashBurger · private prototype</div>
    <h1>Designer capability check</h1>
    <p>Inspect a navbar or create a disposable native proof on a spare page. This is not the production menu.</p>
    <div className="actions">
      <button disabled={busy} onClick={() => { void refresh(); }}>Inspect selection</button>
      <button className="secondary" disabled={busy || !snapshot?.canAppend || snapshot.proofExists} onClick={() => { void makeProof(); }}>Create native proof</button>
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
