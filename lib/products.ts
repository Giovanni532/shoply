import { and, asc, eq } from "drizzle-orm"
import { product, productImage } from "@/db/schema"
import { getModel } from "@/lib/catalog"
import { db } from "@/lib/drizzle"

// Lecture du catalogue côté serveur : la base donne prix, stock et nom,
// le catalogue statique (lib/catalog.ts) complète la fiche.
export type ProductView = {
  id: string
  slug: string
  name: string
  description: string | null
  priceCents: number
  currency: string
  stock: number
  imageUrl: string | null
  createdAt: number
}

const columns = {
  id: product.id,
  slug: product.slug,
  name: product.name,
  description: product.description,
  priceCents: product.priceCents,
  currency: product.currency,
  stock: product.stock,
  createdAt: product.createdAt,
  imageUrl: productImage.url,
}

type Row = { [K in keyof typeof columns]: unknown }

function toView(row: Row): ProductView {
  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    priceCents: row.priceCents as number,
    currency: row.currency as string,
    stock: row.stock as number,
    imageUrl: (row.imageUrl as string | null) ?? null,
    createdAt: (row.createdAt as Date).getTime(),
  }
}

// Ordre de la gamme : N°01, N°02, N°03… puis les produits sans fiche, du plus récent au plus ancien
function byRange(a: ProductView, b: ProductView) {
  const ma = getModel(a.slug)
  const mb = getModel(b.slug)
  if (ma && mb) return ma.code.localeCompare(mb.code)
  if (ma) return -1
  if (mb) return 1
  return b.createdAt - a.createdAt
}

/** Produits actifs (une ligne par produit, première image) */
export async function listProducts(): Promise<ProductView[]> {
  const rows = await db
    .select(columns)
    .from(product)
    .leftJoin(productImage, eq(productImage.productId, product.id))
    .where(eq(product.isActive, true))
    .orderBy(asc(productImage.position))

  const byId = new Map<string, ProductView>()
  for (const row of rows) if (!byId.has(row.id)) byId.set(row.id, toView(row))
  return [...byId.values()].sort(byRange)
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  const rows = await db
    .select(columns)
    .from(product)
    .leftJoin(productImage, eq(productImage.productId, product.id))
    .where(and(eq(product.slug, slug), eq(product.isActive, true)))
    .orderBy(asc(productImage.position))
    .limit(1)
  return rows[0] ? toView(rows[0]) : null
}
