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
  props: string[];
  marker: string;
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
  const marker = selected?.attributes
    ? await selected.getResolvedAttributeValue("data-mwp-navbar") : null;
  return {
    site: site.siteName,
    selected: selected ? selected.type : "Nothing selected",
    breakpoints: queries.map((query) => `${query.name} (${query.id})`),
    component: component ? await component.getName() : "Native or none",
    origin: component ? component.library ? "Linked Library" : component.readOnly ? "Read-only" : "Project-native" : "—",
    variants: variants.map((variant) => variant.name),
    props: props.map((prop) => `${prop.group || "Ungrouped"} / ${prop.name}`),
    marker: marker ?? "Not on selected element",
    canAppend: Boolean(selected?.children),
    proofExists: names.includes(PROOF_NAME),
    whtml: Boolean(selected && webflow.getWHTML && await webflow.getWHTML(selected)),
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
  if (queries.some((query) => query.id === "medium")) await rowStyle.setProperties({ "flex-wrap": "wrap" }, { breakpoint: "medium" });
  if (queries.some((query) => query.id === "tiny")) await navStyle.setProperties({ padding: "12px 16px" }, { breakpoint: "tiny" });
  if (queries.some((query) => query.id === "large")) await navStyle.setProperties({ padding: "20px 32px" }, { breakpoint: "large" });

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
    { type: "string", name: "Brand label", group: "Content", defaultValue: "SmashBurger proof" },
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
      <dt>Properties</dt><dd>{snapshot.props.join(", ") || "—"}</dd>
      <dt>WHTML export</dt><dd>{snapshot.whtml ? "Available" : "Unavailable for this selection"}</dd>
      <dt>Proof on site</dt><dd>{snapshot.proofExists ? "Present" : "Absent"}</dd>
    </dl>}
  </main>;
};

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing root element");
ReactDOM.createRoot(rootEl).render(<App />);
