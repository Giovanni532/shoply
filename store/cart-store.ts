import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Align with DB schema: product has id, name, priceCents, currency, images, etc.
export type CartLine = {
    productId: string;
    slug?: string; // pour le dessin de la lampe (absent des paniers enregistrés avant la refonte)
    name: string; // snapshot of product name
    unitPriceCents: number; // snapshot price in cents
    currency: string; // e.g. CHF
    imageUrl?: string;
    quantity: number;
};

type CartState = {
    lines: CartLine[];
    currency: string; // main currency for totals
};

type CartActions = {
    addItem: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
    removeItem: (productId: string) => void;
    setQuantity: (productId: string, quantity: number) => void;
    increment: (productId: string, by?: number) => void;
    decrement: (productId: string, by?: number) => void;
    clear: () => void;
};

function clampQuantity(quantity: number): number {
    return Math.max(1, Math.min(999, Math.floor(quantity)));
}

export const useCartStore = create<CartState & CartActions>()(
    persist(
        (set) => ({
            lines: [],
            currency: "CHF",

            addItem: (line) => {
                const quantityToAdd = clampQuantity(line.quantity ?? 1);
                set((state) => {
                    const index = state.lines.findIndex((l) => l.productId === line.productId);
                    if (index === -1) {
                        return {
                            ...state,
                            currency: line.currency || state.currency,
                            lines: [
                                ...state.lines,
                                {
                                    productId: line.productId,
                                    slug: line.slug,
                                    name: line.name,
                                    unitPriceCents: line.unitPriceCents,
                                    currency: line.currency || state.currency,
                                    imageUrl: line.imageUrl,
                                    quantity: quantityToAdd,
                                },
                            ],
                        };
                    }
                    const updated = [...state.lines];
                    updated[index] = {
                        ...updated[index],
                        quantity: clampQuantity(updated[index].quantity + quantityToAdd),
                        name: line.name || updated[index].name,
                        unitPriceCents: line.unitPriceCents ?? updated[index].unitPriceCents,
                        currency: line.currency || updated[index].currency,
                        imageUrl: line.imageUrl ?? updated[index].imageUrl,
                        slug: line.slug ?? updated[index].slug,
                    };
                    return { ...state, lines: updated };
                });
            },

            removeItem: (productId) =>
                set((state) => ({ ...state, lines: state.lines.filter((l) => l.productId !== productId) })),

            setQuantity: (productId, quantity) =>
                set((state) => {
                    const updated = state.lines.map((l) =>
                        l.productId === productId ? { ...l, quantity: clampQuantity(quantity) } : l
                    );
                    return { ...state, lines: updated };
                }),

            increment: (productId, by = 1) =>
                set((state) => {
                    const updated = state.lines.map((l) =>
                        l.productId === productId ? { ...l, quantity: clampQuantity(l.quantity + by) } : l
                    );
                    return { ...state, lines: updated };
                }),

            decrement: (productId, by = 1) =>
                set((state) => {
                    const updated = state.lines.map((l) =>
                        l.productId === productId ? { ...l, quantity: clampQuantity(l.quantity - by) } : l
                    );
                    return { ...state, lines: updated };
                }),

            clear: () => set({ lines: [] }),
        }),
        {
            name: "shoply-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ lines: state.lines, currency: state.currency }),
            version: 1,
            migrate: (persistedState: any) => persistedState,
        }
    )
);

export const selectCartLines = (s: CartState) => s.lines;
export const selectCartTotalQuantity = (s: CartState) => s.lines.reduce((sum, l) => sum + l.quantity, 0);
export const selectCartSubtotalCents = (s: CartState) =>
    s.lines.reduce((sum, l) => sum + l.quantity * l.unitPriceCents, 0);
export const selectCartCurrency = (s: CartState) => s.currency;


