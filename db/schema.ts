import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: integer('email_verified', { mode: 'boolean' }).$defaultFn(() => false).notNull(),
    image: text('image'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = sqliteTable("session", {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable("account", {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable("verification", {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date())
});

// --- E-commerce ---

export const category = sqliteTable("category", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    isActive: integer('is_active', { mode: 'boolean' }).$defaultFn(() => true).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const product = sqliteTable("product", {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').$defaultFn(() => 'CHF').notNull(),
    stock: integer('stock').$defaultFn(() => 0).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).$defaultFn(() => true).notNull(),
    categoryId: text('category_id').references(() => category.id, { onDelete: 'set null' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const productImage = sqliteTable("product_image", {
    id: text('id').primaryKey(),
    productId: text('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    alt: text('alt'),
    position: integer('position').$defaultFn(() => 0).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const address = sqliteTable("address", {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    fullName: text('full_name').notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: text('city').notNull(),
    postalCode: text('postal_code').notNull(),
    country: text('country').notNull(),
    phone: text('phone'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const order = sqliteTable("order", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').$defaultFn(() => 'pending').notNull(), // pending, paid, shipped, delivered, cancelled
    subtotalCents: integer('subtotal_cents').notNull(),
    shippingCents: integer('shipping_cents').$defaultFn(() => 0).notNull(),
    totalCents: integer('total_cents').notNull(),
    currency: text('currency').$defaultFn(() => 'CHF').notNull(),
    shippingAddressId: text('shipping_address_id').references(() => address.id, { onDelete: 'set null' }),
    billingAddressId: text('billing_address_id').references(() => address.id, { onDelete: 'set null' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const orderItem = sqliteTable("order_item", {
    id: text('id').primaryKey(),
    orderId: text('order_id').notNull().references(() => order.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull().references(() => product.id, { onDelete: 'restrict' }),
    name: text('name').notNull(), // snapshot of product name
    unitPriceCents: integer('unit_price_cents').notNull(),
    quantity: integer('quantity').$defaultFn(() => 1).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const payment = sqliteTable("payment", {
    id: text('id').primaryKey(),
    orderId: text('order_id').notNull().references(() => order.id, { onDelete: 'cascade' }),
    provider: text('provider'), // e.g., stripe
    providerPaymentId: text('provider_payment_id'),
    status: text('status').$defaultFn(() => 'pending').notNull(), // pending, succeeded, failed, refunded
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').$defaultFn(() => 'CHF').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});
// Export du schéma complet pour Better Auth et Drizzle
export const schema = {
    user,
    session,
    account,
    verification,
    category,
    product,
    productImage,
    address,
    order,
    orderItem,
    payment,
};
