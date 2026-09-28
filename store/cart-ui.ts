import { create } from "zustand"

// Ouverture du tiroir panier, partagée : un ajout depuis n'importe quelle page l'ouvre
export const useCartUi = create<{ open: boolean; setOpen: (open: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))
