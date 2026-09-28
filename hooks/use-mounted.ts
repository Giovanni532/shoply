import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/** Vrai une fois côté client : pour afficher ce qui dépend du localStorage (panier, thème) sans écart d'hydratation. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
