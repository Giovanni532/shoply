export const paths = {
    home: "/",
    auth: {
        login: "/login",
        signup: "/signup",
    },
    // Produits
    products: {
        list: "/products", // page liste des produits
        details: (slug: string) => `/products/${slug}`, // fiche produit (par slug)
    },

    // Panier & Paiement
    cart: "/cart",
    checkout: "/checkout",
    success: "/checkout/success", // après paiement réussi
    cancel: "/checkout/cancel",   // si paiement annulé

    // Espace utilisateur
    account: {
        profile: "/account/profile",
        orders: "/account/orders",      // historique de commandes
        settings: "/account/settings",  // infos personnelles
    },

    // Informations légales (souvent obligatoires en ecommerce)
    legal: {
        about: "/about",
        contact: "/contact",
        terms: "/terms",   // CGV
        privacy: "/privacy", // politique de confidentialité
    },
}