import { z } from "zod";
import { readFileSync } from "node:fs";
export const categories = [
  ...new Set([
    ...JSON.parse(
      readFileSync(
        new URL("../src/data/categories.json", import.meta.url),
        "utf8",
      ),
    ),
    "Grill",
    "Wraps",
    "Vegetarisch",
    "Beilagen",
    "Getränke",
    "Kebabs",
  ]),
];
const text = (min = 0, max = 200) => z.string().trim().min(min).max(max);
const money = z
  .number()
  .min(0)
  .max(10000)
  .refine(
    (n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-7,
    "Höchstens zwei Nachkommastellen",
  );
const choice = z.object({
  id: text(1, 60),
  name: text(1, 120),
  price: money.optional(),
});
export const productSchema = z
  .object({
    variants: z
      .array(
        z.object({
          id: text(1, 100),
          name: text(1, 120),
          price: money,
          optionGroups: z
            .array(
              z.object({
                id: text(1, 60),
                name: text(1, 120),
                required: z.boolean(),
                options: z.array(choice).min(1).max(100),
              }),
            )
            .max(20),
          extras: z.array(choice.extend({ price: money })).max(100),
        }),
      )
      .max(20)
      .default([]),
    ingredients: z.array(text(1, 120)).max(60).default([]),
    modelUrl: text(0, 2048)
      .refine(
        (s) => !s || /^https:\/\/.+\.(glb|gltf)(\?.*)?$/.test(s),
        "HTTPS GLB/GLTF URL erforderlich",
      )
      .default(""),
    productInfo: text(0, 1000).default(""),
    depositCents: z.number().int().min(0).default(0),
    minAge: z.number().int().min(0).max(18).default(0),
    allergenCodes: z.array(z.string()).default([]),
    additiveCodes: z.array(z.string()).default([]),
    configurationPending: z.boolean().default(false),
    sourceUrl: text(0, 2048).default(""),
    name: text(1, 120),
    description: text(0, 2000),
    category: z.enum(categories),
    price: money,
    imageUrl: text(0, 2048).refine(
      (s) => !s || s.startsWith("assets/") || /^https:\/\//.test(s),
      "HTTPS-Bild-URL erforderlich",
    ),
    available: z.boolean().default(true),
    stockAvailable: z.boolean().default(true),
    featured: z.boolean().default(false),
    internalNotes: text(0, 2000).default(""),
    optionGroups: z
      .array(
        z.object({
          id: text(1, 60),
          name: text(1, 120),
          required: z.boolean().optional(),
          options: z.array(choice).min(1).max(100),
        }),
      )
      .max(10)
      .default([]),
    extras: z
      .array(choice.extend({ price: money }))
      .max(100)
      .default([]),
  })
  .superRefine((p, ctx) => {
    const unique = (values) => new Set(values).size === values.length;
    if (
      !unique(p.variants.map((v) => v.id)) ||
      p.variants.some(
        (v) =>
          !unique(v.extras.map((x) => x.id)) ||
          !unique(v.optionGroups.map((x) => x.id)) ||
          v.optionGroups.some(
            (g) => g.id === "variant" || !unique(g.options.map((x) => x.id)),
          ),
      )
    )
      ctx.addIssue({
        code: "custom",
        message: "Varianten-IDs müssen eindeutig sein",
      });
    if (
      p.optionGroups.some((g) => g.id === "variant") ||
      !unique(p.extras.map((x) => x.id)) ||
      !unique(p.optionGroups.map((x) => x.id)) ||
      p.optionGroups.some((g) => !unique(g.options.map((x) => x.id)))
    )
      ctx.addIssue({
        code: "custom",
        message: "Options-IDs müssen eindeutig sein",
      });
  });
export const customerSchema = z
  .object({
    smsOptIn: z.boolean().default(false),
    name: text(2, 120),
    email: z.string().trim().email().max(254),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Telefon: 10–15 Ziffern"),
    address: text(0, 300).optional(),
  })
  .refine(
    (c) => !c.smsOptIn || /^\+[1-9][0-9]{9,14}$/.test(c.phone),
    "SMS erfordert eine Telefonnummer mit Ländervorwahl, z. B. +49",
  );
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const orderSchema = z.object({
  expectedTotalCents: z.number().int().min(0),
  ageConfirmed: z.boolean().default(false),
  customer: customerSchema,
  notes: text(0, 2000).default(""),
  date: dateSchema,
  time: timeSchema,
  requestKey: z.string().uuid(),
  items: z
    .array(
      z.object({
        id: text(1, 100),
        quantity: z.number().int().min(1).max(20),
        options: z.record(z.string(), z.string()).default({}),
        extras: z.array(z.string()).max(100).default([]),
      }),
    )
    .min(1)
    .max(50),
});
export const reservationSchema = z.object({
  customer: customerSchema,
  date: dateSchema,
  time: timeSchema,
  people: z.number().int().min(1).max(20),
  notes: text(0, 2000).default(""),
  requestKey: z.string().uuid(),
});
const hoursSchema = z
  .object({ closed: z.boolean(), open: timeSchema, close: timeSchema })
  .refine(
    (h) => h.closed || h.open < h.close,
    "Schluss muss nach Öffnung liegen",
  );
export const settingsSchema = z.object({
  isOpen: z.boolean(),
  openingHours: z.array(hoursSchema).length(7),
  slotMinutes: z.union([z.literal(30), z.literal(60)]),
  durationMinutes: z.number().int().min(30).max(240),
  leadMinutes: z.number().int().min(0).max(10080),
  slotLimit: z.number().int().min(1).max(100),
  totalTables: z.number().int().min(1).max(100),
  tableCapacity: z.number().int().min(1).max(20),
  preparationMinutes: z.number().int().min(5).max(180),
  autoConfirm: z.boolean(),
});
export const defaults = {
  isOpen: false,
  openingHours: Array.from({ length: 7 }, () => ({
    closed: true,
    open: "11:00",
    close: "22:00",
  })),
  slotMinutes: 30,
  durationMinutes: 90,
  leadMinutes: 120,
  slotLimit: 4,
  totalTables: 8,
  tableCapacity: 4,
  preparationMinutes: 45,
  autoConfirm: false,
};
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export function assert(value, status, message) {
  if (!value) throw new HttpError(status, message);
}
