import { z } from "zod";
import { GRAIN_TYPES, COUNTRIES, PRICE_MODES, CURRENCIES } from "@/lib/constants";

const grainValues = GRAIN_TYPES.map((g) => g.value) as [string, ...string[]];
const countryValues = COUNTRIES.map((c) => c.value) as [string, ...string[]];
const priceModeValues = PRICE_MODES.map((p) => p.value) as [string, ...string[]];
const currencyValues = CURRENCIES.map((c) => c.value) as [string, ...string[]];

export const listingSchema = z
  .object({
    grain_type: z.enum(grainValues, { message: "Elegí un grano" }),
    tonnage: z
      .number({ invalid_type_error: "Toneladas debe ser un número" })
      .positive("Las toneladas deben ser mayores a 0")
      .max(1_000_000, "Volumen poco realista"),
    country: z.enum(countryValues, { message: "Elegí un país" }),
    region: z.string().trim().min(2, "La región es muy corta"),
    city: z.string().trim().min(2, "La ciudad es muy corta"),
    price_mode: z.enum(priceModeValues),
    price: z
      .number({ invalid_type_error: "Precio debe ser un número" })
      .nonnegative("El precio no puede ser negativo")
      .nullable()
      .optional(),
    currency: z.enum(currencyValues),
    delivery_date: z
      .string()
      .min(1, "Cargá una fecha")
      .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida"),
    description: z.string().max(2000, "Máximo 2000 caracteres").optional(),
    image_url: z
      .string()
      .url("Debe ser una URL válida")
      .or(z.literal(""))
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.price_mode === "fixed" && (val.price == null || val.price === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["price"],
        message: "Cargá un precio o cambiá la modalidad a «A convenir»",
      });
    }
  });

export type ListingInput = z.infer<typeof listingSchema>;
