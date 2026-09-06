import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { it } from "node:test";
import { GoogleAnalytics } from "../components/GoogleAnalytics";

it("does not load analytics without a valid measurement ID", () => {
  for (const measurementId of [undefined, "", "G-", "G-123';alert(1)//"]) {
    assert.equal(GoogleAnalytics({ measurementId }), null);
  }
});

it("loads the configured tag and initializes that property without replacing queued events", () => {
  const result = GoogleAnalytics({ measurementId: "G-TEST123456" });
  assert.ok(result);
  const [loader, initializer] = result.props.children;
  assert.equal(loader.props.src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  const dataLayer: unknown[] = ["existing-event"];
  const context = { window: { dataLayer }, dataLayer, Date };
  runInNewContext(initializer.props.children, context);
  assert.equal(dataLayer[0], "existing-event");
  assert.equal(Array.from(dataLayer[1] as IArguments)[0], "js");
  assert.deepEqual(Array.from(dataLayer[2] as IArguments), ["config", "G-TEST123456"]);
});
