import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { productSchema } from "../validation.mjs";
import { priceOrder, parseSlot } from "../domain.mjs";
const products = JSON.parse(
  readFileSync(new URL("../seed-products.json", import.meta.url)),
);
test("complete source menu validates, including every size, required choice and extra", async () => {
  assert.equal(products.length, 169);
  assert.equal(new Set(products.map((p) => p.id)).size, 169);
  assert.equal(new Set(products.map((p) => p.category)).size, 13);
  for (const source of products) {
    const product = productSchema.parse(source);
    assert.equal(product.configurationPending, false);
    assert.equal(product.sourceUrl, "https://www.urfagrill-hildesheim.de/");
    const tx = { query: async () => ({ rows: [{ data: product }] }) };
    for (const size of product.variants.length ? product.variants : [product]) {
      const options = Object.fromEntries(
        size.optionGroups.map((g) => [g.id, g.options[0].id]),
      );
      if (product.variants.length) options.variant = size.id;
      const extras = size.extras.map((e) => e.id);
      const priced = await priceOrder(
        tx,
        [{ id: source.id, quantity: 2, options, extras }],
        true,
      );
      const expected =
        Math.round(size.price * 100) +
        size.optionGroups.reduce(
          (s, g) => s + Math.round((g.options[0].price || 0) * 100),
          0,
        ) +
        size.extras.reduce((s, e) => s + Math.round(e.price * 100), 0);
      assert.equal(priced.totalCents, expected * 2, source.name);
    }
  }
});
test("DST gap and invalid calendar dates cannot become a different booking time", () => {
  assert.throws(() => parseSlot("2027-03-28", "02:30"));
  assert.throws(() => parseSlot("2026-02-30", "12:00"));
});
